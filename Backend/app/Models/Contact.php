<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'lien_he';

    /**
     * Định nghĩa các trạng thái liên hệ.
     */
    public const STATUS_PENDING = 'chua_xu_ly';
    public const STATUS_PROCESSING = 'dang_xu_ly';
    public const STATUS_RESOLVED = 'da_xu_ly';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ten',
        'email',
        'so_dien_thoai',
        'tieu_de',
        'noi_dung',
        'trang_thai',
        'noi_dung_phan_hoi',
        'ngay_phan_hoi'
    ];

    /**
     * Ép kiểu dữ liệu.
     */
    protected $casts = [
        'ngay_phan_hoi' => 'datetime',
    ];
}
