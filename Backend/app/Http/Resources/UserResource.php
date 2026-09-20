<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Chuyển dữ liệu người dùng thành JSON.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'ho_ten' => $this->ho_ten,
            'email' => $this->email,
            'so_dien_thoai' => $this->so_dien_thoai,
            'dia_chi' => $this->dia_chi,

            'vai_tro' => $this->vai_tro,
            'trang_thai' => $this->trang_thai,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}