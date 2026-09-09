<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * Tên bảng dữ liệu tương ứng (tiếng Việt).
     */
    protected $table = 'don_hang';

    /**
     * Các trường được phép gán hàng loạt.
     */
    protected $fillable = [
        'nguoi_dung_id',
        'ma_don_hang',
        'ten_nguoi_nhan',
        'so_dien_thoai',
        'dia_chi',
        'phuong_thuc_thanh_toan',
        'khuyen_mai_id',
        'tong_tien',
        'trang_thai'
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(User::class, 'nguoi_dung_id');
    }

    public function khuyenMai()
    {
        return $this->belongsTo(Promotion::class, 'khuyen_mai_id');
    }

    public function chiTietDonHangs()
    {
        return $this->hasMany(OrderDetail::class, 'don_hang_id');
    }

}
