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
            'category_name' => $this->ten,
            'name' => $this->ten,

            'parent_id' => $this->parent_id,
            'parent' => new CategoryResource($this->whenLoaded('parent')),

            'duong_dan' => $this->duong_dan,
            'slug' => $this->duong_dan,

            'trang_thai' => $this->trang_thai,
            'status' => $this->trang_thai,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'children' => CategoryResource::collection(
                $this->whenLoaded('children')
            ),
        ];
    }
}
