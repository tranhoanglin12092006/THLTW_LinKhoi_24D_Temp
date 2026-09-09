<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'chi_tiet_don_hang';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'don_hang_id',
        'san_pham_id',
        'so_luong',
        'gia'
    ];

    public function donHang()
    {
        return $this->belongsTo(Order::class, 'don_hang_id');
    }

    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }

}
