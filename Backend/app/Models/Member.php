<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Member extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'ho_ten',
        'email',
        'mau_khau',
        'so_dien_thoai',
    ];

    protected $hidden = [
        'mau_khau',
        'reset_token',
    ];

    protected $casts = [
        'trang_thai' => 'boolean',
    ];
}
