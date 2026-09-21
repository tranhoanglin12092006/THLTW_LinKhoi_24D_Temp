<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * Tên bảng giỏ hàng trong database.
     */
    protected $table = 'gio_hang';

    /**
     * Các trường được phép thêm dữ liệu vào database.
     */
    protected $fillable = [
        'nguoi_dung_id',
        'session_id'
    ];

    /**
     * Một giỏ hàng thuộc về một người dùng.
     *
     * nguoi_dung_id trong bảng gio_hang
     * liên kết với id trong bảng users.
     */
    public function nguoiDung()
    {
        return $this->belongsTo(User::class, 'nguoi_dung_id');
    }

    /**
     * Một giỏ hàng có nhiều chi tiết giỏ hàng.
     *
     * Ví dụ:
     * Giỏ hàng ID 1 có sản phẩm A, B, C
     * thì bảng chi_tiet_gio_hang sẽ có nhiều dòng
     * cùng gio_hang_id = 1.
     */
    public function chiTietGioHangs()
    {
        return $this->hasMany(CartItem::class, 'gio_hang_id');
    }
}