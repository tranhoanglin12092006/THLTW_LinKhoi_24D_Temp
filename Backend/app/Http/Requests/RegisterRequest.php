<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ho_ten' => ['required', 'max:150'],
            'email'     => [
                'required',
                'email',
                'unique:members,email'
            ],
            'mat_khau'  => ['required', 'min:8', 'confirmed'],
        ];
    }
}
