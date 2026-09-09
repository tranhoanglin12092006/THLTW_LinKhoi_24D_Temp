<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'gio_hang';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'nguoi_dung_id',
        'session_id'
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(User::class, 'nguoi_dung_id');
    }

    public function chiTietGioHangs()
    {
        return $this->hasMany(CartItem::class, 'gio_hang_id');
    }

}
