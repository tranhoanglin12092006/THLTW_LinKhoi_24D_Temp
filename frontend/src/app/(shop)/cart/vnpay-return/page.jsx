"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axiosClient from "@/lib/axiosClient";
import { formatCurrency } from "@/utils/formatCurrency";
import { clearLocalCart } from "@/services/cartStorage";
import { showToast } from "@/components/common/Toast";

/**
 * Component hiển thị kết quả xử lý thanh toán VNPAY
 */
function VNPayReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        //Đánh dấu component đang tồn tại.
        //Biến này giúp kiểm tra component còn hoạt động trước khi cập nhật State

        async function verifyPayment() {
            try {
                setLoading(true);
                // Lấy toàn bộ query string do VNPAY trả về (vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash...)
                const queryString = window.location.search;

                if (!queryString) {
                    setError("Không tìm thấy thông tin giao dịch VNPAY.");
                    setLoading(false);
                    return;
                }

                // Gửi sang backend Laravel để xác thực chữ ký HMAC-SHA512 và cập nhật đơn hàng
                const res = await axiosClient.get(`/vnpay/verify${queryString}`);
                const resData = res?.data || res;

                if (isMounted) {
                    setResult(resData);

                    if (resData?.success) {
                        // Xóa sạch giỏ hàng trong localStorage sau khi thanh toán thành công
                        clearLocalCart();
                        window.dispatchEvent(new Event("cartUpdated"));
                        window.dispatchEvent(new Event("cart:updated"));
                        showToast.success("Thanh toán đơn hàng qua VNPAY thành công!");
                    } else {
                        showToast.error(resData?.message || "Giao dịch chưa thành công.");
                    }
                }
            } catch (err) {
                console.error("Lỗi xác thực VNPAY:", err);
                if (isMounted) {
                    const errPayload = err?.response?.data || err;
                    const errMsg = errPayload?.message || "Không thể xác thực giao dịch VNPAY.";
                    setError(errMsg);
                    setResult(errPayload || null);
                    showToast.error(errMsg);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        verifyPayment();

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    // Trạng thái đang xác thực giao dịch
    if (loading) {
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Đang xác thực giao dịch VNPAY...
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Hệ thống đang kiểm tra chữ ký và cập nhật trạng thái đơn hàng của bạn. Vui lòng chờ trong giây lát.
                </p>
            </main>
        );
    }

    const isSuccess = result?.success;
    const paymentInfo = result?.payment_info || {};
    const order = result?.order || {};

    return (
        <main className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-center shadow-xl">

                {/* Biểu tượng trạng thái */}
                {isSuccess ? (
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 dark:text-emerald-400">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                ) : (
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 ring-8 ring-rose-50 dark:ring-rose-900/20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-600 dark:text-rose-400">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </div>
                )}

                {/* Tiêu đề kết quả */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {isSuccess ? "Thanh toán VNPAY thành công!" : "Giao dịch không thành công"}
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {isSuccess
                        ? "Đơn hàng của bạn đã được thanh toán và hệ thống đang chuyển sang bộ phận chuẩn bị hàng."
                        : (result?.message || error || "Giao dịch đã bị hủy hoặc không thể hoàn tất.")}
                </p>

                {/* Khối chi tiết giao dịch */}
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-left text-xs sm:text-sm space-y-3">
                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Mã đơn hàng:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                            #{order?.ma_don_hang || paymentInfo?.order_code || "—"}
                        </span>
                    </div>

                    <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Số tiền thanh toán:</span>
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                            {formatCurrency(paymentInfo?.amount || order?.tong_tien || 0)}
                        </span>
                    </div>

                    {paymentInfo?.transaction_no && (
                        <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Mã giao dịch VNPAY:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                                {paymentInfo.transaction_no}
                            </span>
                        </div>
                    )}

                    {paymentInfo?.bank_code && (
                        <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Ngân hàng thanh toán:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {paymentInfo.bank_code}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Trạng thái:</span>
                        <span className={`font-bold ${isSuccess ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                            {isSuccess ? "✓ Đã thanh toán" : "✕ Chưa thanh toán"}
                        </span>
                    </div>
                </div>

                {/* Thông báo gửi email */}
                {isSuccess && (
                    <div className="mt-4 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs sm:text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        <span>Hóa đơn và xác nhận đơn hàng đã được gửi tự động qua email của bạn!</span>
                    </div>
                )}

                {/* Nút điều hướng */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    {isSuccess ? (
                        <>
                            <Link
                                href="/profile?tab=orders"
                                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors text-center shadow-lg shadow-blue-500/25"
                            >
                                Xem chi tiết đơn hàng
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-200 transition-colors text-center"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/cart"
                                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors text-center shadow-lg shadow-blue-500/25"
                            >
                                Quay lại giỏ hàng
                            </Link>
                            <Link
                                href="/profile?tab=orders"
                                className="flex-1 py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-700 dark:text-slate-200 transition-colors text-center"
                            >
                                Xem đơn hàng của tôi
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </main>
    );
}

export default function VNPayReturnPage() {
    return (
        <Suspense fallback={
            <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-slate-500 font-medium">Đang tải kết quả VNPAY...</p>
            </main>
        }>
            <VNPayReturnContent />
        </Suspense>
    );
}
