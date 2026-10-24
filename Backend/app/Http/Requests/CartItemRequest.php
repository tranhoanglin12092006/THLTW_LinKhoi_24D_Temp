<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartItemRequest extends FormRequest
{
    // Cho phep request duoc thuc hien
    public function authorize(): bool
    {
        return true;
    }

    // Kiem tra du lieu gui len
    public function rules(): array
    {
        // Lay phuong thuc HTTP cua request
        $method = $this->method();

        // Them san pham moi vao gio hang
        if ($method === 'POST') {
            return [
                'gio_hang_id' => 'required|integer|exists:gio_hang,id',
                'san_pham_id' => 'required|integer|exists:san_pham,id',
                'so_luong' => 'required|integer|min:1',
            ];
        }

        // Cap nhat so luong san pham
        if ($method === 'PUT' || $method === 'PATCH') {
            return [
                'so_luong' => 'required|integer|min:1',
            ];
        }

        return [];
    }

    // Thong bao loi bang tieng Viet
    public function messages(): array
    {
        return [
            'gio_hang_id.required' => 'Vui long chon gio hang.',
            'gio_hang_id.exists' => 'Gio hang khong ton tai.',

            'san_pham_id.required' => 'Vui long chon san pham.',
            'san_pham_id.exists' => 'San pham khong ton tai.',

            'so_luong.required' => 'Vui long nhap so luong.',
            'so_luong.integer' => 'So luong phai la so nguyen.',
            'so_luong.min' => 'So luong phai lon hon 0.',
        ];
    }
}

