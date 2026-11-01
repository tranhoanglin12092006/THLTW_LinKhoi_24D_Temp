<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItemRequest;
use App\Http\Requests\CartRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Lấy danh sách tất cả giỏ hàng.
     */
    public function index()
    {
        try {
            // Lấy giỏ hàng và lấy luôn các chi tiết bên trong.
            $carts = Cart::with(['chiTietGioHangs.sanPham.danhMuc', 'chiTietGioHangs.sanPham.thuongHieu'])
                ->orderBy('id')
                ->get();

            return response()->json([
                'message' => 'Lấy danh sách giỏ hàng thành công.',
                'data' => CartResource::collection($carts)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lấy danh sách giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo một giỏ hàng mới.
     */
    public function store(CartRequest $request): JsonResponse
    {
        try {
            // Lấy dữ liệu đã được kiểm tra.
            $data = $request->validated();

            // Tạo giỏ hàng mới.
            $cart = Cart::create($data);

            // Trả về giỏ hàng vừa tạo.
            return response()->json([
                'message' => 'Tạo giỏ hàng thành công.',
                'data' => new CartResource($cart)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tạo giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Lay hoac tao gio hang cho khach vang lai.
     */
    public function guestCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|min:32|max:100',
        ]);

        try {
            $cart = Cart::with(['chiTietGioHangs.sanPham.danhMuc', 'chiTietGioHangs.sanPham.thuongHieu'])
                ->whereNull('nguoi_dung_id')
                ->where('session_id', $validated['session_id'])
                ->first();

            if (!$cart) {
                $cart = Cart::create([
                    'nguoi_dung_id' => null,
                    'session_id' => $validated['session_id'],
                ]);

                $cart->load(['chiTietGioHangs.sanPham.danhMuc', 'chiTietGioHangs.sanPham.thuongHieu']);
            }

            return response()->json([
                'message' => 'Lay gio hang thanh cong.',
                'data' => new CartResource($cart),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Khong the lay gio hang.',
            ], 500);
        }
    }

    /**
     * Gop gio hang khach vao tai khoan sau khi dang nhap.
     */
    public function mergeGuestCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'required|string|min:32|max:100',
        ]);

        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json([
                'message' => 'Vui long dang nhap.',
            ], 401);
        }

        try {
            $cart = DB::transaction(function () use ($validated, $user) {
                // Tim gio hang cua khach.
                $guestCart = Cart::whereNull('nguoi_dung_id')
                    ->where('session_id', $validated['session_id'])
                    ->lockForUpdate()
                    ->first();

                // Tim gio hang cua tai khoan.
                $userCart = Cart::where('nguoi_dung_id', $user->id)
                    ->lockForUpdate()
                    ->first();

                // Neu khach chua co gio hang, tra ve gio hang tai khoan.
                if (!$guestCart) {
                    return $userCart;
                }

                // Neu tai khoan chua co gio hang, chuyen gio hang khach sang tai khoan.
                if (!$userCart) {
                    $guestCart->update([
                        'nguoi_dung_id' => $user->id,
                        'session_id' => null,
                    ]);

                    return $guestCart;
                }

                // Neu ca hai gio hang deu ton tai, gop san pham.
                $guestItems = $guestCart->chiTietGioHangs()->get();

                foreach ($guestItems as $guestItem) {
                    $userItem = $userCart->chiTietGioHangs()
                        ->where('san_pham_id', $guestItem->san_pham_id)
                        ->first();

                    if ($userItem) {
                        // San pham da co thi cong don so luong.
                        $userItem->so_luong += $guestItem->so_luong;
                        $userItem->save();

                        $guestItem->delete();
                    } else {
                        // San pham chua co thi chuyen sang gio hang tai khoan.
                        $guestItem->update([
                            'gio_hang_id' => $userCart->id,
                        ]);
                    }
                }

                // Xoa gio hang khach sau khi da gop xong.
                $guestCart->delete();

                return $userCart;
            });

            if (!$cart) {
                return response()->json([
                    'message' => 'Khong tim thay gio hang.',
                    'data' => null,
                ], 200);
            }

            $cart->load('chiTietGioHangs.sanPham');

            return response()->json([
                'message' => 'Gop gio hang thanh cong.',
                'data' => new CartResource($cart),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gop gio hang that bai.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Xem một giỏ hàng theo ID.
     */
    public function show($id)
    {
        try {
            // Tìm giỏ hàng theo ID và lấy các chi tiết bên trong.
            $cart = Cart::with('chiTietGioHangs.sanPham')
                ->findOrFail($id);

            return response()->json([
                'message' => 'Lấy thông tin giỏ hàng thành công.',
                'data' => new CartResource($cart)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy giỏ hàng.',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Cập nhật thông tin giỏ hàng.
     */
    public function update(CartRequest $request, $id): JsonResponse
    {
        try {
            // Tìm giỏ hàng theo ID.
            $cart = Cart::findOrFail($id);

            // Lấy dữ liệu đã được kiểm tra trong CartRequest.
            $data = $request->validated();

            // Cập nhật giỏ hàng.
            $cart->update($data);

            // Lấy lại dữ liệu mới nhất.
            $cart->refresh();

            return response()->json([
                'message' => 'Cập nhật giỏ hàng thành công.',
                'data' => new CartResource($cart)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa một giỏ hàng.
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Tìm giỏ hàng theo ID.
            $cart = Cart::findOrFail($id);

            // Xóa các chi tiết của giỏ hàng trước.
            $cart->chiTietGioHangs()->delete();

            // Sau đó xóa giỏ hàng.
            $cart->delete();

            return response()->json([
                'message' => 'Xóa giỏ hàng thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Xóa giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     */
    public function addItem(CartItemRequest $request): JsonResponse
    {
        try {
            // Lấy dữ liệu đã được kiểm tra.
            $data = $request->validated();

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa.
            $item = CartItem::where('gio_hang_id', $data['gio_hang_id'])
                ->where('san_pham_id', $data['san_pham_id'])
                ->first();

            if ($item) {
                // Nếu sản phẩm đã có thì cộng thêm số lượng.
                $item->so_luong += $data['so_luong'];
                $item->save();

                $message = 'Sản phẩm đã có trong giỏ hàng, số lượng đã được cập nhật.';
            } else {
                // Nếu chưa có thì tạo chi tiết giỏ hàng mới.
                $item = CartItem::create($data);

                $message = 'Thêm sản phẩm vào giỏ hàng thành công.';
            }

            // Lấy thêm thông tin sản phẩm.
            $item->load('sanPham');

            return response()->json([
                'message' => $message,
                'data' => new CartItemResource($item)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Thêm sản phẩm vào giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật số lượng một sản phẩm trong giỏ hàng.
     */
    public function updateItem(CartItemRequest $request, $id): JsonResponse
    {
        try {
            // Tìm chi tiết giỏ hàng theo ID.
            $item = CartItem::findOrFail($id);

            // Lấy dữ liệu đã kiểm tra.
            $data = $request->validated();

            // Cập nhật số lượng.
            $item->update([
                'so_luong' => $data['so_luong']
            ]);

            // Lấy thông tin sản phẩm.
            $item->load('sanPham');

            return response()->json([
                'message' => 'Cập nhật số lượng sản phẩm thành công.',
                'data' => new CartItemResource($item)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật số lượng sản phẩm thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     */
    public function removeItem($id): JsonResponse
    {
        try {
            // Tìm chi tiết giỏ hàng theo ID.
            $item = CartItem::findOrFail($id);

            // Xóa sản phẩm khỏi giỏ hàng.
            $item->delete();

            return response()->json([
                'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Xóa sản phẩm khỏi giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
