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
            'ten' => ['required', 'string', 'max:255'],
            'duong_dan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'duong_dan')->ignore($id),
            ],
            'trang_thai' => ['required', 'boolean'],
        ];
    }
}
