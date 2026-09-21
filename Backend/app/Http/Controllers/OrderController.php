<?php

namespace App\Http\Controllers;

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
            ->orderBy('id')
            ->get();

        return OrderResource::collection($orders);
    }

    // Tạo đơn hàng mới
    public function store(OrderRequest $request): JsonResponse|OrderResource
    {
        try {
            // Lấy dữ liệu đã kiểm tra
            $data = $request->validated();

            // Tạo đơn hàng
            $order = Order::create($data);

            // Lấy thêm chi tiết đơn hàng
            $order->load('chiTietDonHangs');

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
            // Tìm đơn hàng
            $order = Order::findOrFail($id);

            // Lấy dữ liệu đã kiểm tra
            $data = $request->validated();

            // Cập nhật đơn hàng
            $order->update($data);

            // Lấy thêm chi tiết đơn hàng
            $order->load('chiTietDonHangs');

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
