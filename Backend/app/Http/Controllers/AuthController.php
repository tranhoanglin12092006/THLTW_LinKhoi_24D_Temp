<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/auth/local
    // Đăng nhập User bằng email và mật khẩu
    public function login(Request $request)
    {
        // Kiểm tra dữ liệu người dùng gửi lên
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tìm User theo email
        $user = User::where('email', $request->email)->first();

        // Kiểm tra User có tồn tại và mật khẩu có đúng không
        if (!$user || !Hash::check($request->password, $user->mat_khau)) {
            return response()->json([
                'message' => 'Sai email hoặc mật khẩu'
            ], 401);
        }

        // Kiểm tra tài khoản có đang hoạt động không
        if (!$user->trang_thai) {
            return response()->json([
                'message' => 'Tài khoản đã bị khóa'
            ], 403);
        }

        // Tạo token đăng nhập cho User
        $token = $user->createToken('user')->plainTextToken;

        // Trả thông tin User và token về Frontend
        return response()->json([
            'user' => $user,
            'access_token' => $token,
        ]);
    }

    // POST /api/auth/local/register
    // Đăng ký User mới
    public function register(Request $request)
    {
        // Kiểm tra dữ liệu đăng ký
        $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => 'required|email|unique:nguoi_dung,email',
            'so_dien_thoai' => 'nullable|string|max:255',
            'dia_chi' => 'nullable|string|max:255',
            'password' => 'required|min:6',
        ]);

        // Tạo User mới trong database
        $user = User::create([
            'ho_ten' => $request->ho_ten,
            'email' => $request->email,
            'so_dien_thoai' => $request->so_dien_thoai,
            'dia_chi' => $request->dia_chi,

            // Mã hóa mật khẩu trước khi lưu
            'mat_khau' => Hash::make($request->password),

            // User đăng ký mới mặc định là member
            'vai_tro' => 'member',

            // Tài khoản mới được kích hoạt
            'trang_thai' => 1,
        ]);

        // Trả kết quả đăng ký về Frontend
        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => $user,
        ], 201);
    }

    // GET /api/auth/me
    // Lấy thông tin User đang đăng nhập
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    // POST /api/auth/logout
    // Đăng xuất User
    public function logout(Request $request)
    {
        // Xóa token hiện tại của User
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}