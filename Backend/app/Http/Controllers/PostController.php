<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Hiển thị danh sách bài viết có phân trang (10 mục/trang), tìm kiếm, lọc.
     * GET /api/posts
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));

        // Kiểm tra xem có đang xem thùng rác không
        if ($request->boolean('trashed') || $request->input('status') === 'trash') {
            $query = Post::onlyTrashed()->with('danhMucBaiViet')->orderBy('deleted_at', 'desc');
        } else {
            $query = Post::with('danhMucBaiViet')->orderBy('id', 'desc');

            // Lọc theo trạng thái xuất bản
            if ($request->has('status') && $request->input('status') !== '' && $request->input('status') !== 'all') {
                $query->where('trang_thai', (int) $request->input('status'));
            }
        }

        // Lọc theo danh mục bài viết
        $categoryId = $request->input('category_id') ?? $request->input('danh_muc_bai_viet_id');
        if ($categoryId && $categoryId !== 'all') {
            $query->where('danh_muc_bai_viet_id', $categoryId);
        }

        // Tìm kiếm theo tiêu đề hoặc nội dung
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('tieu_de', 'like', "%{$search}%")
                  ->orWhere('duong_dan', 'like', "%{$search}%")
                  ->orWhere('noi_dung', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate($perPage);

        // Đếm tổng số bài viết trong thùng rác
        $trashCount = Post::onlyTrashed()->count();

        return PostResource::collection($posts)->additional([
            'trash_count' => $trashCount,
        ]);
    }

    /**
     * Lấy danh sách bài viết trong thùng rác.
     * GET /api/posts/trash
     */
    public function trash(Request $request): AnonymousResourceCollection
    {
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));

        $query = Post::onlyTrashed()->with('danhMucBaiViet')->orderBy('deleted_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('tieu_de', 'like', "%{$search}%")
                  ->orWhere('duong_dan', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate($perPage);

        return PostResource::collection($posts);
    }

    /**
     * Lấy danh sách danh mục bài viết để hiển thị trong select box.
     * GET /api/post-categories
     */
    public function categories()
    {
        $categories = PostCategory::orderBy('id', 'desc')->get();
        return response()->json([
            'data' => $categories
        ]);
    }

    /**
     * Xem chi tiết một bài viết.
     * GET /api/posts/{id}
     */
    public function show($id)
    {
        $post = Post::withTrashed()->with('danhMucBaiViet')->findOrFail($id);

        return new PostResource($post);
    }

    /**
     * Thêm mới một bài viết.
     * POST /api/posts
     */
    public function store(PostRequest $request)
    {
        $data = $request->validated();

        // Tạo slug nếu không nhập
        if (empty($data['duong_dan'])) {
            $baseSlug = Str::slug($data['tieu_de']);
            $slug = $baseSlug;
            $counter = 1;
            while (Post::withTrashed()->where('duong_dan', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $data['duong_dan'] = $slug;
        }

        // Trạng thái mặc định
        if (!isset($data['trang_thai'])) {
            $data['trang_thai'] = 1;
        } else {
            $data['trang_thai'] = filter_var($data['trang_thai'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }

        // Ngày đăng mặc định
        if (empty($data['ngay_dang'])) {
            $data['ngay_dang'] = now();
        }

        // Xử lý upload ảnh đại diện hoặc chuỗi url
        if ($request->hasFile('anh_dai_dien')) {
            $data['anh_dai_dien'] = $request->file('anh_dai_dien')->store('posts', 'public');
        } elseif ($request->filled('anh_dai_dien')) {
            $data['anh_dai_dien'] = $request->input('anh_dai_dien');
        }

        $post = Post::create($data);
        $post->load('danhMucBaiViet');

        return (new PostResource($post))->additional([
            'message' => 'Thêm bài viết mới thành công!'
        ]);
    }

    /**
     * Cập nhật bài viết.
     * PUT/POST /api/posts/{id}
     */
    public function update(PostRequest $request, $id)
    {
        $post = Post::withTrashed()->findOrFail($id);
        $data = $request->validated();

        // Tạo slug nếu để trống
        if (empty($data['duong_dan'])) {
            $baseSlug = Str::slug($data['tieu_de']);
            $slug = $baseSlug;
            $counter = 1;
            while (Post::withTrashed()->where('duong_dan', $slug)->where('id', '!=', $post->id)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $data['duong_dan'] = $slug;
        }

        // Trạng thái
        if (isset($data['trang_thai'])) {
            $data['trang_thai'] = filter_var($data['trang_thai'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        }

        // Xử lý ảnh đại diện
        if ($request->hasFile('anh_dai_dien')) {
            // Xóa ảnh cũ nếu là file trong disk
            if ($post->anh_dai_dien && !str_starts_with($post->anh_dai_dien, 'http')) {
                Storage::disk('public')->delete($post->anh_dai_dien);
            }
            $data['anh_dai_dien'] = $request->file('anh_dai_dien')->store('posts', 'public');
        } elseif ($request->has('anh_dai_dien') && $request->input('anh_dai_dien') !== null && $request->input('anh_dai_dien') !== '') {
            $data['anh_dai_dien'] = $request->input('anh_dai_dien');
        } else {
            // Không thay đổi ảnh
            unset($data['anh_dai_dien']);
        }

        $post->update($data);
        $post->load('danhMucBaiViet');

        return (new PostResource($post))->additional([
            'message' => 'Cập nhật bài viết thành công!'
        ]);
    }

    /**
     * Xóa mềm bài viết.
     * DELETE /api/posts/{id}
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return response()->json([
            'message' => 'Đã chuyển bài viết vào thùng rác (xóa mềm thành công).'
        ], 200);
    }

    /**
     * Khôi phục bài viết đã xóa mềm.
     * PUT/POST /api/posts/{id}/restore
     */
    public function restore($id)
    {
        $post = Post::onlyTrashed()->findOrFail($id);
        $post->restore();
        $post->load('danhMucBaiViet');

        return (new PostResource($post))->additional([
            'message' => 'Khôi phục bài viết thành công!'
        ]);
    }

    /**
     * Xóa vĩnh viễn bài viết.
     * DELETE /api/posts/{id}/force
     */
    public function forceDelete($id)
    {
        $post = Post::withTrashed()->findOrFail($id);

        // Xóa ảnh đại diện vật lý nếu có
        if ($post->anh_dai_dien && !str_starts_with($post->anh_dai_dien, 'http')) {
            Storage::disk('public')->delete($post->anh_dai_dien);
        }

        $post->forceDelete();

        return response()->json([
            'message' => 'Đã xóa vĩnh viễn bài viết khỏi hệ thống.'
        ], 200);
    }
}
