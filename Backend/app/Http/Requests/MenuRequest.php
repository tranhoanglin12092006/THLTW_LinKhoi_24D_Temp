<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MenuRequest extends FormRequest
{
    // Cho phep request duoc thuc hien
    public function authorize(): bool
    {
        return true;
    }

    // Kiem tra du lieu menu
    public function rules(): array
    {
        // Lay ID menu khi cap nhat
        $menuId = $this->route('id');

        return [
            // Ten menu bat buoc nhap
            'ten' => 'required|string|max:255',

            // URL bat buoc nhap va khong trung menu khac
            'url' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menu', 'url')->ignore($menuId),
            ],

            // Thu tu hien thi phai la so nguyen khong am
            'thu_tu' => 'required|integer|min:0',

            // Trang thai bat buoc, nhan gia tri 0 hoac 1
            'trang_thai' => 'required|boolean',
        ];
    }

    // Thong bao loi bang tieng Viet
    public function messages(): array
    {
        return [
            'ten.required' => 'Vui long nhap ten menu.',
            'ten.string' => 'Ten menu phai la chuoi.',
            'ten.max' => 'Ten menu khong duoc vuot qua 255 ky tu.',

            'url.required' => 'Vui long nhap URL menu.',
            'url.string' => 'URL menu phai la chuoi.',
            'url.max' => 'URL menu khong duoc vuot qua 255 ky tu.',
            'url.unique' => 'URL menu da ton tai.',

            'thu_tu.required' => 'Vui long nhap thu tu menu.',
            'thu_tu.integer' => 'Thu tu menu phai la so nguyen.',
            'thu_tu.min' => 'Thu tu menu khong duoc nho hon 0.',

            'trang_thai.required' => 'Vui long chon trang thai menu.',
            'trang_thai.boolean' => 'Trang thai menu khong hop le.',
        ];
    }
}
