<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Hiển thị danh sách sản phẩm.
     * GET /api/products
     */
    public function index(): AnonymousResourceCollection
    {
        $products = Product::where('trang_thai', 1)
            ->with(['danhMuc', 'thuongHieu'])
            ->orderBy('id')
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Hiển thị chi tiết một sản phẩm.
     * GET /api/products/{id}
     */
    public function show($id)
    {
        $product = Product::with(['danhMuc', 'thuongHieu'])
            ->findOrFail($id);

        return new ProductResource($product);
    }

    /**
     * Thêm sản phẩm.
     * POST /api/products
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'danh_muc_id' => 'required|exists:danh_muc,id',
            'thuong_hieu_id' => 'required|exists:thuong_hieu,id',
            'ten' => 'required|string|max:255',
            'duong_dan' => 'required|string|max:255|unique:san_pham,duong_dan',
            'gia' => 'required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'required|integer|min:0',
            'mo_ta' => 'nullable|string',
            'hinh_anh' => 'nullable|string',
            'trang_thai' => 'required|boolean',
        ]);

        $product = Product::create($data);

        return new ProductResource($product);
    }

    /**
     * Sửa sản phẩm.
     * PUT /api/products/{id}
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'danh_muc_id' => 'required|exists:danh_muc,id',
            'thuong_hieu_id' => 'required|exists:thuong_hieu,id',
            'ten' => 'required|string|max:255',
            'duong_dan' => 'required|string|max:255|unique:san_pham,duong_dan,' . $id,
            'gia' => 'required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'required|integer|min:0',
            'mo_ta' => 'nullable|string',
            'hinh_anh' => 'nullable|string',
            'trang_thai' => 'required|boolean',
        ]);

        $product->update($data);

        return new ProductResource($product);
    }

    /**
     * Xóa sản phẩm.
     * DELETE /api/products/{id}
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}