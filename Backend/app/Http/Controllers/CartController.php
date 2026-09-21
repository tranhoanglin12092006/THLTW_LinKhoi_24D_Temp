<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItemRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Lấy danh sách tất cả giỏ hàng.
     */
    public function index()
    {
        // Lấy giỏ hàng và lấy luôn các chi tiết bên trong.
        $carts = Cart::with('chiTietGioHangs.sanPham')
            ->orderBy('id')
            ->get();

        return CartResource::collection($carts);
    }

    /**
     * Tạo một giỏ hàng mới.
     */
    public function store(Request $request): JsonResponse|CartResource
    {
        try {
            // Kiểm tra dữ liệu gửi lên.
            $data = $request->validate([
                'nguoi_dung_id' => 'nullable|exists:users,id',
                'session_id' => 'nullable|string|max:255',
            ]);

            // Tạo giỏ hàng mới.
            $cart = Cart::create($data);

            // Trả về giỏ hàng vừa tạo.
            return new CartResource($cart);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Thêm giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem một giỏ hàng theo ID.
     */
    public function show($id)
    {
        // Tìm giỏ hàng theo ID và lấy các chi tiết bên trong.
        $cart = Cart::with('chiTietGioHangs.sanPham')
            ->findOrFail($id);

        return new CartResource($cart);
    }

    /**
     * Cập nhật thông tin giỏ hàng.
     */
    public function update(Request $request, $id): JsonResponse|CartResource
    {
        try {
            // Tìm giỏ hàng theo ID.
            $cart = Cart::findOrFail($id);

            // Kiểm tra dữ liệu được gửi lên.
            $data = $request->validate([
                'nguoi_dung_id' => 'nullable|exists:users,id',
                'session_id' => 'nullable|string|max:255',
            ]);

            // Cập nhật giỏ hàng.
            $cart->update($data);

            return new CartResource($cart);
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
    public function addItem(CartItemRequest $request): JsonResponse|CartItem
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
            } else {
                // Nếu chưa có thì tạo chi tiết giỏ hàng mới.
                $item = CartItem::create($data);
            }

            // Lấy thêm thông tin sản phẩm.
            $item->load('sanPham');

            return response()->json([
                'message' => 'Thêm sản phẩm vào giỏ hàng thành công.',
                'data' => new CartItemResource($item)
            ], 201);
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
    public function updateItem(CartItemRequest $request, $id): JsonResponse|CartItem
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
                'message' => 'Cập nhật số lượng thành công.',
                'data' => new CartItemResource($item)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật số lượng thất bại.',
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
