<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Lấy danh sách trang đơn (hỗ trợ tìm kiếm, lọc trạng thái, phân trang, xem thùng rác)
     * GET /api/pages
     */
    public function index(Request $request)
    {
        try {
            $perPage = max(1, min((int) $request->input('per_page', 10), 100));

            // Kiểm tra xem có đang xem thùng rác không
            if ($request->boolean('trashed') || $request->input('status') === 'trash') {
                $query = Page::onlyTrashed()->orderBy('deleted_at', 'desc');
            } else {
                $query = Page::orderBy('id', 'desc');

                // Lọc theo trạng thái
                if ($request->has('status') && $request->input('status') !== '' && $request->input('status') !== 'all') {
                    $query->where('trang_thai', (int) $request->input('status'));
                }
            }

            // Tìm kiếm theo tiêu đề hoặc đường dẫn
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('tieu_de', 'like', "%{$search}%")
                      ->orWhere('duong_dan', 'like', "%{$search}%")
                      ->orWhere('noi_dung', 'like', "%{$search}%");
                });
            }

            $pages = $query->paginate($perPage);
            $trashCount = Page::onlyTrashed()->count();

            return response()->json([
                'success' => true,
                'data' => $pages->items(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page' => $pages->lastPage(),
                    'per_page' => $pages->perPage(),
                    'total' => $pages->total(),
                    'trash_count' => $trashCount,
                ],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tải danh sách trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Lấy danh sách trang đơn trong thùng rác
     * GET /api/pages/trash
     */
    public function trash(Request $request)
    {
        try {
            $perPage = max(1, min((int) $request->input('per_page', 10), 100));
            $query = Page::onlyTrashed()->orderBy('deleted_at', 'desc');

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('tieu_de', 'like', "%{$search}%")
                      ->orWhere('duong_dan', 'like', "%{$search}%");
                });
            }

            $pages = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $pages->items(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page' => $pages->lastPage(),
                    'per_page' => $pages->perPage(),
                    'total' => $pages->total(),
                ],
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tải thùng rác: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xem chi tiết một trang đơn theo ID hoặc đường dẫn (slug)
     * GET /api/pages/{id}
     */
    public function show($id)
    {
        try {
            // Tìm theo ID hoặc theo slug/duong_dan
            $page = is_numeric($id)
                ? Page::withTrashed()->find($id)
                : Page::where('duong_dan', $id)->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy trang đơn yêu cầu!',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $page,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xem trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tạo mới một trang đơn
     * POST /api/pages
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tieu_de' => 'required|string|max:255',
                'duong_dan' => 'nullable|string|max:255|unique:trang_don,duong_dan',
                'noi_dung' => 'nullable|string',
                'trang_thai' => 'nullable|boolean',
            ], [
                'tieu_de.required' => 'Vui lòng nhập tiêu đề trang đơn!',
                'duong_dan.unique' => 'Đường dẫn (slug) này đã được sử dụng!',
            ]);

            // Tự tạo đường dẫn slug nếu để trống
            if (empty($validated['duong_dan'])) {
                $baseSlug = Str::slug($validated['tieu_de']);
                $slug = $baseSlug;
                $counter = 1;
                while (Page::where('duong_dan', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                $validated['duong_dan'] = $slug;
            } else {
                $validated['duong_dan'] = Str::slug($validated['duong_dan']);
            }

            $validated['trang_thai'] = $request->has('trang_thai') ? (bool) $request->input('trang_thai') : true;

            $page = Page::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tạo trang đơn mới thành công!',
                'data' => $page,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin trang đơn
     * PUT /api/pages/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $page = Page::findOrFail($id);

            $validated = $request->validate([
                'tieu_de' => 'required|string|max:255',
                'duong_dan' => 'nullable|string|max:255|unique:trang_don,duong_dan,' . $id,
                'noi_dung' => 'nullable|string',
                'trang_thai' => 'nullable|boolean',
            ], [
                'tieu_de.required' => 'Vui lòng nhập tiêu đề trang đơn!',
                'duong_dan.unique' => 'Đường dẫn (slug) này đã tồn tại!',
            ]);

            if (empty($validated['duong_dan'])) {
                $validated['duong_dan'] = Str::slug($validated['tieu_de']);
            } else {
                $validated['duong_dan'] = Str::slug($validated['duong_dan']);
            }

            if ($request->has('trang_thai')) {
                $validated['trang_thai'] = (bool) $request->input('trang_thai');
            }

            $page->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật trang đơn thành công!',
                'data' => $page,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xóa mềm trang đơn (đưa vào thùng rác)
     * DELETE /api/pages/{id}
     */
    public function destroy($id)
    {
        try {
            $page = Page::findOrFail($id);
            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã chuyển trang đơn vào thùng rác thành công!',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Khôi phục trang đơn từ thùng rác
     * POST /api/pages/{id}/restore hoặc PUT /api/pages/{id}/restore
     */
    public function restore($id)
    {
        try {
            $page = Page::onlyTrashed()->findOrFail($id);
            $page->restore();

            return response()->json([
                'success' => true,
                'message' => 'Đã khôi phục trang đơn thành công!',
                'data' => $page,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi khôi phục trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xóa vĩnh viễn trang đơn khỏi hệ thống
     * DELETE /api/pages/{id}/force
     */
    public function forceDelete($id)
    {
        try {
            $page = Page::onlyTrashed()->findOrFail($id);
            $page->forceDelete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa vĩnh viễn trang đơn thành công!',
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa vĩnh viễn trang đơn: ' . $e->getMessage(),
            ], 500);
        }
    }
}
