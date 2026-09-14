<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'danh_muc_id' => $this->danh_muc_id,
            'thuong_hieu_id' => $this->thuong_hieu_id,
            'ten' => $this->ten,
            'duong_dan' => $this->duong_dan,
            'gia' => $this->gia,
            'gia_khuyen_mai' => $this->gia_khuyen_mai,
            'so_luong_ton' => $this->so_luong_ton,
            'mo_ta' => $this->mo_ta,

            // Lấy URL đầy đủ của hình ảnh
            'hinh_anh' => $this->hinh_anh_url,

            'trang_thai' => $this->trang_thai,

            // Chỉ trả về khi quan hệ đã được load
            'danh_muc' => new CategoryResource(
                $this->whenLoaded('danhMuc')
            ),

            'thuong_hieu' => new BrandResource(
                $this->whenLoaded('thuongHieu')
            ),
        ];
    }
}
