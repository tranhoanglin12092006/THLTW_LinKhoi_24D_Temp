<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockExport extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'phieu_xuat_kho';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ly_do',
        'ghi_chu',
        'nguoi_tao'
    ];

    public function nguoiTaoPhieu()
    {
        return $this->belongsTo(User::class, 'nguoi_tao');
    }

    public function chiTietPhieuXuatKhos()
    {
        return $this->hasMany(StockExportDetail::class, 'phieu_xuat_kho_id');
    }

}
