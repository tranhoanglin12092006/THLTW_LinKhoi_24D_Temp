<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    // GET /api/categories
    // Lấy danh sách danh mục (phân trang 10 danh mục/trang)
    public function index(Request $request): AnonymousResourceCollection
    {
        // Số danh mục mỗi trang (mặc định 10)
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));

        // Khởi tạo query kèm thông tin danh mục cha
        $query = Category::with('parent')->orderBy('id', 'desc');

        // Nếu chỉ muốn lấy danh mục đang hoạt động (cho shop)
        if ($request->boolean('active_only')) {
            $query->active();
        }

        // Nếu muốn tìm kiếm theo tên
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('ten', 'like', "%{$search}%");
        }

        $categories = $query->paginate($perPage);

        return CategoryResource::collection($categories);
    }

    // POST /api/categories
    // Thêm một danh mục mới
    public function store(CategoryRequest $request)
    {
        try {
            // Lấy dữ liệu đã được kiểm tra trong CategoryRequest.
            $category = Category::create($request->validated());

            // Trả về thông báo thêm thành công và dữ liệu danh mục vừa tạo.
            return response()->json([
                'message' => 'Thêm danh mục thành công.',
                'data' => new CategoryResource($category),
            ], 201);
        } catch (\Exception $e) {
            // Nếu xảy ra lỗi khi thêm thì trả về thông báo lỗi.
            return response()->json([
                'message' => 'Thêm danh mục thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // PUT /api/categories/{id}
    // Cập nhật thông tin một danh mục
    public function update(CategoryRequest $request, $id)
    {
        try {
            // Tìm danh mục theo ID.
            // Nếu không tìm thấy thì Laravel sẽ báo lỗi.
            $category = Category::findOrFail($id);

            // Lấy dữ liệu đã được kiểm tra và cập nhật vào database.
            $category->update($request->validated());

            // Trả về thông báo cập nhật thành công và dữ liệu mới.
            return response()->json([
                'message' => 'Cập nhật danh mục thành công.',
                'data' => new CategoryResource($category),
            ], 200);
        } catch (\Exception $e) {
            // Nếu cập nhật bị lỗi thì trả về thông báo lỗi.
            return response()->json([
                'message' => 'Cập nhật danh mục thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/categories/{id}
    // Xóa một danh mục
    public function destroy($id)
    {
        try {
            // Tìm danh mục cần xóa theo ID.
            $category = Category::findOrFail($id);

            // Xóa danh mục khỏi database.
            $category->delete();

            // Thông báo xóa thành công.
            return response()->json([
                'message' => 'Xóa danh mục thành công.',
            ], 200);
        } catch (\Exception $e) {
            // Nếu xóa bị lỗi thì trả về thông báo lỗi.
            return response()->json([
                'message' => 'Xóa danh mục thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/categories/{id}
    // Xem thông tin chi tiết của một danh mục
    public function show($id): CategoryResource
    {
        // Tìm danh mục theo ID.
        // Nếu ID không tồn tại thì Laravel tự trả về lỗi 404.
        $category = Category::findOrFail($id);

        // Lấy thêm các danh mục con đang hoạt động.
        $category->load([
            'children' => fn($query) => $query->active()
        ]);

        // Trả về thông tin danh mục thông qua CategoryResource.
        return new CategoryResource($category);
    }

    // GET /api/categories/{id}/children
    // Lấy danh sách các danh mục con của một danh mục
    public function children(Request $request, $id): AnonymousResourceCollection
    {
        // Tìm danh mục cha theo ID.
        $category = Category::findOrFail($id);

        // Lấy số danh mục con trên mỗi trang.
        // Mặc định là 10 nếu không truyền per_page.
        $perPage = $request->input('per_page', 10);

        // Lấy các danh mục con đang hoạt động
        // và chia thành nhiều trang.
        $children = $category->children()
            ->active()
            ->paginate($perPage);

        // Trả về danh sách danh mục con thông qua CategoryResource.
        return CategoryResource::collection($children);
    }

    // GET /api/categories/{id}/parent
    // Lấy danh mục cha của một danh mục
    public function parent($id): CategoryResource
    {
        // Tìm danh mục theo ID.
        $category = Category::findOrFail($id);

        // Laravel tự lấy danh mục cha thông qua relationship "parent".
        $parent = $category->parent;

        // Trả về thông tin danh mục cha.
        return new CategoryResource($parent);
    }
}