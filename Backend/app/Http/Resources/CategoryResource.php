<?php
namespace App\Http\Resources;

#[Fillable(
    'ten',
    'parent_id',
    'duong_dan',
    'trang_thai'
)]
class CategoryResource extends JsonResource
{
    //Get /api/categories
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ten' => $this->ten,
            'parent_id' => $this->parent_id,
            'duong_dan' => $this->duong_dan,
            'trang_thai' => $this->trang_thai,
            // chi co khi controller load quan he children
            'children' => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}