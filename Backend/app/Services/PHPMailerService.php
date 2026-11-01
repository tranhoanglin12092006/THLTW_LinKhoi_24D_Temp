<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * ====================================================================================
 * LỚP PHPMailerService: Dịch vụ hỗ trợ gửi email tự động xác nhận đơn hàng
 * ====================================================================================
 * - Tự động nạp PHPMailer nếu có sẵn trong vendor.
 * - Tự động fallback sang hệ thống Laravel Mailer chuẩn nếu thư viện PHPMailer chưa nạp.
 * - An toàn 100%: không bao giờ quăng Fatal Error làm gián đoạn quá trình đặt hàng.
 * ====================================================================================
 */
class PHPMailerService
{
    /**
     * Nạp các file cốt lõi của PHPMailer một cách an toàn
     */
    private static function loadPHPMailer(): bool
    {
        if (class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
            return true;
        }

        $baseVendor = base_path('vendor/phpmailer/phpmailer/src');
        $exceptionFile = $baseVendor . '/Exception.php';
        $phpMailerFile = $baseVendor . '/PHPMailer.php';
        $smtpFile = $baseVendor . '/SMTP.php';

        if (file_exists($exceptionFile) && file_exists($phpMailerFile) && file_exists($smtpFile)) {
            require_once $exceptionFile;
            require_once $phpMailerFile;
            require_once $smtpFile;
            return true;
        }

        return false;
    }

    /**
     * Tạo đối tượng PHPMailer đã cấu hình
     */
    public static function createMailer()
    {
        if (!self::loadPHPMailer()) {
            return null;
        }

        $className = '\\PHPMailer\\PHPMailer\\PHPMailer';
        $mail = new $className(true);

        $mail->isSMTP();
        $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
        $mail->SMTPAuth   = true;
        $mail->Username   = env('MAIL_USERNAME', 'nguoiyahoo@gmail.com');
        $mail->Password   = env('MAIL_PASSWORD', 'lnti gcyo czxw simx');
        $mail->SMTPSecure = $className::ENCRYPTION_STARTTLS;
        $mail->Port       = (int) env('MAIL_PORT', 587);
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(
            env('MAIL_FROM_ADDRESS', 'nguoiyahoo@gmail.com'),
            env('MAIL_FROM_NAME', 'TECHNOVA Store')
        );

        return $mail;
    }

    /**
     * Gửi email xác nhận đơn hàng cho khách
     */
    public static function sendOrderConfirmation($order, ?string $recipientEmail = null): bool
    {
        $email = $recipientEmail ?? $order->nguoiDung?->email;

        if (empty($email)) {
            Log::warning("PHPMailer: Không tìm thấy email của khách hàng cho đơn hàng #{$order->ma_don_hang}");
            return false;
        }

        try {
            // Cách 1: Gửi qua PHPMailer nếu thư viện có sẵn
            if (self::loadPHPMailer()) {
                $mail = self::createMailer();
                if ($mail) {
                    $mail->addAddress($email, $order->ten_nguoi_nhan ?? 'Quý khách');
                    $mail->isHTML(true);
                    $mail->Subject = "Xác nhận đặt hàng thành công #{$order->ma_don_hang} - TECHNOVA";
                    $mail->Body = view('emails.order_confirmation', ['order' => $order])->render();
                    $mail->AltBody = "Xin chào {$order->ten_nguoi_nhan}! Cảm ơn bạn đã đặt hàng tại TECHNOVA. Mã đơn hàng của bạn là: #{$order->ma_don_hang}. Tổng tiền thanh toán: " . number_format((float)$order->tong_tien, 0, ',', '.') . " đ.";
                    $mail->send();

                    Log::info("Đã gửi email xác nhận đơn hàng #{$order->ma_don_hang} qua PHPMailer tới: {$email}");
                    return true;
                }
            }

            // Cách 2: Fallback qua Laravel Mail tiêu chuẩn (Symfony Mailer)
            if (view()->exists('emails.order_confirmation')) {
                $htmlBody = view('emails.order_confirmation', ['order' => $order])->render();
                Mail::html($htmlBody, function ($message) use ($email, $order) {
                    $message->to($email, $order->ten_nguoi_nhan ?? 'Quý khách')
                            ->subject("Xác nhận đặt hàng thành công #{$order->ma_don_hang} - TECHNOVA");
                });
                Log::info("Đã gửi email xác nhận đơn hàng #{$order->ma_don_hang} qua Laravel Mail tới: {$email}");
                return true;
            }

            Log::warning("Chưa cấu hình gửi email cho đơn hàng #{$order->ma_don_hang}");
            return false;

        } catch (\Throwable $e) {
            // Không quăng lỗi ra ngoài để quá trình đặt hàng luôn thành công
            Log::error("Lỗi khi gửi email xác nhận cho đơn #{$order->ma_don_hang}: " . $e->getMessage());
            return false;
        }
    }
}
