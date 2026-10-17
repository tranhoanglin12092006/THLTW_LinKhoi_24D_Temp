<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;



class Product extends Model
{
    use HasFactory, SoftDeletes;

    // Ten bang san pham
    protected $table = 'san_pham';

    // Cac cot duoc phep them hoac cap nhat
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

    // Kieu du lieu cua cac cot
    protected $casts = [
        'gia' => 'decimal:2',
        'gia_khuyen_mai' => 'decimal:2',
        'so_luong_ton' => 'integer',
        'trang_thai' => 'boolean',
    ];

    // Them URL anh chinh vao du lieu tra ve
    protected $appends = [
        'hinh_anh_url',
    ];

    // Lay URL anh chinh
    public function getHinhAnhUrlAttribute()
    {
        if (!$this->hinh_anh) {
            return asset('images/no-image.png');
        }

        return asset('storage/' . $this->hinh_anh);
    }

    // Quan he voi danh muc
    public function danhMuc()
    {
        return $this->belongsTo(Category::class, 'danh_muc_id');
    }

    // Quan he voi thuong hieu
    public function thuongHieu()
    {
        return $this->belongsTo(Brand::class, 'thuong_hieu_id');
    }

    // Quan he voi chi tiet don hang
    public function chiTietDonHangs()
    {
        return $this->hasMany(OrderDetail::class, 'san_pham_id');
    }

    // Quan he voi chi tiet gio hang
    public function chiTietGioHangs()
    {
        return $this->hasMany(CartItem::class, 'san_pham_id');
    }

    // Quan he voi nhieu anh phu cua san pham
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }
}

