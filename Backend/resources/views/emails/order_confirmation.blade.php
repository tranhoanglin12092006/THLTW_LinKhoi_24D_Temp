{{-- 
    ========================================================================================
    GIAO DIỆN EMAIL XÁC NHẬN ĐƠN HÀNG - TECHNOVA STORE
    - Nhận dữ liệu truyền từ PHPMailerService: biến $order (đối tượng đơn hàng)
    - Hiển thị đầy đủ: Thông tin người nhận, địa chỉ, phương thức thanh toán, danh sách sản phẩm
    ========================================================================================
--}}
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng - TECHNOVA</title>
    <style>
        /* CSS nội tuyến để đảm bảo mọi ứng dụng email (Gmail, Outlook, Yahoo) đều hiển thị đẹp */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px 10px;
            color: #1e293b;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: #ffffff;
            padding: 30px 25px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 1px;
        }
        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 25px;
        }
        .greeting {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .order-badge {
            display: inline-block;
            background: #eff6ff;
            color: #2563eb;
            padding: 6px 14px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            border: 1px solid #bfdbfe;
        }
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px 20px;
            margin: 20px 0;
        }
        .info-card h3 {
            margin: 0 0 12px;
            font-size: 15px;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th {
            background: #f8fafc;
            color: #475569;
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid #e2e8f0;
            font-weight: 700;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }
        .product-name {
            font-weight: 600;
            color: #0f172a;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-box {
            background: #f8fafc;
            border-radius: 12px;
            padding: 15px 20px;
            margin-top: 15px;
            border: 1px solid #e2e8f0;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
        }
        .footer strong {
            color: #1e293b;
        }
    </style>
</head>
<body>
    <div class="container">
        {{-- ==================== PHẦN 1: BANNER / HEADER SHOP ==================== --}}
        <div class="header">
            <h1>TECHNOVA</h1>
            <p>Siêu thị thiết bị điện tử & công nghệ cao cấp</p>
        </div>

        {{-- ==================== PHẦN 2: NỘI DUNG CHÍNH CỦA EMAIL ==================== --}}
        <div class="content">
            {{-- Lời chào khách hàng theo tên người nhận --}}
            <p class="greeting">
                Xin chào <strong>{{ $order->ten_nguoi_nhan }}</strong>,
            </p>
            <p class="greeting">
                Cảm ơn bạn đã tin tưởng đặt hàng tại <strong>TECHNOVA</strong>! Đơn hàng của bạn đã được ghi nhận vào hệ thống thành công và đang được bộ phận kho chuẩn bị đóng gói.
            </p>

            {{-- Mã đơn hàng nổi bật --}}
            <div style="margin: 15px 0;">
                Mã đơn hàng của bạn: <span class="order-badge">#{{ $order->ma_don_hang }}</span>
            </div>

            {{-- ==================== PHẦN 3: BẢNG THÔNG TIN GIAO HÀNG & THANH TOÁN ==================== --}}
            <div class="info-card">
                <h3>THÔNG TIN NHẬN HÀNG & THANH TOÁN</h3>
                
                <table style="margin: 0; width: 100%;">
                    <tr>
                        <td style="width: 140px; color: #64748b; font-weight: 600; padding: 4px 0; border: none;">Người nhận:</td>
                        <td style="color: #0f172a; font-weight: 600; padding: 4px 0; border: none;">{{ $order->ten_nguoi_nhan }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 600; padding: 4px 0; border: none;">Số điện thoại:</td>
                        <td style="color: #0f172a; padding: 4px 0; border: none;">{{ $order->so_dien_thoai }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 600; padding: 4px 0; border: none;">Địa chỉ giao hàng:</td>
                        <td style="color: #0f172a; padding: 4px 0; border: none;">{{ $order->dia_chi }}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 600; padding: 4px 0; border: none;">Phương thức:</td>
                        <td style="color: #0f172a; padding: 4px 0; border: none;">
                            @if($order->phuong_thuc_thanh_toan === 'cod')
                                Thanh toán khi nhận hàng (COD)
                            @elseif($order->phuong_thuc_thanh_toan === 'vnpay')
                                Chuyển khoản qua VNPAY / VNPAY-QR (Đã thanh toán)
                            @elseif($order->phuong_thuc_thanh_toan === 'bank_transfer')
                                Chuyển khoản ngân hàng
                            @else
                                {{ $order->phuong_thuc_thanh_toan }}
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #64748b; font-weight: 600; padding: 4px 0; border: none;">Thời gian đặt:</td>
                        <td style="color: #0f172a; padding: 4px 0; border: none;">{{ $order->created_at ? $order->created_at->format('d/m/Y H:i') : date('d/m/Y H:i') }}</td>
                    </tr>
                </table>
            </div>

            {{-- ==================== PHẦN 4: DANH SÁCH CÁC SẢN PHẨM KHÁCH MUA ==================== --}}
            <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 15px; color: #0f172a;">CHI TIẾT SẢN PHẨM</h3>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th class="text-center" style="width: 70px;">SL</th>
                        <th class="text-right" style="width: 120px;">Đơn giá</th>
                        <th class="text-right" style="width: 130px;">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {{-- Duyệt qua từng sản phẩm trong bảng chi tiết đơn hàng (chiTietDonHangs) --}}
                    @foreach($order->chiTietDonHangs as $item)
                        @php
                            $sp = $item->sanPham;
                            $name = $sp->ten ?? ($sp->product_name ?? 'Sản phẩm TECHNOVA');
                            $price = (float) $item->gia;
                            $qty = (int) $item->so_luong;
                            $subtotal = $price * $qty;
                        @endphp
                        <tr>
                            <td>
                                <span class="product-name">{{ $name }}</span>
                            </td>
                            <td class="text-center font-semibold">{{ $qty }}</td>
                            <td class="text-right">{{ number_format($price, 0, ',', '.') }} ₫</td>
                            <td class="text-right" style="font-weight: 700; color: #2563eb;">{{ number_format($subtotal, 0, ',', '.') }} ₫</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{-- ==================== PHẦN 5: TỔNG KẾT TIỀN ĐƠN HÀNG ==================== --}}
            <div class="total-box">
                <table style="margin: 0; width: 100%;">
                    <tr>
                        <td style="color: #475569; padding: 4px 0; border: none;">Tạm tính tiền hàng:</td>
                        <td style="text-align: right; font-weight: 600; padding: 4px 0; border: none;">
                            {{ number_format((float)$order->tong_tien, 0, ',', '.') }} ₫
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #475569; padding: 4px 0; border: none;">Phí vận chuyển:</td>
                        <td style="text-align: right; font-weight: 600; color: #16a34a; padding: 4px 0; border: none;">
                            Miễn phí (0 ₫)
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; font-weight: 800; color: #0f172a; padding: 10px 0 0; border-top: 1px solid #e2e8f0;">
                            Tổng thanh toán:
                        </td>
                        <td style="text-align: right; font-size: 18px; font-weight: 800; color: #dc2626; padding: 10px 0 0; border-top: 1px solid #e2e8f0;">
                            {{ number_format((float)$order->tong_tien, 0, ',', '.') }} ₫
                        </td>
                    </tr>
                </table>
            </div>

            <p style="margin-top: 25px; font-size: 14px; line-height: 1.6; color: #475569;">
                Kiện hàng sẽ được giao đến địa chỉ của bạn trong vòng 2 - 3 ngày làm việc. Quý khách vui lòng chú ý điện thoại để nhận thông báo từ nhân viên giao hàng.
            </p>
        </div>

        {{-- ==================== PHẦN 6: CHÂN TRANG / LIÊN HỆ ==================== --}}
        <div class="footer">
            <p style="margin: 0 0 5px;">
                Mọi thắc mắc cần hỗ trợ, quý khách vui lòng liên hệ hotline: <strong>1800 6868</strong> hoặc phản hồi trực tiếp email này.
            </p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © {{ date('Y') }} TECHNOVA. Tất cả các quyền được bảo lưu.
            </p>
        </div>
    </div>
</body>
</html>
