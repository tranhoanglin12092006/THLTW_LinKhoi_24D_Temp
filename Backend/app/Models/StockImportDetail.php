<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockImportDetail extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'chi_tiet_phieu_nhap_kho';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'phieu_nhap_kho_id',
        'san_pham_id',
        'so_luong',
        'gia'
    ];

    public function phieuNhapKho()
    {
        return $this->belongsTo(StockImport::class, 'phieu_nhap_kho_id');
    }

    public function sanPham()
    {
        return $this->belongsTo(Product::class, 'san_pham_id');
    }

}
