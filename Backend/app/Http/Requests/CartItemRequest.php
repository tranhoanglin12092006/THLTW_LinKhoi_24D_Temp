<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartItemRequest extends FormRequest
{
    /**
     * Cho phép request được thực hiện.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Kiểm tra dữ liệu chi tiết giỏ hàng.
     */
    public function rules(): array
    {
        return [
            // ID giỏ hàng phải tồn tại trong bảng gio_hang.
            'gio_hang_id' => 'required|exists:gio_hang,id',

            // ID sản phẩm phải tồn tại trong bảng san_pham.
            'san_pham_id' => 'required|exists:san_pham,id',

            // Số lượng phải là số nguyên và ít nhất là 1.
            'so_luong' => 'required|integer|min:1',
        ];
    }
}