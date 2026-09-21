<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;

class CartItemController extends Controller
{
    /**
     * Lấy danh sách tất cả chi tiết giỏ hàng.
     */
    public function index()
    {
        // Lấy các chi tiết giỏ hàng và lấy luôn thông tin sản phẩm.
        $cartItems = CartItem::with('sanPham')
            ->orderBy('id')
            ->get();

        return CartItemResource::collection($cartItems);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng.
     */
    public function store(CartItemRequest $request): JsonResponse|CartItemResource
    {
        try {
            // Lấy dữ liệu đã được kiểm tra trong CartItemRequest.
            $data = $request->validated();

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa.
            $cartItem = CartItem::where('gio_hang_id', $data['gio_hang_id'])
                ->where('san_pham_id', $data['san_pham_id'])
                ->first();

            if ($cartItem) {
                // Nếu sản phẩm đã có thì cộng thêm số lượng.
                $cartItem->so_luong += $data['so_luong'];
                $cartItem->save();
            } else {
                // Nếu sản phẩm chưa có thì tạo chi tiết giỏ hàng mới.
                $cartItem = CartItem::create($data);
            }

            // Lấy thêm thông tin sản phẩm.
            $cartItem->load('sanPham');

            return new CartItemResource($cartItem);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Thêm sản phẩm vào giỏ hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem một chi tiết giỏ hàng theo ID.
     */
    public function show($id)
    {
        // Tìm chi tiết giỏ hàng theo ID.
        $cartItem = CartItem::with('sanPham')
            ->findOrFail($id);

        return new CartItemResource($cartItem);
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     */
    public function update(CartItemRequest $request, $id): JsonResponse|CartItemResource
    {
        try {
            // Tìm chi tiết giỏ hàng theo ID.
            $cartItem = CartItem::findOrFail($id);

            // Lấy dữ liệu đã được kiểm tra.
            $data = $request->validated();

            // Cập nhật số lượng sản phẩm.
            $cartItem->update([
                'so_luong' => $data['so_luong']
            ]);

            // Lấy thêm thông tin sản phẩm.
            $cartItem->load('sanPham');

            return new CartItemResource($cartItem);
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
    public function destroy($id): JsonResponse
    {
        try {
            // Tìm chi tiết giỏ hàng theo ID.
            $cartItem = CartItem::findOrFail($id);

            // Xóa chi tiết giỏ hàng.
            $cartItem->delete();

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
