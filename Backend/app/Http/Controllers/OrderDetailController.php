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

    // Cập nhật số lượng
    public function update(OrderDetailRequest $request, $id): JsonResponse|OrderDetailResource
    {
        try {
            // Tìm chi tiết đơn hàng
            $orderDetail = OrderDetail::findOrFail($id);

            // Lấy dữ liệu đã kiểm tra
            $data = $request->validated();

            // Lấy thông tin sản phẩm
            $orderDetail->load('sanPham');

            // Kiểm tra sản phẩm có tồn tại không
            if (!$orderDetail->sanPham) {
                return response()->json([
                    'message' => 'Sản phẩm của chi tiết đơn hàng không tồn tại.'
                ], 404);
            }

            // Lấy đơn giá hiện tại của sản phẩm
            $donGia = $orderDetail->sanPham->gia_khuyen_mai
                ?? $orderDetail->sanPham->gia;

            // Tính lại thành tiền = đơn giá × số lượng mới
            $thanhTien = $donGia * $data['so_luong'];

            // Cập nhật số lượng và thành tiền
            $orderDetail->update([
                'so_luong' => $data['so_luong'],
                'gia' => $thanhTien
            ]);

            // Lấy lại thông tin sản phẩm
            $orderDetail->load('sanPham');

            return response()->json([
                'message' => 'Cập nhật số lượng và giá chi tiết đơn hàng thành công.',
                'data' => new OrderDetailResource($orderDetail)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật chi tiết đơn hàng thất bại.',
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
