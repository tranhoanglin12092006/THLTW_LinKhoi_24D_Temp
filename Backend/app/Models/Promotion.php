<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'khuyen_mai';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ma_khuyen_mai',
        'loai_giam_gia',
        'gia_tri_giam',
        'gia_tri_don_toi_thieu',
        'ngay_bat_dau',
        'ngay_ket_thuc',
        'gioi_han_su_dung',
        'trang_thai'
    ];

    public function donHangs()
    {
        return $this->hasMany(Order::class, 'khuyen_mai_id');
    }

}
