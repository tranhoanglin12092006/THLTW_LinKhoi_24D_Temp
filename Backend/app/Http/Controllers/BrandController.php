<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BrandController extends Controller
{
    /**
     * Lấy danh sách thương hiệu có phân trang
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = max(
            1,
            min((int) $request->input('per_page', 10), 100)
        );

        $brands = Brand::active()
            ->orderBy('id', 'asc')
            ->paginate($perPage);

        return BrandResource::collection($brands);
    }

    /**
     * Thêm thương hiệu
     */
    public function store(BrandRequest $request)
    {
        $brand = Brand::create($request->validated());

        return response()->json([
            'message' => 'Thêm thương hiệu thành công.',
            'data' => new BrandResource($brand),
        ], 201);
    }

    /**
     * Lấy thông tin một thương hiệu
     */
    public function show($id): BrandResource
    {
        $brand = Brand::findOrFail($id);

        return new BrandResource($brand);
    }

    /**
     * Cập nhật thương hiệu
     */
    public function update(BrandRequest $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $brand->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật thương hiệu thành công.',
            'data' => new BrandResource($brand),
        ], 200);
    }

    /**
     * Xóa thương hiệu
     */
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        $brand->delete();

        return response()->json([
            'message' => 'Xóa thương hiệu thành công.',
        ], 200);
    }

    public function paginate(Request $request): AnonymousResourceCollection
    {
        $perPage = max(
            1,
            min((int) $request->input('per_page', 10), 100)
        );

        $brands = Brand::active()
            ->orderBy('id', 'asc')
            ->paginate($perPage);

        return BrandResource::collection($brands);
    }
}
