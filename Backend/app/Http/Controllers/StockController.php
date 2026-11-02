<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\StockImport;
use App\Models\StockImportDetail;
use App\Models\StockExport;
use App\Models\StockExportDetail;
use App\Models\Product;

class StockController extends Controller
{
    /**
     * =========================================================================
     * CHỨC NĂNG: FUNC-ADM-STOCK-01 - TẠO PHIẾU NHẬP HÀNG
     * ACTOR: Quản trị viên (Admin)
     * MỤC TIÊU: Ghi nhận phiếu nhập kho từ nhà cung cấp và tự động tăng số lượng tồn kho của các sản phẩm.
     * API: POST /api/stock/imports
     * =========================================================================
     */
    public function storeImport(Request $request)
    {
        // -------------------------------------------------------------
        // BƯỚC 1: KIỂM TRA TÍNH HỢP LỆ CỦA DỮ LIỆU ĐẦU VÀO (VALIDATION)
        // -------------------------------------------------------------
        $validated = $request->validate([
            // Tên nhà cung cấp (chuỗi ký tự, tối đa 255 ký tự, có thể để trống nếu chưa rõ)
            'ten_nha_cung_cap' => 'nullable|string|max:255',

            // Ghi chú đợt nhập hàng (tùy chọn)
            'ghi_chu'          => 'nullable|string',

            // ID của người tạo phiếu (nếu có, phải tồn tại trong bảng nguoi_dung)
            'nguoi_tao'        => 'nullable|exists:nguoi_dung,id',

            // Danh sách các mặt hàng nhập: bắt buộc phải có ít nhất 1 mặt hàng
            'items'            => 'required|array|min:1',

            // ID sản phẩm trong danh sách: bắt buộc, phải có thật trong bảng san_pham
            'items.*.san_pham_id' => 'required|exists:san_pham,id',

            // Số lượng nhập của từng món: bắt buộc là số nguyên dương lớn hơn 0
            'items.*.so_luong'    => 'required|integer|min:1',

            // Đơn giá nhập của từng sản phẩm: bắt buộc là số không âm (>= 0)
            'items.*.gia'         => 'required|numeric|min:0',
        ], [
            // Thông báo lỗi tiếng Việt thân thiện, dễ hiểu
            'items.required'            => 'Vui lòng chọn ít nhất một sản phẩm để nhập kho.',
            'items.min'                 => 'Phiếu nhập phải có ít nhất một sản phẩm.',
            'items.*.san_pham_id.required' => 'Mã sản phẩm không được để trống.',
            'items.*.san_pham_id.exists'   => 'Sản phẩm chọn nhập không tồn tại trong hệ thống.',
            'items.*.so_luong.required' => 'Số lượng nhập không được để trống.',
            'items.*.so_luong.integer'  => 'Số lượng nhập phải là số nguyên.',
            'items.*.so_luong.min'      => 'Số lượng nhập mỗi sản phẩm phải lớn hơn hoặc bằng 1.',
            'items.*.gia.required'      => 'Đơn giá nhập không được để trống.',
            'items.*.gia.numeric'       => 'Đơn giá nhập phải là chữ số.',
            'items.*.gia.min'           => 'Đơn giá nhập không thể là số âm.',
        ]);

        // -------------------------------------------------------------
        // BƯỚC 2: XỬ LÝ LƯU VÀO DATABASE VỚI TRANSACTION AN TOÀN
        // (Sử dụng DB::beginTransaction để nếu có bất kỳ bước nào lỗi, hệ thống sẽ tự khôi phục lại như cũ, tránh lệch tồn kho)
        // -------------------------------------------------------------
        DB::beginTransaction();

        try {
            // Xác định người tạo phiếu: ưu tiên lấy từ tài khoản đang đăng nhập (nếu có Sanctum), hoặc từ form gửi lên
            $nguoiTaoId = auth('sanctum')->id() ?? $validated['nguoi_tao'] ?? null;

            // 1. Tạo phiếu nhập kho chính (bảng phieu_nhap_kho)
            $stockImport = StockImport::create([
                'ten_nha_cung_cap' => $validated['ten_nha_cung_cap'] ?? null,
                'ghi_chu'          => $validated['ghi_chu'] ?? null,
                'nguoi_tao'        => $nguoiTaoId,
            ]);

            // 2. Lặp qua danh sách sản phẩm để lưu chi tiết phiếu và tăng tồn kho
            foreach ($validated['items'] as $item) {
                // Tạo một bản ghi chi tiết nhập hàng (bảng chi_tiet_phieu_nhap_kho)
                StockImportDetail::create([
                    'phieu_nhap_kho_id' => $stockImport->id,
                    'san_pham_id'       => $item['san_pham_id'],
                    'so_luong'          => $item['so_luong'],
                    'gia'               => $item['gia'],
                ]);

                // Tìm sản phẩm trong bảng san_pham
                $product = Product::findOrFail($item['san_pham_id']);

                // Tăng số lượng tồn kho của sản phẩm: so_luong_ton = so_luong_ton + so_luong
                $product->increment('so_luong_ton', $item['so_luong']);
            }

            // Hoàn tất mọi thay đổi vào cơ sở dữ liệu nếu không có lỗi
            DB::commit();

            // Tải thêm thông tin quan hệ chi tiết phiếu và sản phẩm để trả về cho Frontend
            $stockImport->load(['chiTietPhieuNhapKhos.sanPham', 'nguoiTaoPhieu']);

            // Trả về kết quả thành công cho Client
            return response()->json([
                'status'  => 'success',
                'message' => 'Tạo phiếu nhập hàng và cập nhật số lượng tồn kho thành công!',
                'data'    => $stockImport,
            ], 201);

        } catch (\Exception $e) {
            // Nếu có bất kỳ lỗi nào xảy ra trong quá trình thêm chi tiết hoặc cập nhật tồn, hủy bỏ toàn bộ
            DB::rollBack();

            return response()->json([
                'status'  => 'error',
                'message' => 'Đã có lỗi xảy ra khi tạo phiếu nhập kho: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================================================================
     * CHỨC NĂNG: FUNC-ADM-STOCK-02 - TẠO PHIẾU XUẤT HÀNG
     * ACTOR: Quản trị viên (Admin)
     * MỤC TIÊU: Xuất trả nhà cung cấp, xuất hủy hàng lỗi (ngoài bán hàng), tự động kiểm tra tồn và trừ số lượng tồn kho.
     * API: POST /api/stock/exports
     * =========================================================================
     */
    public function storeExport(Request $request)
    {
        // -------------------------------------------------------------
        // BƯỚC 1: KIỂM TRA TÍNH HỢP LỆ DỮ LIỆU ĐẦU VÀO (VALIDATION)
        // -------------------------------------------------------------
        $validated = $request->validate([
            // Lý do xuất hàng (ví dụ: Xuất trả nhà cung cấp, Xuất hủy hàng lỗi, ...)
            'ly_do'             => 'required|string|max:255',

            // Ghi chú chi tiết đợt xuất (tùy chọn)
            'ghi_chu'           => 'nullable|string',

            // ID quản trị viên tạo phiếu (nếu có)
            'nguoi_tao'         => 'nullable|exists:nguoi_dung,id',

            // Danh sách mặt hàng xuất: tối thiểu 1 sản phẩm
            'items'             => 'required|array|min:1',

            // Mã sản phẩm xuất: phải có thật trong bảng san_pham
            'items.*.san_pham_id' => 'required|exists:san_pham,id',

            // Số lượng xuất: bắt buộc là số nguyên dương >= 1
            'items.*.so_luong'    => 'required|integer|min:1',
        ], [
            'ly_do.required'             => 'Vui lòng chọn hoặc nhập lý do xuất kho.',
            'items.required'             => 'Vui lòng chọn ít nhất một sản phẩm để xuất kho.',
            'items.min'                  => 'Phiếu xuất phải có ít nhất một sản phẩm.',
            'items.*.san_pham_id.required' => 'Mã sản phẩm không được để trống.',
            'items.*.san_pham_id.exists'   => 'Sản phẩm chọn xuất không tồn tại trong hệ thống.',
            'items.*.so_luong.required'  => 'Số lượng xuất không được để trống.',
            'items.*.so_luong.integer'   => 'Số lượng xuất phải là số nguyên.',
            'items.*.so_luong.min'       => 'Số lượng xuất mỗi sản phẩm phải lớn hơn hoặc bằng 1.',
        ]);

        // -------------------------------------------------------------
        // BƯỚC 2: KIỂM TRA TỒN KHO TRƯỚC KHI XUẤT (TRÁNH XUẤT ÂM KHO)
        // -------------------------------------------------------------
        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['san_pham_id']);
            if ($product->so_luong_ton < $item['so_luong']) {
                return response()->json([
                    'status'  => 'error',
                    'message' => "Sản phẩm '{$product->ten}' không đủ số lượng tồn để xuất! (Hiện tại trong kho chỉ còn: {$product->so_luong_ton}, bạn đang yêu cầu xuất: {$item['so_luong']}).",
                ], 422);
            }
        }

        // -------------------------------------------------------------
        // BƯỚC 3: XỬ LÝ LƯU VÀO DATABASE VỚI TRANSACTION AN TOÀN
        // -------------------------------------------------------------
        DB::beginTransaction();

        try {
            // Xác định người tạo phiếu
            $nguoiTaoId = auth('sanctum')->id() ?? $validated['nguoi_tao'] ?? null;

            // 1. Tạo phiếu xuất kho chính (bảng phieu_xuat_kho)
            $stockExport = StockExport::create([
                'ly_do'     => $validated['ly_do'],
                'ghi_chu'   => $validated['ghi_chu'] ?? null,
                'nguoi_tao' => $nguoiTaoId,
            ]);

            // 2. Lặp qua danh sách sản phẩm để lưu chi tiết phiếu và trừ tồn kho
            foreach ($validated['items'] as $item) {
                // Tạo chi tiết phiếu xuất (bảng chi_tiet_phieu_xuat_kho)
                StockExportDetail::create([
                    'phieu_xuat_kho_id' => $stockExport->id,
                    'san_pham_id'       => $item['san_pham_id'],
                    'so_luong'          => $item['so_luong'],
                ]);

                // Tìm sản phẩm và trừ số lượng tồn: so_luong_ton = so_luong_ton - so_luong
                $product = Product::findOrFail($item['san_pham_id']);
                $product->decrement('so_luong_ton', $item['so_luong']);
            }

            // Hoàn tất lưu dữ liệu an toàn
            DB::commit();

            // Tải quan hệ chi tiết phiếu và sản phẩm để trả về cho Client
            $stockExport->load(['chiTietPhieuXuatKhos.sanPham', 'nguoiTaoPhieu']);

            return response()->json([
                'status'  => 'success',
                'message' => 'Tạo phiếu xuất hàng và cập nhật giảm tồn kho thành công!',
                'data'    => $stockExport,
            ], 201);

        } catch (\Exception $e) {
            // Có lỗi phát sinh -> hủy bỏ mọi thay đổi
            DB::rollBack();

            return response()->json([
                'status'  => 'error',
                'message' => 'Đã có lỗi xảy ra khi tạo phiếu xuất kho: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================================================================
     * CHỨC NĂNG: FUNC-ADM-STOCK-03 - LẤY DANH SÁCH LỊCH SỬ PHIẾU NHẬP KHO
     * ACTOR: Quản trị viên (Admin)
     * API: GET /api/stock/imports
     * =========================================================================
     */
    public function getImports(Request $request)
    {
        try {
            // Lấy danh sách phiếu nhập, tải kèm người tạo phiếu và chi tiết từng sản phẩm
            $imports = StockImport::with([
                'nguoiTaoPhieu',
                'chiTietPhieuNhapKhos.sanPham',
            ])
            ->orderBy('id', 'desc')
            ->get();

            return response()->json([
                'status'  => 'success',
                'message' => 'Lấy danh sách phiếu nhập kho thành công!',
                'data'    => $imports,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi khi lấy lịch sử phiếu nhập: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================================================================
     * CHỨC NĂNG: FUNC-ADM-STOCK-03 - LẤY DANH SÁCH LỊCH SỬ PHIẾU XUẤT KHO
     * ACTOR: Quản trị viên (Admin)
     * API: GET /api/stock/exports
     * =========================================================================
     */
    public function getExports(Request $request)
    {
        try {
            // Lấy danh sách phiếu xuất, tải kèm người tạo phiếu và chi tiết từng sản phẩm xuất
            $exports = StockExport::with([
                'nguoiTaoPhieu',
                'chiTietPhieuXuatKhos.sanPham',
            ])
            ->orderBy('id', 'desc')
            ->get();

            return response()->json([
                'status'  => 'success',
                'message' => 'Lấy danh sách phiếu xuất kho thành công!',
                'data'    => $exports,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi khi lấy lịch sử phiếu xuất: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================================================================
     * CHỨC NĂNG: FUNC-ADM-STOCK-03 - BÁO CÁO TỒN KHO VÀ CẢNH BÁO
     * ACTOR: Quản trị viên (Admin)
     * API: GET /api/stock/inventory
     * =========================================================================
     */
    public function getInventory(Request $request)
    {
        try {
            // Lấy tất cả sản phẩm kèm danh mục và thương hiệu
            $products = Product::with(['danhMuc', 'thuongHieu'])
                ->orderBy('so_luong_ton', 'asc') // Ưu tiên xếp sản phẩm ít tồn lên đầu để dễ theo dõi
                ->get();

            // Tính toán nhanh số liệu thống kê tổng quan kho hàng
            $totalProducts = $products->count();
            $totalStockQuantity = $products->sum('so_luong_ton');
            $outOfStockCount = $products->where('so_luong_ton', '<=', 0)->count();
            // Sản phẩm dưới 20 cái: Báo đỏ để người quản lý biết cần nhập thêm hàng
            $needImportCount = $products->where('so_luong_ton', '<', 20)->count();

            return response()->json([
                'status' => 'success',
                'data'   => [
                    'statistics' => [
                        'total_products'       => $totalProducts,       // Tổng số mặt hàng kinh doanh
                        'total_stock_quantity' => $totalStockQuantity,   // Tổng số lượng hàng tồn thực tế
                        'out_of_stock'         => $outOfStockCount,      // Số mặt hàng đã hết nhẵn (<= 0)
                        'need_import'          => $needImportCount,      // Số mặt hàng dưới 20 cái (báo đỏ cần nhập)
                        'low_stock'            => $needImportCount,      // Giữ cho tính tương thích
                    ],
                    'items'      => $products,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi khi lấy báo cáo tồn kho: ' . $e->getMessage(),
            ], 500);
        }
    }
}
