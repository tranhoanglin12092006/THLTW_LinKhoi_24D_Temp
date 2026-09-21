<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    // người dùng có quyền truy cập vào request hay không
    public function authorize(): bool
    {
        return true;
    }
    // yêu cầu xác thực dữ liệu đầu vào cho việc đăng nhập người dùng
    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'mat_khau' => ['required'],
        ];
    }
}
