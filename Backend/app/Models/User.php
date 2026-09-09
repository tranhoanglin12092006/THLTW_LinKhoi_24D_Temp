<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'nguoi_dung';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ho_ten',
        'email',
        'so_dien_thoai',
        'dia_chi',
        'mat_khau',
        'vai_tro',
        'trang_thai'
    ];

    public function donHangs()
    {
        return $this->hasMany(Order::class, 'nguoi_dung_id');
    }

    public function gioHangs()
    {
        return $this->hasMany(Cart::class, 'nguoi_dung_id');
    }
}
