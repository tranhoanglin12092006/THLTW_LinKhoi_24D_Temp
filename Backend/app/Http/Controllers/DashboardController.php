<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // Lay toan bo du lieu thong ke cho Dashboard
    public function index(): JsonResponse
    {
        // Thong ke 4 o tong quan
        $tongSanPham = DB::table('san_pham')
            ->whereNull('deleted_at')
            ->count();

        $tongDanhMuc = DB::table('danh_muc')
            ->whereNull('deleted_at')
            ->count();

        // Dem don hang trong thang hien tai
        $tongDonHang = DB::table('don_hang')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $tongNguoiDung = DB::table('nguoi_dung')
            ->count();

        // Thong ke trang thai don hang
        $trangThaiDonHang = DB::table('don_hang')
            ->select('trang_thai', DB::raw('COUNT(*) as so_luong'))
            ->groupBy('trang_thai')
            ->get();

        // Doanh thu 7 ngay gan nhat
        // Chi tinh don hang da giao, trang_thai = 3
        $doanhThuTheoNgay = DB::table('don_hang')
            ->select(
                DB::raw('DATE(created_at) as ngay'),
                DB::raw('SUM(tong_tien) as doanh_thu')
            )
            ->where('trang_thai', 3)
            ->whereDate('created_at', '>=', Carbon::today()->subDays(6))
            ->whereDate('created_at', '<=', Carbon::today())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('ngay')
            ->get()
            ->keyBy('ngay');

        // Bo sung ngay khong co doanh thu bang 0
        $bieuDoDoanhThu = [];

        for ($i = 6; $i >= 0; $i--) {
            $ngay = Carbon::today()->subDays($i);
            $key = $ngay->toDateString();

            $bieuDoDoanhThu[] = [
                'ngay' => $key,
                'nhan' => $ngay->format('d/m'),
                'doanh_thu' => (float) (
                    $doanhThuTheoNgay[$key]->doanh_thu ?? 0
                ),
            ];
        }

        // Lay 5 don hang moi nhat
        $donHangGanDay = DB::table('don_hang')
            ->select(
                'id',
                'ma_don_hang',
                'ten_nguoi_nhan',
                'tong_tien',
                'trang_thai',
                'created_at'
            )
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        // Thong ke so san pham theo thuong hieu
        $sanPhamTheoThuongHieu = DB::table('thuong_hieu')
            ->leftJoin(
                'san_pham',
                'thuong_hieu.id',
                '=',
                'san_pham.thuong_hieu_id'
            )
            ->whereNull('san_pham.deleted_at')
            ->select(
                'thuong_hieu.id',
                'thuong_hieu.ten',
                DB::raw('COUNT(san_pham.id) as so_san_pham')
            )
            ->groupBy('thuong_hieu.id', 'thuong_hieu.ten')
            ->orderByDesc('so_san_pham')
            ->limit(4)
            ->get();

        return response()->json([
            'thong_ke' => [
                'san_pham' => $tongSanPham,
                'danh_muc' => $tongDanhMuc,
                'don_hang' => $tongDonHang,
                'nguoi_dung' => $tongNguoiDung,
            ],
            'trang_thai_don_hang' => $trangThaiDonHang,
            'doanh_thu_7_ngay' => $bieuDoDoanhThu,
            'don_hang_gan_day' => $donHangGanDay,
            'san_pham_theo_thuong_hieu' => $sanPhamTheoThuongHieu,
        ]);
    }
}

