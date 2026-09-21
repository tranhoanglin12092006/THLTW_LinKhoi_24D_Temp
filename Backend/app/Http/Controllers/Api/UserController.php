<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // POST /api/register — luôn tạo vai_tro = member, KHÔNG cho client tự gửi vai_tro
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['vai_tro'] = 'member'; // ép cứng, tránh leo quyền
        $data['mat_khau'] = Hash::make($data['mat_khau']);

        $user  = User::create($data);
        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    // POST /api/login — dùng chung cho cả member lẫn admin
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Sai email hoặc mật khẩu'
            ], 401);
        }

        if (!Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'message' => 'Sai email hoặc mật khẩu'
            ], 401);
        }

        if (!$user->trang_thai) {
            return response()->json([
                'message' => 'Tài khoản đã bị khóa'
            ], 403);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $user->vai_tro,
            'user' => $user,
        ], 200);
    }

    // GET /api/me
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đã đăng xuất']);
    }

    // PUT /api/profile — tự sửa hồ sơ của chính mình
    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'ho_ten'        => ['required', 'max:150'],
            'so_dien_thoai' => ['nullable', 'max:20'],
            'dia_chi'       => ['nullable', 'max:255'],
        ]);

        $request->user()->update($data);
        return response()->json($request->user());
    }

    // POST /api/change-password
    public function changePassword(Request $request)
    {
        $request->validate([
            'mat_khau_cu'  => ['required'],
            'mat_khau_moi' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
        if (! Hash::check($request->mat_khau_cu, $user->mat_khau)) {
            return response()->json(['message' => 'Mật khẩu cũ không đúng'], 422);
        }

        $user->update(['mat_khau' => $request->mat_khau_moi]);
        return response()->json(['message' => 'Đổi mật khẩu thành công']);
    }

    // GET /api/admin/users — chỉ admin xem được (chặn ở middleware)
    public function index()
    {
        return response()->json(User::where('vai_tro', 'member')->get());
    }

    // PUT /api/admin/users/{id}/lock — admin khoá/mở tài khoản member
    public function toggleLock(User $user)
    {
        $user->update(['trang_thai' => ! $user->trang_thai]);
        return response()->json($user);
    }
}
