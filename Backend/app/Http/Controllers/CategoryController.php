<?php
namespace App\Http\Controllers;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
        ->get();

        return CategoryResource::collection($categories);
    }
    public function show(Category $slug): CategoryResource
    {
        return new CategoryResource($slug->load(['children' => fn($query) => $query->active()]));
    }
    public function children(Category $category): AnonymousResourceCollection
    {
        $children = $category->children()->active()->get();
        return CategoryResource::collection($children);
    }
    public function parent(Category $category): CategoryResource
    {
        $parent = $category->parent; //Đây là cách Laravel lấy dữ liệu từ relationship.
        return new CategoryResource($parent);
    }
}