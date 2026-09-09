<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'bai_viet';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'danh_muc_bai_viet_id',
        'tieu_de',
        'duong_dan',
        'noi_dung',
        'anh_dai_dien',
        'trang_thai',
        'ngay_dang'
    ];

    public function danhMucBaiViet()
    {
        return $this->belongsTo(PostCategory::class, 'danh_muc_bai_viet_id');
    }

}
