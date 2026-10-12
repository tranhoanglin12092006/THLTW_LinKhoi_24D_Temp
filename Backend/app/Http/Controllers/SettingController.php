<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Lấy toàn bộ danh sách cấu hình hệ thống
     * GET /api/settings
     */
    public function index()
    {
        try {
            $settings = Setting::all();

            // Chuyển thành dạng key-value map để frontend dễ dùng trực tiếp
            $settingsMap = [];
            foreach ($settings as $setting) {
                $settingsMap[$setting->khoa] = $setting->gia_tri;
            }

            return response()->json([
                'success' => true,
                'data' => $settings,
                'map' => $settingsMap,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tải cấu hình hệ thống: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Lấy giá trị của một cấu hình theo khóa
     * GET /api/settings/{khoa}
     */
    public function show($khoa)
    {
        try {
            $setting = Setting::where('khoa', $khoa)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cấu hình với khóa: ' . $khoa,
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $setting,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy cấu hình: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cập nhật hoặc lưu nhiều cấu hình cùng lúc
     * POST /api/settings
     * Body: { settings: { "site_name": "TECHNOVA", "hotline": "1800 6868", ... } }
     */
    public function updateBulk(Request $request)
    {
        try {
            $settingsData = $request->input('settings', []);

            if (!is_array($settingsData) || empty($settingsData)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu cấu hình không hợp lệ!',
                ], 422);
            }

            foreach ($settingsData as $khoa => $gia_tri) {
                if (is_string($khoa) && trim($khoa) !== '') {
                    Setting::updateOrCreate(
                        ['khoa' => trim($khoa)],
                        ['gia_tri' => is_array($gia_tri) ? json_encode($gia_tri, JSON_UNESCAPED_UNICODE) : $gia_tri]
                    );
                }
            }

            $allSettings = Setting::all();
            $settingsMap = [];
            foreach ($allSettings as $item) {
                $settingsMap[$item->khoa] = $item->gia_tri;
            }

            return response()->json([
                'success' => true,
                'message' => 'Lưu cấu hình hệ thống thành công!',
                'data' => $allSettings,
                'map' => $settingsMap,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật cấu hình: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Thêm hoặc cập nhật một mục cấu hình đơn lẻ
     * PUT /api/settings/{khoa}
     */
    public function updateSingle(Request $request, $khoa)
    {
        try {
            $request->validate([
                'gia_tri' => 'nullable',
            ]);

            $setting = Setting::updateOrCreate(
                ['khoa' => $khoa],
                ['gia_tri' => $request->input('gia_tri')]
            );

            return response()->json([
                'success' => true,
                'message' => "Cập nhật cấu hình {$khoa} thành công!",
                'data' => $setting,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lưu cấu hình: ' . $e->getMessage(),
            ], 500);
        }
    }
}
