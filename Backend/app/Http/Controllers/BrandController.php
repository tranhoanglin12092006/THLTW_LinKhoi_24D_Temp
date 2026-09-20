<?php

namespace App\Http\Controllers;

use App\Http\Requests\BrandRequest;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BrandController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return BrandResource::collection(Brand::active()->get());
    }

    public function store(BrandRequest $request): BrandResource
    {
        $brand = Brand::create($request->validated());

        return new BrandResource($brand);
    }

    public function show($id): BrandResource
    {
        $brand = Brand::findOrFail($id);

        return new BrandResource($brand);
    }

    public function update(BrandRequest $request, $id): BrandResource
    {
        $brand = Brand::findOrFail($id);
        $brand->update($request->validated());

        return new BrandResource($brand);
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json([
            'message' => 'Xóa thương hiệu thành công',
        ]);
    }
}