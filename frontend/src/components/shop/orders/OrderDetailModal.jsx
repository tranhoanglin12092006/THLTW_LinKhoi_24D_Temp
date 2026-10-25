"use client";

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import API_CONFIG from "@/config/api";
import { showToast } from "@/components/common/Toast";

// Bảng cấu hình trạng thái đơn hàng
const STATUS_CONFIG = {
    0: {
        text: "Chờ xử lý",
        badgeCls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        dotCls: "bg-amber-500",
        stepIndex: 1,
        desc: "Đơn hàng đang chờ nhân viên kiểm tra và xác nhận.",
    },
    1: {
        text: "Đang xử lý",
        badgeCls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
        dotCls: "bg-blue-500",
        stepIndex: 2,
        desc: "Đơn hàng đã được xác nhận và đang đóng gói sản phẩm.",
    },
    2: {
        text: "Đang giao hàng",
        badgeCls: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
        dotCls: "bg-violet-500",
        stepIndex: 3,
        desc: "Đơn hàng đã giao cho đơn vị vận chuyển.",
    },
    3: {
        text: "Đã giao thành công",
        badgeCls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        dotCls: "bg-emerald-500",
        stepIndex: 4,
        desc: "Khách hàng đã nhận kiện hàng thành công.",
    },
    4: {
        text: "Đã hủy",
        badgeCls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        dotCls: "bg-rose-500",
        stepIndex: 0,
        desc: "Đơn hàng đã bị hủy bỏ.",
    },
};

const ORDER_STEPS = [
    { title: "Đặt hàng", desc: "Đã nhận đơn" },
    { title: "Xác nhận", desc: "Đang chuẩn bị" },
    { title: "Vận chuyển", desc: "Đang giao đến bạn" },
    { title: "Hoàn tất", desc: "Giao thành công" },
];

/**
 * Modal hiển thị đầy đủ chi tiết đơn hàng cho khách hàng
 */
export default function OrderDetailModal({ open, order, onClose, onCancelOrder }) {
    if (!open || !order) return null;

    const statusCode = Number(order.trang_thai ?? 0);
    const status = STATUS_CONFIG[statusCode] || {
        text: "Không xác định",
        badgeCls: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        dotCls: "bg-slate-400",
        stepIndex: 1,
        desc: "",
    };

    const details = order.chi_tiet_don_hang || order.chi_tiet_don_hangs || [];
    const canCancel = statusCode === 0;

    // Tính toán tạm tính các dòng sản phẩm
    const subtotal = details.reduce((sum, item) => {
        return sum + Number(item.gia || 0) * Number(item.so_luong || 1);
    }, 0);

    const grandTotal = Number(order.tong_tien || subtotal);

    // Xử lý link ảnh
    const resolveImageUrl = (img) => {
        if (!img) return "/images/no-image.png";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return `${API_CONFIG.IMAGE_URL}${img}`;
    };

    // Copy mã đơn hàng
    const handleCopyCode = () => {
        if (order.ma_don_hang && navigator.clipboard) {
            navigator.clipboard.writeText(order.ma_don_hang);
            showToast.success("Đã sao chép mã đơn hàng!");
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
            {/* Backdrop click to close */}
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Chi tiết đơn hàng
                            </h3>
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                title="Bấm để sao chép mã"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                                #{order.ma_don_hang}
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Đặt lúc: {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : "—"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${status.badgeCls}`}>
                            <span className={`w-2 h-2 rounded-full ${status.dotCls}`} />
                            {status.text}
                        </span>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>

                {/* Nội dung scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Tiến trình đơn hàng (Timeline Stepper) */}
                    {statusCode !== 4 ? (
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                            <div className="grid grid-cols-4 gap-2 relative">
                                {ORDER_STEPS.map((step, idx) => {
                                    const stepNum = idx + 1;
                                    const isCompleted = status.stepIndex >= stepNum;
                                    const isCurrent = status.stepIndex === stepNum;

                                    return (
                                        <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    isCompleted
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                                } ${isCurrent ? "ring-4 ring-blue-500/20 scale-105" : ""}`}
                                            >
                                                {isCompleted ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                ) : (
                                                    stepNum
                                                )}
                                            </div>
                                            <h5 className={`mt-2 text-xs font-bold ${isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                                                {step.title}
                                            </h5>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                                                {step.desc}
                                            </p>
                                        </div>
                                    );
                                })}

                                {/* Thanh ngang nối các bước */}
                                <div className="absolute top-4 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-700 -z-0">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{
                                            width: `${Math.min(100, Math.max(0, ((status.stepIndex - 1) / 3) * 100))}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center gap-3 text-rose-700 dark:text-rose-400 text-xs sm:text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            <span>Đơn hàng này đã bị hủy. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ khách hàng.</span>
                        </div>
                    )}

                    {/* Khối thông tin giao hàng & thanh toán */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                Thông tin người nhận
                            </h4>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {order.ten_nguoi_nhan || "Chưa cập nhật"}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                {order.so_dien_thoai || "—"}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                                {order.dia_chi || "—"}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                Phương thức thanh toán
                            </h4>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {order.phuong_thuc_thanh_toan === "cod"
                                    ? "Thanh toán khi nhận hàng (COD)"
                                    : order.phuong_thuc_thanh_toan === "bank_transfer"
                                    ? "Chuyển khoản qua ngân hàng"
                                    : order.phuong_thuc_thanh_toan || "COD"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {order.phuong_thuc_thanh_toan === "cod"
                                    ? "Bạn sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận hàng."
                                    : "Thanh toán bằng hình thức chuyển khoản quét mã QR hoặc STK."}
                            </p>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm trong đơn */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                            <span>Sản phẩm trong đơn ({details.length})</span>
                            <span className="text-slate-400 font-normal">Đơn giá / Số lượng</span>
                        </h4>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                            {details.length === 0 ? (
                                <p className="p-6 text-center text-xs text-slate-400">
                                    Không tìm thấy dữ liệu chi tiết sản phẩm của đơn hàng.
                                </p>
                            ) : (
                                details.map((item, idx) => {
                                    const p = item.san_pham || item.sanPham || {};
                                    const itemPrice = Number(item.gia || p.gia || 0);
                                    const itemQty = Number(item.so_luong || 1);
                                    const itemTotal = itemPrice * itemQty;
                                    const imgUrl = resolveImageUrl(p.hinh_anh_url || p.hinh_anh || p.image);

                                    return (
                                        <div key={item.id || idx} className="p-4 flex items-center gap-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="w-14 h-14 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={imgUrl}
                                                    alt={p.ten || p.product_name || "Sản phẩm"}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://placehold.co/100x100/f1f5f9/475569?text=SP";
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                                    {p.ten || p.product_name || "Sản phẩm TECHNOVA"}
                                                </h5>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Đơn giá: {formatCurrency(itemPrice)}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(itemTotal)}
                                                </p>
                                                <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                    x{itemQty}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Tổng kết tiền đơn hàng */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>Tạm tính tiền hàng:</span>
                            <span className="font-semibold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span>Phí vận chuyển:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Miễn phí (0 ₫)</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm">
                            <span className="font-bold text-slate-900 dark:text-white">Tổng thanh toán:</span>
                            <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                                {formatCurrency(grandTotal)}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Footer action buttons */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                    <div>
                        {canCancel && onCancelOrder && (
                            <button
                                type="button"
                                onClick={() => {
                                    onCancelOrder(order);
                                    onClose();
                                }}
                                className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            >
                                Hủy đơn hàng này
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    );
}
