<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'danh_muc_bai_viet';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ten',
        'duong_dan',
        'trang_thai'
    ];

    public function baiViets()
    {
        return $this->hasMany(Post::class, 'danh_muc_bai_viet_id');
    }

}
