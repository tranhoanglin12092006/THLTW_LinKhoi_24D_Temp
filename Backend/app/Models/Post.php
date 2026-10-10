<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

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

    protected $casts = [
        'trang_thai' => 'boolean',
        'ngay_dang' => 'datetime',
        'danh_muc_bai_viet_id' => 'integer',
    ];

    protected $appends = [
        'anh_dai_dien_url',
    ];

    public function getAnhDaiDienUrlAttribute()
    {
        if ($this->anh_dai_dien && (str_starts_with($this->anh_dai_dien, 'http://') || str_starts_with($this->anh_dai_dien, 'https://'))) {
            return $this->anh_dai_dien;
        }

        if ($this->anh_dai_dien && (file_exists(public_path('storage/' . $this->anh_dai_dien)) || file_exists(storage_path('app/public/' . $this->anh_dai_dien)))) {
            return asset('storage/' . $this->anh_dai_dien);
        }

        // Bản đồ ảnh công nghệ độ phân giải cao theo chủ đề slug bài viết
        $curatedImages = [
            'ban-do-cong-nghe' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            'tri-tue-nhan-tao' => 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
            'ung-dung-ai' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
            'dien-thoai' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
            'may-tinh' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
            'linh-kien' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
            'laptop' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
            'dam-may' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
            'iot' => 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
            '5g' => 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80',
            'vr' => 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
            'ar' => 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80',
            'blockchain' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
            'bao-mat' => 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
            'robot' => 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
            'xu-huong' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        ];

        $slug = $this->duong_dan ?? '';
        foreach ($curatedImages as $keyword => $imageUrl) {
            if (str_contains($slug, $keyword)) {
                return $imageUrl;
            }
        }

        // Ảnh công nghệ hiện đại mặc định nếu chưa có
        $defaultTechImages = [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
        ];

        return $defaultTechImages[$this->id % count($defaultTechImages)];
    }

    public function danhMucBaiViet()
    {
        return $this->belongsTo(PostCategory::class, 'danh_muc_bai_viet_id');
    }
}
