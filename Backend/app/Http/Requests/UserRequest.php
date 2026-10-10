<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    /**
     * Cho phép thực hiện request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các điều kiện kiểm tra dữ liệu người dùng.
     */
    public function rules(): array
    {
        // Lấy ID người dùng khi thực hiện chức năng sửa
        $userId = $this->route('id') ?? $this->route('user');

        return [
            'ho_ten' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('nguoi_dung', 'email')->ignore($userId),
            ],

            'so_dien_thoai' => [
                'nullable',
                'string',
                'max:255',
            ],

            'dia_chi' => [
                'nullable',
                'string',
                'max:255',
            ],

            'mat_khau' => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:6',
                'max:255',
            ],

            'vai_tro' => [
                'nullable',
                Rule::in(['member', 'admin', 'user']),
            ],

            'trang_thai' => [
                'nullable',
            ],
        ];
    }

    /**
     * Thông báo lỗi bằng tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'ho_ten.required' => 'Vui lòng nhập họ tên.',
            'ho_ten.string' => 'Họ tên phải là chuỗi ký tự.',
            'ho_ten.max' => 'Họ tên không được vượt quá 255 ký tự.',

            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Địa chỉ email này đã được sử dụng.',

            'so_dien_thoai.string' => 'Số điện thoại không hợp lệ.',
            'so_dien_thoai.max' => 'Số điện thoại không được vượt quá 255 ký tự.',

            'dia_chi.string' => 'Địa chỉ không hợp lệ.',
            'dia_chi.max' => 'Địa chỉ không được vượt quá 255 ký tự.',

            'mat_khau.required' => 'Vui lòng nhập mật khẩu.',
            'mat_khau.string' => 'Mật khẩu phải là chuỗi.',
            'mat_khau.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'mat_khau.max' => 'Mật khẩu không được vượt quá 255 ký tự.',

            'vai_tro.in' => 'Vai trò không hợp lệ (admin hoặc member/user).',
        ];
    }
}
