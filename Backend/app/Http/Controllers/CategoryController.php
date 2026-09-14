<?php
namespace App\Http\Controllers;

#[Fillable(
    'ten',
    'parent_id',
    'duong_dan',
    'trang_thai'
)]
class CategoryController extends Controller
{
    //Get /api/categories
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::active()
        ->whereNull('parent_id')
        ->with(['children' => fn($query) => $query->active()])
        ->orderBy('sort_order')
        ->get();

        return CategoryResource::collection($categories);
    }
}