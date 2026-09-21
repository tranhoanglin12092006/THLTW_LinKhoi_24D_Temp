<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Member extends Authenticatable
{
    use HasApiTokens; //cấp createtoken

    protected $fillable = [
        'ho_ten',
        'email',
        'mat_khau',
        'so_dien_thoai',
    ];

    protected $hidden = [ // ẩn các trường khi trả về JSON
        'mat_khau',
        'reset_token',
    ];

    protected $casts = [ //định nghĩa các kiểu dữ liệu cho các trường trong cơ sở dữ liệu
        'trang_thai' => 'boolean',
    ];
}