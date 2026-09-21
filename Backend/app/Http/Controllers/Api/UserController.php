<?php

// Khai báo namespace của Controller này.
// File đang nằm trong thư mục app/Http/Controllers/Api
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
// Import Request của Laravel để lấy thông tin request hiện tại.
use Illuminate\Http\Request;
// Import Hash để mã hóa và kiểm tra mật khẩu.
use Illuminate\Support\Facades\Hash;


// Khai báo UserController kế thừa Controller của Laravel.
class UserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    | POST /api/register
    |
    | Chức năng:
    | - Đăng ký tài khoản mới.
    | - Luôn ép vai_tro = member.
    | - Không cho client tự gửi vai_tro để tránh leo quyền.
    */
    public function register(RegisterRequest $request)
    {
        try {

            // Lấy toàn bộ dữ liệu đã được RegisterRequest validate.
            $data = $request->validated();

            // Ép tất cả tài khoản đăng ký từ API thành member.
            // Client không thể gửi vai_tro = admin để tự nâng quyền.
            $data['vai_tro'] = 'member';

            // Hash mật khẩu trước khi lưu vào database.
            $data['mat_khau'] = Hash::make($data['mat_khau']);

            // Tạo user mới trong database.
            $user = User::create($data);

            // Tạo API token bằng Laravel Sanctum.
            // plainTextToken là token dạng client có thể sử dụng.
            $token = $user->createToken('web')->plainTextToken;

            // Trả response JSON cho client.
            return response()->json([
                'message' => 'Đăng ký thành công',

                // Thông tin user vừa tạo.
                'user' => $user,

                // Token dùng để xác thực các request sau.
                'token' => $token,
            ], 201);
        } catch (\Throwable $e) {

            // Nếu xảy ra bất kỳ lỗi nào trong quá trình đăng ký,
            // chương trình sẽ chạy vào đây thay vì làm API bị crash.
            return response()->json([
                'message' => 'Đăng ký thất bại',

                // Lấy nội dung lỗi để biết nguyên nhân.
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    | POST /api/login
    |
    | Chức năng:
    | - Đăng nhập cho cả member và admin.
    | - Kiểm tra email.
    | - Kiểm tra mật khẩu.
    | - Kiểm tra trạng thái tài khoản.
    | - Tạo token nếu đăng nhập thành công.
    */
    public function login(LoginRequest $request)
    {
        try {

            // Tìm user dựa theo email được gửi lên.
            $user = User::where('email', $request->email)->first();

            // Nếu không tìm thấy user.
            if (!$user) {

                // Trả lỗi 401 Unauthorized.
                return response()->json([
                    'message' => 'Sai email hoặc mật khẩu'
                ], 401);
            }

            // Hash::check() dùng để so sánh:
            // mật khẩu người dùng nhập
            // với mật khẩu đã được hash trong database.
            if (!Hash::check($request->mat_khau, $user->mat_khau)) {

                // Nếu mật khẩu không đúng thì trả lỗi 401.
                return response()->json([
                    'message' => 'Sai email hoặc mật khẩu'
                ], 401);
            }

            // Kiểm tra tài khoản có đang hoạt động hay không.
            // trang_thai = 0 nghĩa là tài khoản bị khóa.
            if (!$user->trang_thai) {

                // Nếu tài khoản bị khóa thì trả lỗi 403.
                return response()->json([
                    'message' => 'Tài khoản đã bị khóa'
                ], 403);
            }

            // Nếu mọi thông tin đều đúng,
            // tạo token đăng nhập bằng Sanctum.
            $token = $user->createToken('web')->plainTextToken;

            // Trả thông tin đăng nhập thành công.
            return response()->json([
                'message' => 'Đăng nhập thành công',

                // Token để client lưu và gửi trong Authorization.
                'token' => $token,

                // Trả role để frontend biết user là admin hay member.
                'role' => $user->vai_tro,

                // Trả thông tin user.
                'user' => $user,
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi bất ngờ trong quá trình login.
            return response()->json([
                'message' => 'Đăng nhập thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | ME
    |--------------------------------------------------------------------------
    | GET /api/me
    |
    | Chức năng:
    | Lấy thông tin user đang đăng nhập.
    */
    public function me(Request $request)
    {
        try {

            // $request->user() lấy user từ token đăng nhập.
            $user = $request->user();

            // Trả thông tin user.
            return response()->json([
                'user' => $user,
            ], 200);
        } catch (\Throwable $e) {

            // Nếu xảy ra lỗi thì trả lỗi server.
            return response()->json([
                'message' => 'Không thể lấy thông tin người dùng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    | POST /api/logout
    |
    | Chức năng:
    | Xóa token hiện tại để đăng xuất.
    */
    public function logout(Request $request)
    {
        try {

            // Lấy user đang đăng nhập.
            $user = $request->user();

            // Lấy token hiện tại mà user đang sử dụng.
            $currentToken = $user->currentAccessToken();

            // Nếu có token thì xóa token đó.
            if ($currentToken) {
                $currentToken->delete();
            }

            // Trả thông báo đăng xuất thành công.
            return response()->json([
                'message' => 'Đã đăng xuất'
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi trong quá trình logout.
            return response()->json([
                'message' => 'Đăng xuất thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROFILE
    |--------------------------------------------------------------------------
    | PUT /api/profile
    |
    | Chức năng:
    | User tự sửa thông tin của chính mình.
    */
    public function updateProfile(Request $request)
    {
        try {

            // Validate dữ liệu người dùng gửi lên.
            $data = $request->validate([

                // Họ tên bắt buộc nhập.
                // Tối đa 150 ký tự.
                'ho_ten' => [
                    'required',
                    'max:150'
                ],

                // Số điện thoại không bắt buộc.
                // Nếu nhập thì tối đa 20 ký tự.
                'so_dien_thoai' => [
                    'nullable',
                    'max:20'
                ],

                // Địa chỉ không bắt buộc.
                // Nếu nhập thì tối đa 255 ký tự.
                'dia_chi' => [
                    'nullable',
                    'max:255'
                ],
            ]);

            // Lấy user đang đăng nhập.
            $user = $request->user();

            // Cập nhật dữ liệu profile.
            $user->update($data);

            // Trả thông tin user sau khi cập nhật.
            return response()->json([
                'message' => 'Cập nhật hồ sơ thành công',
                'user' => $user,
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi khi update profile.
            return response()->json([
                'message' => 'Cập nhật hồ sơ thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE PASSWORD
    |--------------------------------------------------------------------------
    | POST /api/change-password
    |
    | Chức năng:
    | - Kiểm tra mật khẩu cũ.
    | - Kiểm tra mật khẩu mới.
    | - Hash mật khẩu mới.
    */
    public function changePassword(Request $request)
    {
        try {

            // Validate dữ liệu đổi mật khẩu.
            $request->validate([

                // Mật khẩu cũ bắt buộc nhập.
                'mat_khau_cu' => [
                    'required'
                ],

                // Mật khẩu mới:
                // - bắt buộc
                // - ít nhất 8 ký tự
                // - phải có mat_khau_moi_confirmation
                'mat_khau_moi' => [
                    'required',
                    'min:8',
                    'confirmed'
                ],
            ]);

            // Lấy user hiện tại.
            $user = $request->user();

            // Kiểm tra mật khẩu cũ có đúng không.
            if (!Hash::check(
                $request->mat_khau_cu,
                $user->mat_khau
            )) {

                // Nếu sai thì trả lỗi.
                return response()->json([
                    'message' => 'Mật khẩu cũ không đúng'
                ], 422);
            }

            // QUAN TRỌNG:
            // Phải Hash mật khẩu mới trước khi lưu database.
            $user->update([
                'mat_khau' => Hash::make($request->mat_khau_moi)
            ]);

            // Trả thông báo thành công.
            return response()->json([
                'message' => 'Đổi mật khẩu thành công'
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi trong quá trình đổi mật khẩu.
            return response()->json([
                'message' => 'Đổi mật khẩu thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - INDEX USERS
    |--------------------------------------------------------------------------
    | GET /api/admin/users
    |
    | Chức năng:
    | Admin xem danh sách member.
    |
    | Middleware phải đảm bảo chỉ admin mới gọi được API này.
    */
    public function index()
    {
        try {

            // Lấy tất cả user có vai_tro = member.
            $users = User::where('vai_tro', 'member')->get();

            // Trả danh sách member.
            return response()->json([
                'data' => $users
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi khi lấy danh sách user.
            return response()->json([
                'message' => 'Không thể lấy danh sách người dùng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN - TOGGLE LOCK
    |--------------------------------------------------------------------------
    | PUT /api/admin/users/{id}/lock
    |
    | Chức năng:
    | Admin khóa hoặc mở khóa member.
    */
    public function toggleLock(User $user)
    {
        try {

            // Đảo trạng thái tài khoản.
            //
            // Nếu trang_thai = 1
            // => chuyển thành 0 => khóa.
            //
            // Nếu trang_thai = 0
            // => chuyển thành 1 => mở khóa.
            $user->update([
                'trang_thai' => !$user->trang_thai
            ]);

            // Trả user sau khi thay đổi trạng thái.
            return response()->json([
                'message' => $user->trang_thai
                    ? 'Mở khóa tài khoản thành công'
                    : 'Khóa tài khoản thành công',

                'user' => $user,
            ], 200);
        } catch (\Throwable $e) {

            // Bắt lỗi khi khóa/mở khóa tài khoản.
            return response()->json([
                'message' => 'Không thể thay đổi trạng thái tài khoản',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}