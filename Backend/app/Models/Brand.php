<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'thuong_hieu';

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
        return $this->hasMany(Product::class, 'thuong_hieu_id');
    }

    public function scopeActive(Builder $query)
    {
        return $query->where('trang_thai', true);
    }
}
