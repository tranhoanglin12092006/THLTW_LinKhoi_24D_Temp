<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

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
    public function store(OrderRequest $request): JsonResponse|OrderResource
    {
        try {
            // Lấy dữ liệu từ form
            $data = $request->validated();

            // Tạo đơn hàng trước
            $order = Order::create([
                ...$data,
                'ma_don_hang' => 'TEMP',
            ]);

            // Dùng ID của đơn hàng để tạo mã
            $order->update([
                'ma_don_hang' => 'DH' . str_pad(
                    $order->id,
                    6,
                    '0',
                    STR_PAD_LEFT
                ),
            ]);

            // Load dữ liệu chi tiết
            $order->load('chiTietDonHangs.sanPham');

            return response()->json([
                'message' => 'Thêm đơn hàng thành công.',
                'data' => new OrderResource($order)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Tạo đơn hàng thất bại.',
                'error' => $e->getMessage()
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
        if (in_array((int) $order->trang_thai, [3, 4], true)) {
            return response()->json([
                'message' => 'Don hang da giao hoac da huy, khong the cap nhat.'
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
