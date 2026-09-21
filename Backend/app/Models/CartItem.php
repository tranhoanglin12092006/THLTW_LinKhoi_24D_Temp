<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * Tên bảng chi tiết giỏ hàng trong database.
     */
    protected $table = 'chi_tiet_gio_hang';

    /**
     * Các trường được phép thêm dữ liệu vào database.
     */
    protected $fillable = [
        'gio_hang_id',
        'san_pham_id',
        'so_luong'
    ];

    /**
     * Chi tiết giỏ hàng thuộc về một giỏ hàng.
     *
     * gio_hang_id trong bảng chi_tiet_gio_hang
     * liên kết với id trong bảng gio_hang.
     */
    public function gioHang()
    {
        return $this->belongsTo(Cart::class, 'gio_hang_id');
    }

    /**
     * Chi tiết giỏ hàng thuộc về một sản phẩm.
     *
     * san_pham_id trong bảng chi_tiet_gio_hang
     * liên kết với id trong bảng san_pham.
     */
    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }
}