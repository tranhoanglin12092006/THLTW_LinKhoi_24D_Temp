<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'ten' => [
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'ten')->ignore($id),
            ],
            'duong_dan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'duong_dan')->ignore($id),
            ],
            'trang_thai' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ten.required' => 'Tên thương hiệu là bắt buộc.',
            'ten.string' => 'Tên thương hiệu phải là chuỗi ký tự.',
            'ten.max' => 'Tên thương hiệu không được vượt quá 255 ký tự.',
            'ten.unique' => 'Tên thương hiệu đã tồn tại.',
            'duong_dan.required' => 'Đường dẫn là bắt buộc.',
            'duong_dan.string' => 'Đường dẫn phải là chuỗi ký tự.',
            'duong_dan.max' => 'Đường dẫn không được vượt quá 255 ký tự.',
            'duong_dan.unique' => 'Đường dẫn đã tồn tại.',
            'trang_thai.required' => 'Trạng thái là bắt buộc.',
            'trang_thai.boolean' => 'Trạng thái không hợp lệ.',
        ];
    }
}
