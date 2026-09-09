<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'trang_don';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'tieu_de',
        'duong_dan',
        'noi_dung',
        'trang_thai'
    ];


}
