<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use App\Models\Cart;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Services\PHPMailerService;
use App\Services\VNPayService;

class OrderController extends Controller
{
    // Lấy danh sách tất cả đơn hàng
    public function index()
    {
        // Lấy thêm các chi tiết đơn hàng
        $orders = Order::with('chiTietDonHangs')
            ->orderBy('id', 'desc')
            ->get();

        return OrderResource::collection($orders);
    }

    // Tạo đơn hàng mới

    /**
     * Tao don hang tu gio hang trong database.
     */
    public function store(OrderRequest $request): JsonResponse
{
    try {
        $data = $request->validated();

        // Lay tai khoan tu token Sanctum neu khach da dang nhap
        $user = Auth::guard('sanctum')->user();

        // Khach chua dang nhap phai co session_id
        if (!$user && empty($data['session_id'])) {
            return response()->json([
                'message' => 'Vui long cung cap session_id cua gio hang.'
            ], 422);
        }

        $order = DB::transaction(function () use ($data, $user) {
            $cart = null;

            // Uu tien gio theo session_id
            if (!empty($data['session_id'])) {
                $cart = Cart::where('session_id', $data['session_id'])
                    ->lockForUpdate()
                    ->first();
            }

            // Khong co thi lay gio cua tai khoan
            if (!$cart && $user) {
                $cart = Cart::where('nguoi_dung_id', $user->id)
                    ->lockForUpdate()
                    ->first();
            }

            Log::info('Ket qua tim gio hang', [
                'cart_id' => $cart?->id,
                'cart_user_id' => $cart?->nguoi_dung_id,
                'cart_session_id' => $cart?->session_id,
                'has_request_items' => !empty($data['items']),
            ]);

            // Lay danh sach san pham can dat:
            // Uu tien lay tu request do frontend truyen len (tu gio hang localStorage)
            $items = [];
            if (!empty($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $it) {
                    $pid = $it['san_pham_id'] ?? $it['productId'] ?? ($it['id'] ?? null);
                    $qty = (int) ($it['so_luong'] ?? $it['quantity'] ?? 1);
                    if ($pid && $qty > 0) {
                        $items[] = (object) [
                            'san_pham_id' => $pid,
                            'so_luong' => $qty,
                        ];
                    }
                }
            } elseif ($cart) {
                // Neu frontend khong gui truc tiep, lay tu bang chi_tiet_gio_hang trong database
                $items = $cart->chiTietGioHangs()->get();
            }

            if (empty($items) || (is_countable($items) && count($items) === 0)) {
                throw new \RuntimeException('Gio hang dang trong.');
            }

            $total = 0;
            $details = [];

            foreach ($items as $item) {
                // Khoa dong san pham de tranh xung dot ton kho
                $product = \App\Models\Product::whereKey($item->san_pham_id)
                    ->lockForUpdate()
                    ->first();

                if (!$product || !$product->trang_thai) {
                    throw new \RuntimeException('Co san pham khong con kinh doanh.');
                }

                if ($item->so_luong < 1 || $product->so_luong_ton < $item->so_luong) {
                    throw new \RuntimeException(
                        'San pham ' . $product->ten . ' khong du so luong ton kho.'
                    );
                }

                // Lay gia khuyen mai neu hop le
                $price = $product->gia;

                if (
                    $product->gia_khuyen_mai !== null &&
                    $product->gia_khuyen_mai > 0 &&
                    $product->gia_khuyen_mai < $product->gia
                ) {
                    $price = $product->gia_khuyen_mai;
                }

                $total += $price * $item->so_luong;

                $details[] = [
                    'san_pham_id' => $product->id,
                    'so_luong' => $item->so_luong,
                    'gia' => $price,
                ];

                // Tru so luong ton kho
                $product->decrement('so_luong_ton', $item->so_luong);
            }

            // Tao ma tam duy nhat truoc khi cap nhat ma theo ID
            $order = Order::create([
                'nguoi_dung_id' => $user?->id,
                'ma_don_hang' => 'TMP' . Str::upper(Str::random(16)),
                'ten_nguoi_nhan' => $data['ten_nguoi_nhan'],
                'so_dien_thoai' => $data['so_dien_thoai'],
                'dia_chi' => $data['dia_chi'],
                'phuong_thuc_thanh_toan' => $data['phuong_thuc_thanh_toan'],
                'khuyen_mai_id' => null,
                'tong_tien' => $total,
                'trang_thai' => 0, // 0 = Cho xu ly
            ]);

            // Cap nhat ma don hang theo ID
            $order->update([
                'ma_don_hang' => 'DH' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
            ]);

            // Tao chi tiet don hang
            foreach ($details as $detail) {
                $order->chiTietDonHangs()->create($detail);
            }

            // Xoa cac san pham da dat khoi gio hang database (neu co)
            if ($cart) {
                $cart->chiTietGioHangs()->delete();
            }

            return $order;
        });

        // Nạp thêm chi tiết sản phẩm và thông tin người dùng vào đối tượng $order
        $order->load(['chiTietDonHangs.sanPham', 'nguoiDung']);

        // ====================================================================
        // XỬ LÝ THANH TOÁN THEO PHƯƠNG THỨC
        // ====================================================================
        $paymentUrl = null;

        if ($order->phuong_thuc_thanh_toan === 'vnpay') {
            // Khách chọn thanh toán bằng VNPAY / VNPAY-QR
            // Tạo đường dẫn thanh toán VNPAY
            $bankCode = $request->input('bank_code'); // Có thể là VNPAYQR, VNBANK, hoặc để trống cho khách tự chọn
            $paymentUrl = VNPayService::createPaymentUrl($order, $request->ip(), $bankCode);
        } else {
            // Phương thức COD hoặc Chuyển khoản thông thường:
            // Gửi email xác nhận đặt hàng ngay qua PHPMailer
            $customerEmail = !empty($data['email']) ? $data['email'] : ($user?->email ?? $order->nguoiDung?->email);
            if ($customerEmail) {
                PHPMailerService::sendOrderConfirmation($order, $customerEmail);
            }
        }

        return response()->json([
            'message' => 'Dat hang thanh cong.',
            'data' => new OrderResource($order),
            'payment_url' => $paymentUrl, // URL chuyển hướng sang VNPAY (nếu chọn VNPAY)
        ], 201);
    } catch (\RuntimeException $e) {
        return response()->json([
            'message' => $e->getMessage(),
        ], 422);
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Tao don hang that bai.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Lấy danh sách đơn hàng CỦA NGƯỜI DÙNG ĐANG ĐĂNG NHẬP.
     * (Hàm index() ở trên trả về đơn của tất cả mọi người, dành cho admin)
     */
    public function myOrders(): JsonResponse
    {
        // Lấy user từ token gửi kèm request (Authorization: Bearer ...)
        $user = Auth::guard('sanctum')->user();

        // Không có token hoặc token sai -> báo cần đăng nhập
        if (!$user) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        // Chỉ lấy đơn có nguoi_dung_id trùng với user hiện tại.
        // with(...) nạp luôn chi tiết đơn + sản phẩm để khỏi query lẻ từng đơn.
        // orderByDesc('id') -> đơn mới nhất hiện lên đầu.
        $orders = Order::with('chiTietDonHangs.sanPham')
            ->where('nguoi_dung_id', $user->id)
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => OrderResource::collection($orders),
        ]);
    }

    /**
     * Khách tự hủy đơn.
     * Chỉ cho hủy khi đơn còn "Chờ xử lý" (trang_thai = 0).
     * Khi hủy sẽ trả lại số lượng tồn kho cho sản phẩm.
     */
    public function cancel($id): JsonResponse
    {
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        try {
            // Transaction: hoặc làm xong hết, hoặc lỗi thì hoàn tác hết
            DB::transaction(function () use ($id, $user) {

                // Tìm đơn theo id, nhưng PHẢI là đơn của chính user này
                // (tránh user A hủy đơn của user B).
                // lockForUpdate() khóa dòng, tránh 2 request hủy cùng lúc.
                $order = Order::where('nguoi_dung_id', $user->id)
                    ->lockForUpdate()
                    ->findOrFail($id);

                // Đơn đã xử lý/giao/hủy rồi thì không cho hủy nữa
                if ((int) $order->trang_thai !== 0) {
                    throw new \RuntimeException('Chỉ hủy được đơn đang chờ xử lý.');
                }

                // Trả lại tồn kho: cộng lại số lượng từng sản phẩm trong đơn
                foreach ($order->chiTietDonHangs as $detail) {
                    \App\Models\Product::whereKey($detail->san_pham_id)
                        ->increment('so_luong_ton', $detail->so_luong);
                }

                // Đổi trạng thái sang 4 = Đã hủy
                $order->update(['trang_thai' => 4]);
            });

            return response()->json(['message' => 'Hủy đơn hàng thành công.']);
        } catch (\RuntimeException $e) {
            // Lỗi nghiệp vụ do mình chủ động throw ở trên
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Throwable $e) {
            // Lỗi bất ngờ khác (không tìm thấy đơn, lỗi DB...)
            return response()->json(['message' => 'Hủy đơn hàng thất bại.'], 500);
        }
    }


    // Xem một đơn hàng
    public function show($id)
    {
        // Tìm đơn hàng theo ID
        $order = Order::with('chiTietDonHangs.sanPham')
            ->findOrFail($id);

        return new OrderResource($order);
    }

    // Cập nhật đơn hàng
    public function update(OrderRequest $request, $id): JsonResponse|OrderResource
    {
        try {
            $order = Order::findOrFail($id);

            // Đơn đã hủy thì không được cập nhật
            if ((int) $order->trang_thai === 4) {
                return response()->json([
                    'message' => 'Đơn hàng đã hủy, không thể cập nhật.'
                ], 422);
            }

            $data = $request->validated();

            $order->update($data);

            $order->load('chiTietDonHangs.sanPham');

            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công.',
                'data' => new OrderResource($order)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật đơn hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Cap nhat trang thai don hang
    public function updateStatus(Request $request, $id): JsonResponse
    {
        // Tim don hang theo ID
        $order = Order::findOrFail($id);

        // Don da huy hoac da giao thi khong cho cap nhat
        if (in_array((int) $order->trang_thai, [2, 3, 4], true)) {
            return response()->json([
                'message' => 'Don hang dang giao, da giao hoac da huy, khong the cap nhat.'
            ], 422);
        }

        // Kiem tra trang thai moi
        $data = $request->validate([
            'trang_thai' => 'required|integer|in:0,1,2,3,4',
        ]);

        // Cap nhat trang thai
        $order->update([
            'trang_thai' => $data['trang_thai'],
        ]);

        return response()->json([
            'message' => 'Cap nhat trang thai don hang thanh cong.',
            'data' => new OrderResource(
                $order->load('chiTietDonHangs.sanPham')
            ),
        ]);
    }


    // Xóa đơn hàng
    public function destroy($id): JsonResponse
    {
        try {
            // Tìm đơn hàng
            $order = Order::findOrFail($id);

            // Xóa đơn hàng
            $order->delete();

            return response()->json([
                'message' => 'Xóa đơn hàng thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Xóa đơn hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
