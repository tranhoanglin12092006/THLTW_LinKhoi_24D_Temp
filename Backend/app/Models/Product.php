<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'san_pham';

    /**
     * Các trường được phép gán hàng loạt.
     */
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
        'trang_thai'
    ];

    public function danhMuc()
    {
        return $this->belongsTo(Category::class, 'danh_muc_id');
    }

    public function thuongHieu()
    {
        return $this->belongsTo(Brand::class, 'thuong_hieu_id');
    }

    public function chiTietDonHangs()
    {
        return $this->hasMany(OrderDetail::class, 'san_pham_id');
    }

    public function chiTietGioHangs()
    {
        return $this->hasMany(CartItem::class, 'san_pham_id');
    }

}
