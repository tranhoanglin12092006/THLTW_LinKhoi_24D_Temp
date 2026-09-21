<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Tên bảng trong database
    protected $table = 'nguoi_dung';

    // Khóa chính
    protected $primaryKey = 'id';

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

    // Ẩn mật khẩu khi trả dữ liệu về API
    protected $hidden = [
        'mat_khau',
        'remember_token',
    ];

    // Kiểu dữ liệu của các cột
    protected $casts = [
        'trang_thai' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Tên cột mật khẩu của User.
     *
     * Laravel mặc định tìm cột "password".
     * Database của chúng ta sử dụng "mat_khau".
     */
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }

    public function isAdmin(): bool
    {
        return $this->vai_tro === 'admin';
    }

    /**
     * Quan hệ với đơn hàng.
     *
     * Một người dùng có thể có nhiều đơn hàng.
     */
    public function donHangs()
    {
        return $this->hasMany(Order::class, 'nguoi_dung_id');
    }

    /**
     * Quan hệ với giỏ hàng.
     *
     * Một người dùng có thể có nhiều giỏ hàng.
     */
    public function gioHangs()
    {
        return $this->hasMany(Cart::class, 'nguoi_dung_id');
    }
}
