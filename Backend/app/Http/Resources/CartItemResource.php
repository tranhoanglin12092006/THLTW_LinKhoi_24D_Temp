<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /**
     * Chuyển dữ liệu chi tiết giỏ hàng thành JSON.
     */
    public function toArray(Request $request): array
    {
        return [
            // ID của chi tiết giỏ hàng.
            'id' => $this->id,

            // ID của giỏ hàng.
            'gio_hang_id' => $this->gio_hang_id,

            // ID của sản phẩm.
            'san_pham_id' => $this->san_pham_id,

            // Số lượng sản phẩm trong giỏ.
            'so_luong' => $this->so_luong,

            // Thông tin sản phẩm nếu đã load quan hệ sanPham.
            'san_pham' => new ProductResource($this->whenLoaded('sanPham')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}