<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderDetailRequest extends FormRequest
{
    // Cho phép request được thực hiện
    public function authorize(): bool
    {
        return true;
    }

    // Kiểm tra dữ liệu chi tiết đơn hàng
    public function rules(): array
    {
        return [
            // Đơn hàng phải tồn tại
            'don_hang_id' => 'required|exists:don_hang,id',

            // Sản phẩm phải tồn tại
            'san_pham_id' => 'required|exists:san_pham,id',

            // Số lượng phải lớn hơn 0
            'so_luong' => 'required|integer|min:1',

            // Giá sản phẩm
            'gia' => 'required|numeric|min:0',
        ];
    }
}