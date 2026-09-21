<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Đăng nhập Admin
    public function adminLogin(Request $request)
    {
        // Kiểm tra dữ liệu người dùng nhập
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm tài khoản có email và quyền Admin
        $admin = Admin::where('email', $request->email)
            ->where('vai_tro', 'admin')
            ->first();

        // Kiểm tra tài khoản và mật khẩu
        if (!$admin || !Hash::check($request->password, $admin->mat_khau)) {
            return response()->json([
                'message' => 'Sai email hoặc mật khẩu'
            ], 401);
        }

        // Kiểm tra tài khoản có đang hoạt động không
        if (!$admin->trang_thai) {
            return response()->json([
                'message' => 'Tài khoản Admin đã bị khóa'
            ], 403);
        }

        // Tạo token đăng nhập
        $token = $admin->createToken('admin')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập Admin thành công',
            'access_token' => $token,
            'admin' => $admin,
            'role' => $admin->vai_tro,
        ]);
    }
}