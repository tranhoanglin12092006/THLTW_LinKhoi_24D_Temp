<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    // Cho phép request được thực hiện
    public function authorize(): bool
    {
        return true;
    }

    // Kiểm tra dữ liệu đơn hàng
    public function rules(): array
    {
        return [
            // ID người dùng, có thể để trống
            'nguoi_dung_id' => 'nullable|exists:nguoi_dung,id',

            // Tên người nhận
            'ten_nguoi_nhan' => 'required|string|max:255',

            // Số điện thoại
            'so_dien_thoai' => 'required|string|max:20',

            // Địa chỉ giao hàng
            'dia_chi' => 'required|string|max:255',

            // Phương thức thanh toán
            'phuong_thuc_thanh_toan' => 'required|string|max:100',

            // Mã khuyến mãi, có thể để trống
            'khuyen_mai_id' => 'nullable|exists:khuyen_mai,id',

            // Tổng tiền
            'tong_tien' => 'required|numeric|min:0',

            // Trạng thái đơn hàng
            'trang_thai' => 'required|string|max:50',
        ];
    }
}