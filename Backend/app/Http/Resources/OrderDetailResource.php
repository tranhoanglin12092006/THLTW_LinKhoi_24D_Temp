<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // ID chi tiết đơn hàng
            'id' => $this->id,

            // ID đơn hàng
            'don_hang_id' => $this->don_hang_id,

            // ID sản phẩm
            'san_pham_id' => $this->san_pham_id,

            // Số lượng
            'so_luong' => $this->so_luong,

            // Giá sản phẩm
            'gia' => $this->gia,

            // Thông tin sản phẩm
            'san_pham' => new ProductResource(
                $this->whenLoaded('sanPham')
            ),

            // Thời gian tạo
            'created_at' => $this->created_at,

            // Thời gian cập nhật
            'updated_at' => $this->updated_at,
        ];
    }
}