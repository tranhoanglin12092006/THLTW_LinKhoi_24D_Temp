<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    /**
     * Cho phép thực hiện request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các điều kiện kiểm tra dữ liệu bài viết.
     */
    public function rules(): array
    {
        $postId = $this->route('id') ?? $this->route('post');

        return [
            'tieu_de' => [
                'required',
                'string',
                'max:255',
            ],
            'duong_dan' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('bai_viet', 'duong_dan')->ignore($postId),
            ],
            'danh_muc_bai_viet_id' => [
                'required',
                'exists:danh_muc_bai_viet,id',
            ],
            'noi_dung' => [
                'nullable',
                'string',
            ],
            'anh_dai_dien' => [
                'nullable',
            ],
            'trang_thai' => [
                'nullable',
            ],
            'ngay_dang' => [
                'nullable',
            ],
        ];
    }

    /**
     * Thông báo lỗi tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'tieu_de.required' => 'Vui lòng nhập tiêu đề bài viết.',
            'tieu_de.string' => 'Tiêu đề bài viết phải là chuỗi ký tự.',
            'tieu_de.max' => 'Tiêu đề không được vượt quá 255 ký tự.',
            'duong_dan.unique' => 'Đường dẫn (slug) này đã tồn tại, vui lòng chọn đường dẫn khác.',
            'duong_dan.max' => 'Đường dẫn không được vượt quá 255 ký tự.',
            'danh_muc_bai_viet_id.required' => 'Vui lòng chọn danh mục bài viết.',
            'danh_muc_bai_viet_id.exists' => 'Danh mục bài viết không tồn tại.',
        ];
    }
}
