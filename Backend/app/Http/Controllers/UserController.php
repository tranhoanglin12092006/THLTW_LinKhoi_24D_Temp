<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Hiển thị danh sách người dùng.
     *
     * GET /api/users
     */
    public function index(): AnonymousResourceCollection
    {
        $perPage = request()->get('per_page', 10);

        $users = User::orderBy('id')->paginate($perPage); 

        return UserResource::collection($users);
    }

    /**
     * Hiển thị chi tiết một người dùng.
     *
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Thêm người dùng mới.
     *
     * POST /api/users
     */
    public function store(UserRequest $request)
    {
        // Lấy dữ liệu đã được kiểm tra
        $data = $request->validated();

        // Mã hóa mật khẩu trước khi lưu vào database
        $data['mat_khau'] = Hash::make($data['mat_khau']);

        // Tạo người dùng mới
        $user = User::create($data);

        return new UserResource($user);
    }

    /**
     * Cập nhật người dùng.
     *
     * PUT /api/users/{id}
     */
    public function update(UserRequest $request, $id)
    {
        // Tìm người dùng cần sửa
        $user = User::findOrFail($id);

        // Lấy dữ liệu đã được kiểm tra
        $data = $request->validated();

        // Nếu có nhập mật khẩu mới thì mã hóa mật khẩu
        if (!empty($data['mat_khau'])) {
            $data['mat_khau'] = Hash::make($data['mat_khau']);
        } else {
            // Nếu không đổi mật khẩu thì không cập nhật cột mat_khau
            unset($data['mat_khau']);
        }

        // Cập nhật người dùng
        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Xóa người dùng.
     *
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        // Tìm người dùng
        $user = User::findOrFail($id);

        // Xóa người dùng
        $user->delete();

        return response()->json([
            'message' => 'Xóa người dùng thành công'
        ]);
    }
}