<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    //Get /api/categories
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));

        $categories = Category::active()
            ->whereNull('parent_id')
            ->with(['children' => fn($query) => $query->active()])
            ->orderBy('id')
            ->paginate($perPage);

        return CategoryResource::collection($categories);
    }

    public function store(CategoryRequest $request)
    {
        $category = Category::create($request->validated());

        return response()->json([
            'message' => 'Thêm danh mục thành công.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    public function update(CategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);

        $category->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật danh mục thành công.',
            'data' => new CategoryResource($category),
        ], 200);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Xóa danh mục thành công.',
        ], 200);
    }

    public function show($id): CategoryResource
    {
        $category = Category::findOrFail($id);

        return new CategoryResource(
            $category->load([
                'children' => fn($query) => $query->active()
            ])
        );
    }

    public function children(Request $request, $id): AnonymousResourceCollection
    {
        $category = Category::findOrFail($id);

        $perPage = $request->input('per_page', 10);

        $children = $category->children()
            ->active()
            ->paginate($perPage);

        return CategoryResource::collection($children);
    }

    public function parent($id): CategoryResource
    {
        $category = Category::findOrFail($id);

        $parent = $category->parent; //Đây là cách Laravel lấy dữ liệu từ relationship.

        return new CategoryResource($parent);
    }
}
