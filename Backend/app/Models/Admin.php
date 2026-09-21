<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    // Cho phép Admin tạo token đăng nhập
    use HasApiTokens;

    // Admin sử dụng bảng nguoi_dung trong database
    protected $table = 'nguoi_dung';

    // Các cột được phép thêm hoặc cập nhật
    protected $fillable = [
        'ho_ten',
        'email',
        'so_dien_thoai',
        'dia_chi',
        'mat_khau',
        'vai_tro',
        'trang_thai',
    ];

    // Không trả mật khẩu và remember_token về API
    protected $hidden = [
        'mat_khau',
        'remember_token',
    ];

    // Laravel lấy mật khẩu từ cột mat_khau
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }
}