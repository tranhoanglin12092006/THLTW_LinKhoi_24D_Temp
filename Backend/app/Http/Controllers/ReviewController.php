<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá của 1 sản phẩm.
     * GET /api/products/{id}/reviews
     */
    public function index($productId)
    {
        // 1. Kiểm tra sản phẩm có tồn tại không
        $product = Product::findOrFail($productId);

        // 2. Lấy các đánh giá đã được duyệt (trang_thai = 1), sắp xếp mới nhất lên đầu
        $reviews = Review::where('san_pham_id', $productId)
            ->where('trang_thai', true)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $reviews,
            'summary' => [
                'diem_trung_binh' => $product->diem_danh_gia,
                'tong_danh_gia'   => $product->so_luong_danh_gia,
            ]
        ]);
    }

    /**
     * Gửi thêm đánh giá mới cho sản phẩm.
     * POST /api/products/{id}/reviews
     */
    public function store(Request $request, $productId)
    {
        // 1. Kiểm tra sản phẩm tồn tại
        Product::findOrFail($productId);

        // 2. Kiểm tra tính hợp lệ của dữ liệu gửi lên
        $request->validate([
            'ho_ten'   => 'nullable|string|max:100',
            'so_sao'   => 'required|integer|min:1|max:5',
            'noi_dung' => 'required|string|max:1000',
        ], [
            'so_sao.required'   => 'Vui lòng chọn số sao đánh giá (1-5 sao).',
            'noi_dung.required' => 'Vui lòng nhập nội dung nhận xét chi tiết.',
        ]);

        // Tự động lấy tên người dùng nếu không gửi họ tên lên
        $authorName = $request->input('ho_ten');
        if (!$authorName) {
            $user = $request->user();
            $authorName = $user ? ($user->ho_ten ?? $user->name ?? $user->email) : 'Khách hàng TECHNOVA';
        }

        // 3. Tạo mới bản ghi đánh giá vào bảng danh_gia
        $review = Review::create([
            'san_pham_id' => $productId,
            'ho_ten'      => $authorName,
            'so_sao'      => (int) $request->input('so_sao'),
            'noi_dung'    => $request->input('noi_dung'),
            'trang_thai'  => true, // Mặc định hiển thị luôn
        ]);

        return response()->json([
            'message' => 'Gửi đánh giá sản phẩm thành công! Cảm ơn bạn.',
            'data'    => $review
        ], 201);
    }
}
