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
    // Kiem tra du lieu don hang
public function rules(): array
{
    // Khach dat hang: chi gui thong tin nhan hang
    if ($this->isMethod('post')) {
        return [
            'ten_nguoi_nhan' => 'required|string|max:255',
            'so_dien_thoai' => 'required|string|max:20',
            'dia_chi' => 'required|string|max:255',
            'phuong_thuc_thanh_toan' => 'required|string|max:100',
            'khuyen_mai_id' => 'nullable|exists:khuyen_mai,id',
            'session_id' => 'nullable|string|min:32|max:100',
        ];
    }

    // Giu quy tac cu cho cac thao tac cap nhat don hang
    return [
        'nguoi_dung_id' => 'nullable|exists:nguoi_dung,id',
        'ten_nguoi_nhan' => 'required|string|max:255',
        'so_dien_thoai' => 'required|string|max:20',
        'dia_chi' => 'required|string|max:255',
        'phuong_thuc_thanh_toan' => 'required|string|max:100',
        'khuyen_mai_id' => 'nullable|exists:khuyen_mai,id',
        'tong_tien' => 'required|numeric|min:0',
        'trang_thai' => 'required|integer|in:0,1,2,3,4',
    ];
}
}