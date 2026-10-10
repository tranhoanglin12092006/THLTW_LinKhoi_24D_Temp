<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Hiển thị danh sách người dùng có phân trang, tìm kiếm, lọc và thùng rác.
     *
     * GET /api/users
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = max(1, min((int) $request->input('per_page', 10), 100));

        // Kiểm tra xem có đang xem thùng rác (xóa mềm) không
        if ($request->boolean('trashed') || $request->input('status') === 'trash') {
            $query = User::onlyTrashed()->orderBy('deleted_at', 'desc');
        } else {
            $query = User::orderBy('id', 'desc');

            // Lọc theo trạng thái hoạt động: 1 = hoạt động, 0 = bị khóa
            if ($request->has('status') && $request->input('status') !== '' && $request->input('status') !== 'all') {
                $query->where('trang_thai', (int) $request->input('status'));
            }
        }

        // Tìm kiếm theo họ tên, email hoặc số điện thoại
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('ho_ten', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('so_dien_thoai', 'like', "%{$search}%");
            });
        }

        // Lọc theo vai trò (admin hoặc member / user)
        if ($request->filled('role') && $request->input('role') !== 'all') {
            $role = $request->input('role');
            if ($role === 'user') $role = 'member';
            $query->where('vai_tro', $role);
        }

        $users = $query->paginate($perPage);

        // Đếm tổng số người dùng trong thùng rác để hiển thị badge
        $trashCount = User::onlyTrashed()->count();

        return UserResource::collection($users)->additional([
            'trash_count' => $trashCount,
        ]);
    }

    /**
     * Lấy danh sách người dùng đã xóa mềm (thùng rác).
     *
     * GET /api/users/trash
     */
    public function trash(): AnonymousResourceCollection
    {
        $perPage = max(1, min((int) request()->input('per_page', 10), 100));

        $query = User::onlyTrashed()->orderBy('deleted_at', 'desc');

        if (request()->filled('search')) {
            $search = request()->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('ho_ten', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('so_dien_thoai', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Hiển thị chi tiết một người dùng.
     *
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Thêm người dùng mới.
     *
     * POST /api/users
     */
    public function store(UserRequest $request)
    {
        $data = $request->validated();

        // Chuẩn hóa vai trò (nếu gửi 'user' thì lưu 'member')
        if (!empty($data['vai_tro']) && $data['vai_tro'] === 'user') {
            $data['vai_tro'] = 'member';
        }

        // Trạng thái mặc định là 1 (hoạt động) nếu không chỉ định
        if (!isset($data['trang_thai'])) {
            $data['trang_thai'] = 1;
        } else {
            $data['trang_thai'] = (int) $data['trang_thai'];
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        $data['mat_khau'] = Hash::make($data['mat_khau']);

        $user = User::create($data);

        return (new UserResource($user))->additional([
            'message' => 'Thêm tài khoản người dùng thành công'
        ]);
    }

    /**
     * Cập nhật thông tin người dùng.
     *
     * PUT /api/users/{id}
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $data = $request->validated();

        // Chuẩn hóa vai trò
        if (!empty($data['vai_tro']) && $data['vai_tro'] === 'user') {
            $data['vai_tro'] = 'member';
        }

        // Chuẩn hóa trạng thái
        if (isset($data['trang_thai'])) {
            $data['trang_thai'] = (int) $data['trang_thai'];
        }

        // Nếu có nhập mật khẩu mới thì mã hóa mật khẩu
        if (!empty($data['mat_khau'])) {
            $data['mat_khau'] = Hash::make($data['mat_khau']);
        } else {
            unset($data['mat_khau']);
        }

        $user->update($data);

        return (new UserResource($user))->additional([
            'message' => 'Cập nhật thông tin người dùng thành công'
        ]);
    }

    /**
     * Khóa hoặc mở khóa tài khoản người dùng.
     *
     * PUT /api/users/{id}/toggle-lock
     */
    public function toggleLock($id)
    {
        $user = User::findOrFail($id);
        $user->trang_thai = !$user->trang_thai;
        $user->save();

        $action = $user->trang_thai ? 'Mở khóa' : 'Khóa';

        return (new UserResource($user))->additional([
            'message' => "{$action} tài khoản thành công"
        ]);
    }

    /**
     * Thay đổi vai trò người dùng (admin <-> member/user).
     *
     * PUT /api/users/{id}/change-role
     */
    public function changeRole(Request $request, $id)
    {
        $request->validate([
            'vai_tro' => 'required|in:admin,member,user',
        ], [
            'vai_tro.required' => 'Vui lòng chọn vai trò.',
            'vai_tro.in' => 'Vai trò không hợp lệ.',
        ]);

        $user = User::findOrFail($id);
        $role = $request->input('vai_tro');
        if ($role === 'user') $role = 'member';

        $user->vai_tro = $role;
        $user->save();

        return (new UserResource($user))->additional([
            'message' => 'Thay đổi vai trò người dùng thành công'
        ]);
    }

    /**
     * Xóa mềm người dùng (chuyển vào thùng rác).
     *
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Đã chuyển người dùng vào thùng rác'
        ]);
    }

    /**
     * Khôi phục người dùng đã xóa mềm.
     *
     * PUT /api/users/{id}/restore
     */
    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return (new UserResource($user))->additional([
            'message' => 'Khôi phục tài khoản người dùng thành công'
        ]);
    }

    /**
     * Xóa vĩnh viễn người dùng khỏi cơ sở dữ liệu.
     *
     * DELETE /api/users/{id}/force
     */
    public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->forceDelete();

        return response()->json([
            'message' => 'Đã xóa vĩnh viễn tài khoản người dùng'
        ]);
    }
}