<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'cau_hinh';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'khoa',
        'gia_tri'
    ];


}
