<?php

namespace App\Services;

// ====================================================================================
// BƯỚC 1: NẠP THƯ VIỆN PHPMAILER
// Nếu hệ thống chưa tự động nạp qua Composer, đoạn code này sẽ nạp trực tiếp 3 file cốt lõi
// của PHPMailer: Exception (xử lý lỗi), PHPMailer (gửi mail), SMTP (giao thức mạng).
// ====================================================================================
if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
    require_once base_path('vendor/phpmailer/phpmailer/src/Exception.php');
    require_once base_path('vendor/phpmailer/phpmailer/src/PHPMailer.php');
    require_once base_path('vendor/phpmailer/phpmailer/src/SMTP.php');
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;

/**
 * ====================================================================================
 * LỚP PHPMailerService: Dịch vụ hỗ trợ gửi email tự động bằng PHPMailer
 * ====================================================================================
 * - Sử dụng giao thức SMTP chuẩn của Gmail để gửi thư.
 * - Code viết dạng hàm tĩnh (static) để ở bất kỳ đâu cũng có thể gọi nhanh:
 *   PHPMailerService::sendOrderConfirmation($order, $email);
 * ====================================================================================
 */
class PHPMailerService
{
    /**
     * Hàm cấu hình và tạo đối tượng PHPMailer kết nối với Gmail
     * 
     * @return PHPMailer Đối tượng đã được nạp sẵn thông tin cấu hình máy chủ gửi thư
     */
    public static function createMailer(): PHPMailer
    {
        // Khởi tạo đối tượng PHPMailer, truyền vào "true" để bật chế độ ném ngoại lệ khi có lỗi
        $mail = new PHPMailer(true);

        // --- CẤU HÌNH MÁY CHỦ SMTP GMAIL ---
        $mail->isSMTP();                                           // Báo cho PHPMailer biết là gửi qua máy chủ SMTP
        $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');    // Địa chỉ máy chủ gửi mail của Google
        $mail->SMTPAuth   = true;                                  // Bật chế độ xác thực tài khoản và mật khẩu
        
        // Tài khoản Gmail dùng để gửi đi (người gửi)
        $mail->Username   = env('MAIL_USERNAME', 'nguoiyahoo@gmail.com');
        
        // Mật khẩu ứng dụng (App Password) gồm 16 ký tự do Google cấp (không phải mật khẩu đăng nhập Gmail thường)
        $mail->Password   = env('MAIL_PASSWORD', 'lnti gcyo czxw simx');
        
        // Phương thức mã hóa đường truyền an toàn (TLS) và cổng kết nối chuẩn (587)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = (int) env('MAIL_PORT', 587);
        
        // Định dạng mã hóa font chữ tiếng Việt có dấu chuẩn UTF-8 (tránh bị lỗi font chữ)
        $mail->CharSet    = 'UTF-8';

        // --- THÔNG TIN NGƯỜI GỬI (FROM) ---
        // Email gửi đi và tên hiển thị thương hiệu của shop
        $mail->setFrom(
            env('MAIL_FROM_ADDRESS', 'nguoiyahoo@gmail.com'),
            env('MAIL_FROM_NAME', 'TECHNOVA Store')
        );

        return $mail;
    }

    /**
     * Hàm tự động gửi email thông báo xác nhận đơn hàng cho khách
     * 
     * @param \App\Models\Order $order Đối tượng đơn hàng vừa tạo xong trong cơ sở dữ liệu
     * @param string|null $recipientEmail Địa chỉ email của khách nhận thông báo
     * @return bool Trả về true nếu gửi email thành công, false nếu thất bại
     */
    public static function sendOrderConfirmation($order, ?string $recipientEmail = null): bool
    {
        // 1. Xác định địa chỉ email của người nhận:
        // Ưu tiên email khách nhập lúc thanh toán -> nếu không có thì lấy email tài khoản đã đăng nhập
        $email = $recipientEmail ?? $order->nguoiDung?->email;

        // Nếu cả 2 đều trống thì ghi log cảnh báo và dừng lại, không cố gửi
        if (empty($email)) {
            Log::warning("PHPMailer: Không tìm thấy email của khách hàng cho đơn hàng #{$order->ma_don_hang}");
            return false;
        }

        try {
            // 2. Khởi tạo cấu hình PHPMailer từ hàm createMailer() ở trên
            $mail = self::createMailer();

            // 3. Thêm địa chỉ người nhận (To: email, họ tên người nhận)
            $mail->addAddress($email, $order->ten_nguoi_nhan ?? 'Quý khách');

            // 4. Cấu hình định dạng email là HTML (để giao diện có màu sắc, bảng sản phẩm, hình ảnh đẹp)
            $mail->isHTML(true);

            // 5. Tiêu đề email (Subject)
            $mail->Subject = "Xác nhận đặt hàng thành công #{$order->ma_don_hang} - TECHNOVA";

            // 6. Nội dung email (Body HTML):
            // Sử dụng file view giao diện Blade 'emails.order_confirmation' và truyền biến $order vào để hiển thị
            $mail->Body = view('emails.order_confirmation', ['order' => $order])->render();

            // 7. Nội dung dự phòng (AltBody text thuần):
            // Dành cho các hòm thư cũ không hỗ trợ HTML đọc được
            $mail->AltBody = "Xin chào {$order->ten_nguoi_nhan}! Cảm ơn bạn đã đặt hàng tại TECHNOVA. Mã đơn hàng của bạn là: #{$order->ma_don_hang}. Tổng tiền thanh toán: " . number_format((float)$order->tong_tien, 0, ',', '.') . " đ.";

            // 8. Bấm nút gửi email đi qua Google SMTP
            $mail->send();

            // Ghi lại lịch sử vào file log của hệ thống để quản trị viên dễ kiểm tra
            Log::info("Đã gửi email xác nhận đơn hàng #{$order->ma_don_hang} qua PHPMailer tới: {$email}");
            return true;

        } catch (Exception $e) {
            // Nếu có lỗi mạng hoặc sai mật khẩu, ghi lỗi vào file laravel.log
            // QUAN TRỌNG: Không quăng lỗi ra màn hình để khách hàng vẫn hoàn tất đặt hàng bình thường
            Log::error("Lỗi khi gửi email bằng PHPMailer cho đơn #{$order->ma_don_hang}: " . $e->getMessage());
            return false;
        } catch (\Throwable $e) {
            Log::error("Lỗi ngoại lệ khi tạo nội dung email: " . $e->getMessage());
            return false;
        }
    }
}
