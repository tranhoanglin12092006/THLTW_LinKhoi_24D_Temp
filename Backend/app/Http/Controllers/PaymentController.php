<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Order;
use App\Services\VNPayService;
use App\Services\PHPMailerService;
use Illuminate\Support\Facades\Log;

/**
 * ====================================================================================
 * CONTROLLER XỬ LÝ THANH TOÁN VNPAY
 * ====================================================================================
 */
class PaymentController extends Controller
{
    /**
     * Tạo đường dẫn thanh toán VNPAY cho đơn hàng đã có
     * POST /api/vnpay/create-payment
     */
    public function createPayment(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required',
            'bank_code' => 'nullable|string', // VNPAYQR, VNBANK, INTCARD...
        ]);

        $order = Order::where('id', $request->order_id)
            ->orWhere('ma_don_hang', $request->order_id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        $paymentUrl = VNPayService::createPaymentUrl(
            $order,
            $request->ip(),
            $request->input('bank_code')
        );

        return response()->json([
            'message' => 'Tạo URL thanh toán VNPAY thành công.',
            'payment_url' => $paymentUrl,
            'order_code' => $order->ma_don_hang,
        ]);
    }

    /**
     * Xử lý và xác thực dữ liệu khi VNPAY trả kết quả về sau thanh toán
     * GET /api/vnpay/verify
     */
    public function verifyReturn(Request $request): JsonResponse
    {
        $params = $request->all();

        // 1. Gọi Service để kiểm tra chữ ký và mã phản hồi VNPAY
        $result = VNPayService::verifyReturn($params);

        if (!$result['is_valid']) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ hoặc chữ ký bảo mật bị sai.',
                'data' => $result,
            ], 400);
        }

        // 2. Tìm đơn hàng theo mã đơn hàng (vnp_TxnRef)
        $orderCode = $result['order_code'];
        $order = Order::with(['chiTietDonHangs.sanPham', 'nguoiDung'])
            ->where('ma_don_hang', $orderCode)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Không tìm thấy đơn hàng #{$orderCode} trong hệ thống.",
                'data' => $result,
            ], 404);
        }

        // 3. Nếu khách thanh toán thành công (Mã phản hồi '00')
        if ($result['is_success']) {
            // Cập nhật trạng thái đơn hàng: 1 = Đang xử lý (Đã thanh toán)
            $order->update([
                'trang_thai' => 1,
            ]);

            // Gửi email xác nhận thanh toán thành công qua PHPMailer cho khách hàng
            try {
                PHPMailerService::sendOrderConfirmation($order);
            } catch (\Throwable $e) {
                Log::error("Lỗi gửi mail sau thanh toán VNPAY: " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Thanh toán đơn hàng qua VNPAY thành công!',
                'order' => $order,
                'payment_info' => $result,
            ]);
        }

        // 4. Nếu khách hủy thanh toán hoặc giao dịch thất bại
        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'order' => $order,
            'payment_info' => $result,
        ]);
    }
}
