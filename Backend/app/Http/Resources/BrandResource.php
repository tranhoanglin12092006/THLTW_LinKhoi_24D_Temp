<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ten' => $this->ten,
            'duong_dan' => $this->duong_dan,
            'trang_thai' => $this->trang_thai,
        ];
    }
}
