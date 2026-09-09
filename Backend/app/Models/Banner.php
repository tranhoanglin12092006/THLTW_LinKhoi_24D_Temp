<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'banner';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'tieu_de',
        'hinh_anh',
        'duong_dan_lien_ket',
        'thu_tu',
        'trang_thai'
    ];


}
