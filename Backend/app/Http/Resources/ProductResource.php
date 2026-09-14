<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
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
            'hinh_anh' => $this->hinh_anh,
            'trang_thai' => $this->trang_thai,
            'hinh_anh_url' => $this->hinh_anh_url, // Thêm URL hình ảnh
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}