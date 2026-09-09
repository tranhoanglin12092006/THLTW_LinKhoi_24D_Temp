<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockImport extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'phieu_nhap_kho';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'ten_nha_cung_cap',
        'ghi_chu',
        'nguoi_tao'
    ];

    public function nguoiTaoPhieu()
    {
        return $this->belongsTo(User::class, 'nguoi_tao');
    }

    public function chiTietPhieuNhapKhos()
    {
        return $this->hasMany(StockImportDetail::class, 'phieu_nhap_kho_id');
    }

}
