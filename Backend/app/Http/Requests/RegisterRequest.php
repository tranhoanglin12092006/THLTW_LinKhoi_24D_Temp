<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    // nguời dùng có quyền truy cập vào request hay không
    public function authorize(): bool
    {
        return true;
    }

    // cac quy tắc xác thực dữ liệu đầu vào cho việc đăng ký người dùng
    public function rules(): array
    {
        return [
            'ho_ten'                 => ['required', 'string', 'max:150'],
            'email'                  => ['required', 'email', 'unique:nguoi_dung,email'],
            'so_dien_thoai'          => ['nullable', 'string', 'max:20'],
            'dia_chi'                => ['nullable', 'string', 'max:255'],
            'mat_khau'               => ['required', 'min:8', 'confirmed'],
            // Postman gửi thêm field mat_khau_confirmation để pass 'confirmed'
        ];
    }

    // Thông báo lỗi tùy chỉnh cho các quy tắc xác thực
    public function messages(): array
    {
        return [
            'email.unique'        => 'Email này đã được đăng ký.',
            'mat_khau.min'        => 'Mật khẩu phải từ 8 ký tự.',
            'mat_khau.confirmed'  => 'Xác nhận mật khẩu không khớp.',
        ];
    }
}
