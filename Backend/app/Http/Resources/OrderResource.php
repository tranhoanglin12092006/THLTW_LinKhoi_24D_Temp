<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\OrderDetailResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // ID đơn hàng
            'id' => $this->id,

            // ID người dùng
            'nguoi_dung_id' => $this->nguoi_dung_id,

            // Mã đơn hàng
            'ma_don_hang' => $this->ma_don_hang,

            // Tên người nhận
            'ten_nguoi_nhan' => $this->ten_nguoi_nhan,

            // Số điện thoại
            'so_dien_thoai' => $this->so_dien_thoai,

            // Địa chỉ
            'dia_chi' => $this->dia_chi,

            // Phương thức thanh toán
            'phuong_thuc_thanh_toan' => $this->phuong_thuc_thanh_toan,

            // Mã khuyến mãi
            'khuyen_mai_id' => $this->khuyen_mai_id,

            // Tổng tiền
            'tong_tien' => $this->tong_tien,

            // Trạng thái
            'trang_thai' => $this->trang_thai,

            // Danh sách sản phẩm trong đơn hàng
            'chi_tiet_don_hang' => OrderDetailResource::collection(
                $this->whenLoaded('chiTietDonHangs')
            ),

            // Thời gian tạo
            'created_at' => $this->created_at,

            // Thời gian cập nhật
            'updated_at' => $this->updated_at,
        ];
    }
}