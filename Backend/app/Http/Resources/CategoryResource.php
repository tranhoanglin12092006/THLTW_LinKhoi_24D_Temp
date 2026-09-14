<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ten' => $this->ten,
            'parent_id' => $this->parent_id,
            'duong_dan' => $this->duong_dan,
            'trang_thai' => $this->trang_thai,

            'children' => CategoryResource::collection(
                $this->whenLoaded('children')
            ),
        ];
    }
}
