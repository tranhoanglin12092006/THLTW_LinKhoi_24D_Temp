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
            'ten' => ['required', 'string', 'max:255'],
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
}