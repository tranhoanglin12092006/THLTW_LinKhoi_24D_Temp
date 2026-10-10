<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Chuyển dữ liệu bài viết thành JSON.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'danh_muc_bai_viet_id' => $this->danh_muc_bai_viet_id,
            'category_name' => $this->danhMucBaiViet?->ten ?? 'Chưa phân loại',
            'danh_muc' => $this->whenLoaded('danhMucBaiViet', function () {
                return [
                    'id' => $this->danhMucBaiViet->id,
                    'ten' => $this->danhMucBaiViet->ten,
                    'duong_dan' => $this->danhMucBaiViet->duong_dan,
                ];
            }),
            'tieu_de' => $this->tieu_de,
            'duong_dan' => $this->duong_dan,
            'noi_dung' => $this->noi_dung,
            'anh_dai_dien' => $this->anh_dai_dien,
            'anh_dai_dien_url' => $this->anh_dai_dien_url,
            'trang_thai' => (bool) $this->trang_thai,
            'ngay_dang' => $this->ngay_dang ? $this->ngay_dang->format('Y-m-d H:i:s') : null,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            'deleted_at' => $this->deleted_at ? $this->deleted_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
