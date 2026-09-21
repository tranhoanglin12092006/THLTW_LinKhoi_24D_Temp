<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderDetailRequest;
use App\Http\Resources\OrderDetailResource;
use App\Models\OrderDetail;
use Illuminate\Http\JsonResponse;

class OrderDetailController extends Controller
{
    // Lấy danh sách tất cả chi tiết đơn hàng
    public function index()
    {
        // Lấy thêm thông tin sản phẩm
        $orderDetails = OrderDetail::with('sanPham')
            ->orderBy('id')
            ->get();

        return OrderDetailResource::collection($orderDetails);
    }

    // Thêm sản phẩm vào đơn hàng
    public function store(OrderDetailRequest $request): JsonResponse|OrderDetailResource
    {
        try {
            // Lấy dữ liệu đã kiểm tra
            $data = $request->validated();

            // Kiểm tra sản phẩm đã có trong đơn hàng chưa
            $orderDetail = OrderDetail::where('don_hang_id', $data['don_hang_id'])
                ->where('san_pham_id', $data['san_pham_id'])
                ->first();

            if ($orderDetail) {
                // Nếu đã có thì cộng thêm số lượng
                $orderDetail->so_luong += $data['so_luong'];
                $orderDetail->save();
            } else {
                // Nếu chưa có thì tạo mới
                $orderDetail = OrderDetail::create($data);
            }

            // Lấy thêm thông tin sản phẩm
            $orderDetail->load('sanPham');

            return new OrderDetailResource($orderDetail);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Thêm chi tiết đơn hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xem một chi tiết đơn hàng
    public function show($id)
    {
        // Tìm chi tiết đơn hàng theo ID
        $orderDetail = OrderDetail::with('sanPham')
            ->findOrFail($id);

        return new OrderDetailResource($orderDetail);
    }

    // Cập nhật số lượng
    public function update(OrderDetailRequest $request, $id): JsonResponse|OrderDetailResource
    {
        try {
            // Tìm chi tiết đơn hàng
            $orderDetail = OrderDetail::findOrFail($id);

            // Lấy dữ liệu đã kiểm tra
            $data = $request->validated();

            // Chỉ cập nhật số lượng
            $orderDetail->update([
                'so_luong' => $data['so_luong']
            ]);

            // Lấy thêm thông tin sản phẩm
            $orderDetail->load('sanPham');

            return new OrderDetailResource($orderDetail);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật số lượng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa chi tiết đơn hàng
    public function destroy($id): JsonResponse
    {
        try {
            // Tìm chi tiết đơn hàng
            $orderDetail = OrderDetail::findOrFail($id);

            // Xóa chi tiết đơn hàng
            $orderDetail->delete();

            return response()->json([
                'message' => 'Xóa chi tiết đơn hàng thành công.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Xóa chi tiết đơn hàng thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}