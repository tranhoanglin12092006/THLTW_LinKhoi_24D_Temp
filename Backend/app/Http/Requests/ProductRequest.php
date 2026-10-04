<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Cho phép thực hiện request.
     */
    public function authorize(): bool
    {
        // Cho phép tất cả request đi qua ProductRequest.
        return true;
    }

    /**
     * Các điều kiện kiểm tra dữ liệu sản phẩm.
     */
    public function rules(): array
    {
        // Lấy ID sản phẩm từ URL khi thực hiện chức năng sửa.
        // Ví dụ: PUT /api/products/5 thì $productId = 5.
        $productId = $this->route('id');

        return [
            // Kiểm tra danh mục có bắt buộc và phải tồn tại trong bảng danh_muc hay không.
            'danh_muc_id' => 'required|exists:danh_muc,id',

            // Kiểm tra thương hiệu có bắt buộc và phải tồn tại trong bảng thuong_hieu hay không.
            'thuong_hieu_id' => 'required|exists:thuong_hieu,id',

            // Tên sản phẩm bắt buộc nhập và tối đa 255 ký tự.
            'ten' => 'required|string|max:255',

            // Đường dẫn bắt buộc nhập, tối đa 255 ký tự
            // và không được trùng với sản phẩm khác.
            'duong_dan' => [
                'required',
                'string',
                'max:255',
                Rule::unique('san_pham', 'duong_dan')->ignore($productId),
            ],

            // Giá sản phẩm bắt buộc nhập, phải là số và không được nhỏ hơn 0.
            'gia' => 'required|numeric|min:0',

            // Giá khuyến mãi không bắt buộc.
            // Nếu nhập thì phải là số và không được nhỏ hơn 0.
            'gia_khuyen_mai' => 'nullable|numeric|min:0',

            // Số lượng tồn bắt buộc là số nguyên và không được nhỏ hơn 0.
            'so_luong_ton' => 'required|integer|min:0',

            // Mô tả không bắt buộc, nếu nhập phải là chuỗi.
            'mo_ta' => 'nullable|string',

            // Ảnh: không bắt buộc, nhưng nếu có thì phải là ảnh
            // jpg/jpeg/png/webp và tối đa 2MB (2048 KB)
            'hinh_anh' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            // Trạng thái bắt buộc và phải có giá trị boolean.
            'trang_thai' => 'required|boolean',
        ];
    }

    /**
     * Các thông báo lỗi bằng tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'danh_muc_id.required' => 'Vui lòng chọn danh mục.',
            'danh_muc_id.exists' => 'Danh mục không tồn tại.',

            'thuong_hieu_id.required' => 'Vui lòng chọn thương hiệu.',
            'thuong_hieu_id.exists' => 'Thương hiệu không tồn tại.',

            'ten.required' => 'Vui lòng nhập tên sản phẩm.',
            'ten.string' => 'Tên sản phẩm phải là chuỗi.',
            'ten.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',

            'duong_dan.required' => 'Vui lòng nhập đường dẫn sản phẩm.',
            'duong_dan.string' => 'Đường dẫn sản phẩm phải là chuỗi.',
            'duong_dan.max' => 'Đường dẫn không được vượt quá 255 ký tự.',
            'duong_dan.unique' => 'Đường dẫn sản phẩm đã tồn tại.',

            'gia.required' => 'Vui lòng nhập giá sản phẩm.',
            'gia.numeric' => 'Giá sản phẩm phải là số.',
            'gia.min' => 'Giá sản phẩm không được nhỏ hơn 0.',

            'gia_khuyen_mai.numeric' => 'Giá khuyến mãi phải là số.',
            'gia_khuyen_mai.min' => 'Giá khuyến mãi không được nhỏ hơn 0.',

            'so_luong_ton.required' => 'Vui lòng nhập số lượng tồn.',
            'so_luong_ton.integer' => 'Số lượng tồn phải là số nguyên.',
            'so_luong_ton.min' => 'Số lượng tồn không được nhỏ hơn 0.',

            'mo_ta.string' => 'Mô tả phải là chuỗi.',

            'hinh_anh.image' => 'File phải là hình ảnh.',
            'hinh_anh.mimes' => 'Ảnh chỉ chấp nhận JPG, JPEG, PNG, WEBP.',
            'hinh_anh.max'   => 'Hình ảnh không được vượt quá 2MB.',


            'trang_thai.required' => 'Vui lòng nhập trạng thái.',
            'trang_thai.boolean' => 'Trạng thái không hợp lệ.',
        ];
    }
}
