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

            // Uu tien gio dang hien tren giao dien (theo session_id)
            if (!empty($data['session_id'])) {
                $cart = Cart::whereNull('nguoi_dung_id')
                    ->where('session_id', $data['session_id'])
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
            ]);

            if (!$cart) {
                throw new \RuntimeException('Khong tim thay gio hang.');
            }

            // Lay cac san pham trong gio hang
            $items = $cart->chiTietGioHangs()->get();

            if ($items->isEmpty()) {
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

            // Xoa cac san pham da dat khoi gio hang
            $cart->chiTietGioHangs()->delete();

            return $order;
        });

        $order->load('chiTietDonHangs.sanPham');

        return response()->json([
            'message' => 'Dat hang thanh cong.',
            'data' => new OrderResource($order),
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


    // Xem một đơn hàng
    public function show($id)
    {
        // Tìm đơn hàng theo ID
        $order = Order::with('chiTietDonHangs')
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
