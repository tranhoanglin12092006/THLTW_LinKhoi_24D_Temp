<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartRequest extends FormRequest
{
    /**
     * Cho phép request được thực hiện.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Kiểm tra dữ liệu giỏ hàng.
     */
    public function rules(): array
    {
        return [
            // ID người dùng có thể để trống,
            // nếu có thì phải tồn tại trong bảng users.
            'nguoi_dung_id' => 'nullable|exists:nguoi_dung,id',

            // Session ID có thể để trống và tối đa 255 ký tự.
            'session_id' => 'nullable|string|max:255',
        ];
    }
}