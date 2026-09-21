<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
                Rule::unique('danh_muc', 'ten')->ignore($id),
            ],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:danh_muc,id',
                Rule::notIn($id ? [$id] : []),
            ],
            'duong_dan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'duong_dan')->ignore($id),
            ],
            'trang_thai' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ten.required' => 'Tên danh mục là bắt buộc.',
            'ten.string' => 'Tên danh mục phải là chuỗi ký tự.',
            'ten.max' => 'Tên danh mục không được vượt quá 255 ký tự.',
            'ten.unique' => 'Tên danh mục đã tồn tại.',
            'parent_id.integer' => 'Danh mục cha không hợp lệ.',
            'parent_id.exists' => 'Danh mục cha không tồn tại.',
            'duong_dan.required' => 'Đường dẫn là bắt buộc.',
            'duong_dan.string' => 'Đường dẫn phải là chuỗi ký tự.',
            'duong_dan.max' => 'Đường dẫn không được vượt quá 255 ký tự.',
            'duong_dan.unique' => 'Đường dẫn đã tồn tại.',
            'trang_thai.required' => 'Trạng thái là bắt buộc.',
            'trang_thai.boolean' => 'Trạng thái không hợp lệ.',
        ];
    }
}
