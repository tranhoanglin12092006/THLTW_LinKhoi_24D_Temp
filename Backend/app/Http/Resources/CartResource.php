<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Chuyển dữ liệu giỏ hàng thành JSON.
     */
    public function toArray(Request $request): array
    {
        return [
            // ID của giỏ hàng.
            'id' => $this->id,

            // ID người dùng nếu giỏ hàng thuộc tài khoản.
            'nguoi_dung_id' => $this->nguoi_dung_id,

            // Session ID nếu sử dụng giỏ hàng cho khách.
            'session_id' => $this->session_id,

            // Danh sách các sản phẩm trong giỏ hàng.
            'chi_tiet_gio_hang' => CartItemResource::collection(
                $this->whenLoaded('chiTietGioHangs')
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}