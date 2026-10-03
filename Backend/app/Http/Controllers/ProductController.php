<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\ProductRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * Hiển thị danh sách sản phẩm.
     * GET /api/products
     */
    public function index(): AnonymousResourceCollection
    {
        // Số sản phẩm hiển thị trên mỗi trang.
        $perPage = request()->get('per_page', 10);

        $products = Product::where('trang_thai', 1)
            ->with(['danhMuc', 'thuongHieu'])
            ->orderBy('id')
            ->paginate($perPage);

        return ProductResource::collection($products);
    }

    /**
     * Hiển thị chi tiết một sản phẩm.
     * GET /api/products/{id}
     */
    public function show($id)
    {
        try {
            $product = Product::with(['danhMuc', 'thuongHieu'])
                ->findOrFail($id);

            return new ProductResource($product);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Thêm sản phẩm.
     * POST /api/products
     */
    public function store(ProductRequest $request)
    {
        try {
            $data = $request->validated();

            // Lưu hình ảnh
            if ($request->hasFile('hinh_anh')) {
                $data['hinh_anh'] = $request
                    ->file('hinh_anh')
                    ->store('products', 'public');
            }

            $product = Product::create($data);

            return response()->json([
                'message' => 'Thêm sản phẩm thành công!',
                'data' => new ProductResource($product)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Thêm sản phẩm thất bại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sửa sản phẩm.
     * PUT /api/products/{id}
     */
    public function update(ProductRequest $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $data = $request->validated();

            if ($request->hasFile('hinh_anh')) {
                // Có ảnh mới: xóa ảnh cũ trong thư mục (nếu có)
                if ($product->hinh_anh) {
                    Storage::disk('public')->delete($product->hinh_anh);
                }

                // Lưu ảnh mới vào storage/app/public/products
                $data['hinh_anh'] = $request
                    ->file('hinh_anh')
                    ->store('products', 'public');
            } else {
                // Không chọn ảnh mới: bỏ field ảnh ra để giữ nguyên ảnh cũ
                unset($data['hinh_anh']);
            }

            $product->update($data);

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công!',
                'data' => new ProductResource($product)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cập nhật sản phẩm thất bại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Xóa sản phẩm.
     * DELETE /api/products/{id}
     */
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);

            // Xóa file ảnh trước, rồi mới xóa sản phẩm
            if ($product->hinh_anh) {
                Storage::disk('public')->delete($product->hinh_anh);
            }

            $product->delete();

            return response()->json([
                'message' => 'Xóa sản phẩm thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Xóa sản phẩm thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách sản phẩm mới nhất
     * GET /api/newProducts/{limit}
     */
    public function getNewProducts($limit = 8)
    {
        $limit = (int) $limit;

        $products = Product::where('trang_thai', 1)
            ->with(['danhMuc', 'thuongHieu'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->take($limit)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Lấy danh sách sản phẩm nổi bật / bán chạy (HOT)
     * GET /api/hotProducts/{limit}
     */
    public function getHotProducts($limit = 8)
    {
        $limit = (int) $limit;

        // Ưu tiên sản phẩm có tồn kho nhiều hoặc sắp xếp mới nhất
        $products = Product::where('trang_thai', 1)
            ->with(['danhMuc', 'thuongHieu'])
            ->orderBy('so_luong_ton', 'desc')
            ->orderBy('id', 'desc')
            ->take($limit)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Lấy danh sách sản phẩm đang giảm giá (SALE)
     * GET /api/saleProducts/{limit}
     */
    public function getSaleProducts($limit = 8)
    {
        $limit = (int) $limit;

        $products = Product::where('trang_thai', 1)
            ->whereNotNull('gia_khuyen_mai')
            ->where('gia_khuyen_mai', '>', 0)
            ->whereColumn('gia_khuyen_mai', '<', 'gia')
            ->with(['danhMuc', 'thuongHieu'])
            ->orderBy('id', 'desc')
            ->take($limit)
            ->get();

        return ProductResource::collection($products);
    }
}
