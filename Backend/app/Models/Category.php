<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'danh_muc';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ten',
        'duong_dan',
        'trang_thai'
    ];

    public function sanPhams()
    {
        return $this->hasMany(Product::class, 'danh_muc_id');
    }

}
