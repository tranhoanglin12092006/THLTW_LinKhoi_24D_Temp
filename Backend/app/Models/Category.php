<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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
        'parent_id',
        'duong_dan',
        'trang_thai'
    ];

    public function sanPhams()
    {
        return $this->hasMany(Product::class, 'danh_muc_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Scope: loc status = 1
    public function scopeActive(Builder $query) 
    {
        return $query->where('trang_thai', true);
    }
}
