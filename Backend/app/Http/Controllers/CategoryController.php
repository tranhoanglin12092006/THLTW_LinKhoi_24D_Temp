<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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

    public function store(CategoryRequest $request): CategoryResource
    {
        $category = Category::create($request->validated());

        return new CategoryResource($category);
    }

    public function update(CategoryRequest $request, $id): CategoryResource
    {
        $category = Category::findOrFail($id);
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Xóa danh mục thành công',
        ]);
    }

    public function show($id): CategoryResource
    {
        $category = Category::findOrFail($id);

        return new CategoryResource($category->load(['children' => fn($query) => $query->active()]));
    }
    public function children($id): AnonymousResourceCollection
    {
        $category = Category::findOrFail($id);
        $children = $category->children()->active()->get();
        return CategoryResource::collection($children);
    }
    public function parent($id): CategoryResource
    {
        $category = Category::findOrFail($id);
        $parent = $category->parent; //Đây là cách Laravel lấy dữ liệu từ relationship.
        return new CategoryResource($parent);
    }
}