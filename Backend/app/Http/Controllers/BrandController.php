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
     * Lấy danh sách thương hiệu có phân trang.
     * GET /api/brands
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Lấy số thương hiệu hiển thị trên mỗi trang.
        // Mặc định là 10, nhỏ nhất là 1 và lớn nhất là 100.
        $perPage = max(
            1,
            min((int) $request->input('per_page', 10), 100)
        );

        // Chỉ lấy các thương hiệu đang hoạt động.
        // Sắp xếp theo ID tăng dần và chia thành nhiều trang.
        $brands = Brand::active()
            ->orderBy('id', 'asc')
            ->paginate($perPage);

        // Chuyển danh sách thương hiệu thành dữ liệu JSON thông qua BrandResource.
        return BrandResource::collection($brands);
    }

    /**
     * Thêm thương hiệu.
     * POST /api/brands
     */
    public function store(BrandRequest $request)
    {
        try {
            // Lấy dữ liệu đã được kiểm tra trong BrandRequest.
            $brand = Brand::create($request->validated());

            // Trả về thông báo và thông tin thương hiệu vừa thêm.
            return response()->json([
                'message' => 'Thêm thương hiệu thành công.',
                'data' => new BrandResource($brand),
            ], 201);
        } catch (\Exception $e) {
            // Nếu xảy ra lỗi khi thêm thương hiệu.
            return response()->json([
                'message' => 'Thêm thương hiệu thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thông tin một thương hiệu.
     * GET /api/brands/{id}
     */
    public function show($id): BrandResource
    {
        // Tìm thương hiệu theo ID.
        // Nếu không tìm thấy thì Laravel tự trả về lỗi 404.
        $brand = Brand::findOrFail($id);

        // Trả về thông tin thương hiệu thông qua BrandResource.
        return new BrandResource($brand);
    }

    /**
     * Cập nhật thương hiệu.
     * PUT /api/brands/{id}
     */
    public function update(BrandRequest $request, $id)
    {
        try {
            // Tìm thương hiệu cần cập nhật theo ID.
            $brand = Brand::findOrFail($id);

            // Lấy dữ liệu đã được BrandRequest kiểm tra
            // và cập nhật vào database.
            $brand->update($request->validated());

            // Trả về thông báo và dữ liệu thương hiệu sau khi cập nhật.
            return response()->json([
                'message' => 'Cập nhật thương hiệu thành công.',
                'data' => new BrandResource($brand),
            ], 200);
        } catch (\Exception $e) {
            // Nếu cập nhật bị lỗi thì trả về thông báo lỗi.
            return response()->json([
                'message' => 'Cập nhật thương hiệu thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa thương hiệu.
     * DELETE /api/brands/{id}
     */
    public function destroy($id)
    {
        try {
            // Tìm thương hiệu cần xóa theo ID.
            $brand = Brand::findOrFail($id);

            // Xóa thương hiệu khỏi database.
            $brand->delete();

            // Trả về thông báo xóa thành công.
            return response()->json([
                'message' => 'Xóa thương hiệu thành công.',
            ], 200);
        } catch (\Exception $e) {
            // Nếu xóa bị lỗi thì trả về thông báo lỗi.
            return response()->json([
                'message' => 'Xóa thương hiệu thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách thương hiệu có phân trang.
     * GET /api/brands/paginate
     */
    public function paginate(Request $request): AnonymousResourceCollection
    {
        // Lấy số thương hiệu hiển thị trên mỗi trang.
        // Mặc định là 10, nhỏ nhất là 1 và lớn nhất là 100.
        $perPage = max(
            1,
            min((int) $request->input('per_page', 10), 100)
        );

        // Chỉ lấy thương hiệu đang hoạt động.
        // Sắp xếp theo ID tăng dần và phân trang.
        $brands = Brand::active()
            ->orderBy('id', 'asc')
            ->paginate($perPage);

        // Trả về danh sách thương hiệu thông qua BrandResource.
        return BrandResource::collection($brands);
    }
}