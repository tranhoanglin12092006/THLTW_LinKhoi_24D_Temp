<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

/**
 * ====================================================================================
 * DỊCH VỤ TÍCH HỢP CỔNG THANH TOÁN VNPAY (VNPAY-QR & THẺ NGÂN HÀNG)
 * Phiên bản API VNPAY: 2.1.0
 * ====================================================================================
 */
class VNPayService
{
    /**
     * Tạo đường dẫn thanh toán (Payment URL) chuyển hướng sang VNPAY
     * 
     * @param Order $order Đối tượng đơn hàng cần thanh toán
     * @param string|null $ipAddress Địa chỉ IP của khách hàng đặt hàng
     * @param string|null $bankCode Mã ngân hàng hoặc hình thức (VNPAYQR, VNBANK, INTCARD...)
     * @return string URL chuyển hướng tới cổng thanh toán VNPAY
     */
    public static function createPaymentUrl(Order $order, ?string $ipAddress = '127.0.0.1', ?string $bankCode = null): string
    {
        // 1. Đọc các thông số cấu hình từ file config/vnpay.php hoặc .env
        $vnp_TmnCode    = config('vnpay.tmn_code', 'RTUAGMBD');
        $vnp_HashSecret = config('vnpay.hash_secret', 'FVNTWBSNNOKMGVRMARXUEDPESLSRJDLJ');
        $vnp_Url        = config('vnpay.url', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        $vnp_ReturnUrl   = config('vnpay.return_url', 'http://localhost:3000/cart/vnpay-return');

        // Số tiền thanh toán: VNPAY quy định nhân 100 (Ví dụ: 10.000 VNĐ -> 1.000.000)
        $vnp_Amount = (int) $order->tong_tien * 100;

        // Lấy thời gian tạo giao dịch đồng bộ chính xác với đồng hồ máy tính và server VNPAY
        $tz = new \DateTimeZone('Asia/Taipei');
        $now = new \DateTime('now', $tz);
        $startTime = $now->format('YmdHis');

        // Mã tham chiếu giao dịch: Kèm thời gian tạo để mỗi lần bấm thanh toán là 1 phiên mới tinh, không bị lỗi "giao dịch hết hạn cũ" trong Sandbox
        $txnRef = $order->ma_don_hang . '_' . $now->format('His');

        // 2. Chuẩn bị mảng tham số gửi sang VNPAY theo chuẩn tài liệu 2.1.0
        // LƯU Ý: Không gửi vnp_ExpireDate để VNPAY tự động cấp thời gian chờ mặc định 15 phút, tránh lỗi lệch múi giờ
        $inputData = [
            "vnp_Version"        => "2.1.0",
            "vnp_TmnCode"        => $vnp_TmnCode,
            "vnp_Amount"         => $vnp_Amount,
            "vnp_Command"        => "pay",
            "vnp_CreateDate"     => $startTime,
            "vnp_CurrCode"       => "VND",
            "vnp_IpAddr"         => $ipAddress ?: '127.0.0.1',
            "vnp_Locale"         => "vn",
            "vnp_OrderInfo"      => "Thanh toan don hang #" . $order->ma_don_hang,
            "vnp_OrderType"      => "other",
            "vnp_ReturnUrl"      => $vnp_ReturnUrl,
            "vnp_TxnRef"         => $txnRef,
        ];

        // Nếu khách hàng chọn chuyển khoản bằng mã QR VNPAY
        if (!empty($bankCode)) {
            $inputData['vnp_BankCode'] = $bankCode;
        }

        // 3. Sắp xếp mảng tham số theo thứ tự a-z của tên key (Bắt buộc theo chuẩn VNPAY)
        ksort($inputData);

        // 4. Tạo chuỗi hash data và chuỗi query string
        $hashdata = "";
        $query = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // 5. Tạo mã kiểm tra tính toàn vẹn Checksum (HMAC-SHA512) bằng chuỗi bí mật HashSecret
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $paymentUrl = $vnp_Url . "?" . $query . 'vnp_SecureHash=' . $vnpSecureHash;

        Log::info("Đã tạo URL thanh toán VNPAY cho đơn #{$order->ma_don_hang}", [
            'amount' => $order->tong_tien,
            'txn_ref' => $order->ma_don_hang
        ]);

        return $paymentUrl;
    }

    /**
     * Xác thực kết quả giao dịch do VNPAY trả về sau khi khách thanh toán
     * 
     * @param array $params Toàn bộ tham số GET nhận từ VNPAY trả về
     * @return array Kết quả kiểm tra gồm tính hợp lệ, trạng thái và thông tin giao dịch
     */
    public static function verifyReturn(array $params): array
    {
        $vnp_HashSecret = config('vnpay.hash_secret', 'FVNTWBSNNOKMGVRMARXUEDPESLSRJDLJ');
        $vnp_SecureHash = $params['vnp_SecureHash'] ?? '';

        // Tách riêng chữ ký ra khỏi mảng dữ liệu để tính toán lại
        $inputData = [];
        foreach ($params as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        // Sắp xếp các tham số theo thứ tự a-z
        ksort($inputData);

        // Tạo chuỗi hashdata để tính chữ ký
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        // Tính chữ ký HMAC-SHA512
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $isValid = hash_equals($secureHash, $vnp_SecureHash);

        // Kiểm tra mã phản hồi (vnp_ResponseCode == '00' là thành công)
        $responseCode = $params['vnp_ResponseCode'] ?? '';
        $isSuccess = $isValid && ($responseCode === '00');

        $rawTxnRef = $params['vnp_TxnRef'] ?? '';
        // Tách lấy mã đơn hàng gốc (ví dụ: DH000015_103550 -> DH000015)
        $cleanOrderCode = !empty($rawTxnRef) ? explode('_', $rawTxnRef)[0] : null;

        return [
            'is_valid'       => $isValid,
            'is_success'     => $isSuccess,
            'order_code'     => $cleanOrderCode,
            'raw_txn_ref'    => $rawTxnRef,
            'amount'         => isset($params['vnp_Amount']) ? ($params['vnp_Amount'] / 100) : 0,
            'transaction_no' => $params['vnp_TransactionNo'] ?? null,
            'bank_code'      => $params['vnp_BankCode'] ?? null,
            'pay_date'       => $params['vnp_PayDate'] ?? null,
            'response_code'  => $responseCode,
            'message'        => self::getResponseMessage($responseCode, $isValid),
        ];
    }

    /**
     * Dịch mã phản hồi của VNPAY sang thông điệp tiếng Việt dễ hiểu
     */
    public static function getResponseMessage(string $code, bool $isValid): string
    {
        if (!$isValid) {
            return "Chữ ký dữ liệu không hợp lệ (Sai checksum).";
        }

        return match ($code) {
            '00' => 'Giao dịch thành công.',
            '07' => 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
            '09' => 'Giao dịch không thành công: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking.',
            '10' => 'Giao dịch không thành công: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
            '11' => 'Giao dịch không thành công: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            '12' => 'Giao dịch không thành công: Thẻ/Tài khoản của khách hàng bị khóa.',
            '13' => 'Giao dịch không thành công: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
            '24' => 'Giao dịch không thành công: Khách hàng hủy giao dịch.',
            '51' => 'Giao dịch không thành công: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            '65' => 'Giao dịch không thành công: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            '75' => 'Ngân hàng thanh toán đang bảo trì.',
            '79' => 'Giao dịch không thành công: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
            default => 'Giao dịch thất bại hoặc bị hủy bỏ (Mã lỗi: ' . $code . ').',
        };
    }
}
