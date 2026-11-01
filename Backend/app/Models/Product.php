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

    // Them cac thuoc tinh tinh toan tu dong vao JSON
    protected $appends = [
        'hinh_anh_url',
        'diem_danh_gia',
        'so_luong_danh_gia',
    ];

    // Lay URL anh chinh
    public function getHinhAnhUrlAttribute()
    {
        if (!$this->hinh_anh) {
            return asset('images/no-image.png');
        }

        $path = ltrim($this->hinh_anh, '/');
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, 8);
        }

        return asset('storage/' . $path);
    }

    // Tinh diem danh gia trung binh cua san pham (vi du: 4.8 / 5.0)
    public function getDiemDanhGiaAttribute()
    {
        $avg = $this->reviews()->where('trang_thai', true)->avg('so_sao');
        return $avg ? round((float)$avg, 1) : 5.0;
    }

    // Dem tong so luot danh gia cua san pham
    public function getSoLuongDanhGiaAttribute()
    {
        return $this->reviews()->where('trang_thai', true)->count();
    }

    // Quan he: 1 San pham co nhieu Danh gia (Reviews)
    public function reviews()
    {
        return $this->hasMany(Review::class, 'san_pham_id');
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
