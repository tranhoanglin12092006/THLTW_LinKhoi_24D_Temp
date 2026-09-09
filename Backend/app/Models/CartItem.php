<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'chi_tiet_gio_hang';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'gio_hang_id',
        'san_pham_id',
        'so_luong'
    ];

    public function gioHang()
    {
        return $this->belongsTo(Cart::class, 'gio_hang_id');
    }

    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }

}
