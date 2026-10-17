<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductImageRequest extends FormRequest
{
    // Cho phep request duoc thuc hien
    public function authorize(): bool
    {
        return true;
    }

    // Kiem tra du lieu anh phu
    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1'],
            'images.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ];
    }

    // Thong bao loi bang tieng Viet
    public function messages(): array
    {
        return [
            'images.required' => 'Vui long chon it nhat mot anh.',
            'images.array' => 'Du lieu anh khong hop le.',
            'images.min' => 'Vui long chon it nhat mot anh.',
            'images.*.image' => 'Tep tai len phai la hinh anh.',
            'images.*.mimes' => 'Anh phai co dinh dang JPG, JPEG, PNG hoac WEBP.',
            'images.*.max' => 'Moi anh khong duoc vuot qua 2 MB.',
        ];
    }
}

