<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockExportDetail extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'chi_tiet_phieu_xuat_kho';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'phieu_xuat_kho_id',
        'san_pham_id',
        'so_luong'
    ];

    public function phieuXuatKho()
    {
        return $this->belongsTo(StockExport::class, 'phieu_xuat_kho_id');
    }

    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }

}
