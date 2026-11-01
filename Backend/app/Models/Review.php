<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    // Tên bảng dữ liệu tương ứng trong MySQL
    protected $table = 'danh_gia';

    // Các cột cho phép thêm và sửa dữ liệu
    protected $fillable = [
        'san_pham_id',
        'ho_ten',
        'so_sao',
        'noi_dung',
        'trang_thai',
    ];

    // Kiểu dữ liệu tương ứng
    protected $casts = [
        'so_sao' => 'integer',
        'trang_thai' => 'boolean',
    ];

    // Quan hệ: Một đánh giá thuộc về một sản phẩm
    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }
}
