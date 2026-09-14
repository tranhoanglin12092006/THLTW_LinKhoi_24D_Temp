<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Tên bảng trong database
    protected $table = 'san_pham';

    // Các cột được phép thêm hoặc cập nhật
    protected $fillable = [
        'danh_muc_id',
        'thuong_hieu_id',
        'ten',
        'duong_dan',
        'gia',
        'gia_khuyen_mai',
        'so_luong_ton',
        'mo_ta',
        'hinh_anh',
        'trang_thai',
    ];

    // Kiểu dữ liệu của các cột
    protected $casts = [
        'gia' => 'decimal:2',
        'gia_khuyen_mai' => 'decimal:2',
        'so_luong_ton' => 'integer',
        'trang_thai' => 'boolean',
    ];

    // Thêm URL hình ảnh vào dữ liệu trả về
    protected $appends = [
        'hinh_anh_url',
    ];

    // Lấy URL hình ảnh
    public function getHinhAnhUrlAttribute()
    {
        if (!$this->hinh_anh) {
            return asset('images/no-image.png');
        }

        return asset('storage/' . $this->hinh_anh);
    }

    // Quan hệ với danh mục
    public function danhMuc()
    {
        return $this->belongsTo(Category::class, 'danh_muc_id');
    }

    // Quan hệ với thương hiệu
    public function thuongHieu()
    {
        return $this->belongsTo(Brand::class, 'thuong_hieu_id');
    }

    // Quan hệ với chi tiết đơn hàng
    public function chiTietDonHangs()
    {
        return $this->hasMany(OrderDetail::class, 'san_pham_id');
    }

    // Quan hệ với chi tiết giỏ hàng
    public function chiTietGioHangs()
    {
        return $this->hasMany(CartItem::class, 'san_pham_id');
    }
}