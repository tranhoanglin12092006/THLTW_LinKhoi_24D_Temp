<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\Page;
use Illuminate\Database\Seeder;

class SettingAndPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultSettings = [
            'site_name' => 'TECHNOVA - Siêu Thị Thiết Bị Điện Tử',
            'site_logo' => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&q=80',
            'hotline' => '1800 6868',
            'email_contact' => 'cskh@technova.vn',
            'address' => 'Tầng 5, Tòa nhà Bitexco, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            'facebook' => 'https://facebook.com/technovavn',
            'youtube' => 'https://youtube.com/@technova',
            'tiktok' => 'https://tiktok.com/@technova',
            'meta_description' => 'TECHNOVA - Hệ thống bán lẻ thiết bị điện tử, smartphone, laptop, phụ kiện chính hãng giá tốt nhất.',
            'meta_keywords' => 'technova, dien thoai, laptop, tai nghe, phu kien, cong nghe',
            'copyright' => '© 2026 TECHNOVA. Tất cả các quyền được bảo lưu.',
            'maintenance_mode' => '0'
        ];

        foreach ($defaultSettings as $key => $val) {
            Setting::updateOrCreate(
                ['khoa' => $key],
                ['gia_tri' => $val]
            );
        }

        $samplePages = [
            [
                'tieu_de' => 'Giới thiệu về TECHNOVA',
                'duong_dan' => 'gioi-thieu',
                'noi_dung' => '<h2>Chào mừng bạn đến với TECHNOVA</h2><p>TECHNOVA tự hào là hệ thống bán lẻ công nghệ tiên phong hàng đầu tại Việt Nam, mang đến hệ sinh thái sản phẩm điện tử chính hãng từ Apple, Samsung, Sony, Asus và hàng chục thương hiệu quốc tế uy tín khác.</p><h3>Tầm nhìn & Sứ mệnh</h3><p>Đem lại trải nghiệm mua sắm công nghệ an tâm tuyệt đối với chế độ hậu mãi vượt trội, chính sách 1 đổi 1 và dịch vụ giao hàng hỏa tốc trong 2 giờ.</p>',
                'trang_thai' => 1
            ],
            [
                'tieu_de' => 'Chính sách bảo hành và đổi trả',
                'duong_dan' => 'chinh-sach-bao-hanh',
                'noi_dung' => '<h2>Chính sách bảo hành Kim Cương tại TECHNOVA</h2><p>1. Tất cả sản phẩm chính hãng đều được bảo hành tiêu chuẩn từ 12 đến 24 tháng theo đúng quy định của nhà sản xuất.</p><p>2. Đổi mới 1 đổi 1 trong vòng 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng do nhà sản xuất.</p><p>3. Hỗ trợ mượn máy tương đương dùng tạm trong thời gian tiếp nhận thẩm định bảo hành.</p>',
                'trang_thai' => 1
            ],
            [
                'tieu_de' => 'Chính sách bảo mật thông tin',
                'duong_dan' => 'chinh-sach-bao-mat',
                'noi_dung' => '<h2>Chính sách bảo mật thông tin khách hàng</h2><p>TECHNOVA cam kết bảo mật 100% dữ liệu cá nhân của quý khách theo các tiêu chuẩn an toàn an ninh mạng SSL 256-bit cao nhất.</p><p>Mọi thông tin như họ tên, số điện thoại, địa chỉ và lịch sử đơn hàng chỉ phục vụ công tác giao hàng và chăm sóc hậu mãi.</p>',
                'trang_thai' => 1
            ],
            [
                'tieu_de' => 'Hướng dẫn mua hàng & thanh toán',
                'duong_dan' => 'huong-dan-thanh-toan',
                'noi_dung' => '<h2>Các phương thức thanh toán linh hoạt tại TECHNOVA</h2><ul><li>Thanh toán khi nhận hàng (COD) tận nơi trên toàn quốc.</li><li>Chuyển khoản ngân hàng qua mã QR VietQR tự động xác nhận đơn trong 30 giây.</li><li>Trả góp 0% lãi suất qua thẻ tín dụng hoặc các công ty tài chính đối tác uy tín.</li></ul>',
                'trang_thai' => 1
            ]
        ];

        foreach ($samplePages as $p) {
            Page::updateOrCreate(
                ['duong_dan' => $p['duong_dan']],
                $p
            );
        }
    }
}
