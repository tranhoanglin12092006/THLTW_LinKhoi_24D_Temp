"use client";

import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderDetailModal({
    open,
    order,
    onClose,
}) {
    // Không hiển thị khi modal đóng hoặc chưa có đơn hàng
    if (!open || !order) {
        return null;
    }

    const details = order.chi_tiet_don_hang || [];

    // Tính tổng tiền từ các sản phẩm trong đơn
    const totalDetail = details.reduce((total, item) => {
        return total + Number(item.gia || 0) * Number(item.so_luong || 0);
    }, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111328] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Chi tiết đơn hàng
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Mã đơn:{" "}
                            <span className="font-semibold text-violet-400">
                                {order.ma_don_hang}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* Thông tin người nhận */}
                <div className="grid grid-cols-1 gap-4 border-b border-white/[0.06] p-6 md:grid-cols-2">
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            Người nhận
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                            {order.ten_nguoi_nhan || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            Số điện thoại
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                            {order.so_dien_thoai || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            Địa chỉ
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                            {order.dia_chi || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            Thanh toán
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                            {order.phuong_thuc_thanh_toan || "—"}
                        </p>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="p-6">
                    <h3 className="mb-4 text-sm font-semibold text-white">
                        Sản phẩm trong đơn
                    </h3>

                    {details.length === 0 ? (
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-10 text-center text-xs text-slate-500">
                            Đơn hàng chưa có sản phẩm.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                            <table className="w-full min-w-[650px] text-left">
                                <thead className="bg-white/[0.02]">
                                    <tr>
                                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Sản phẩm
                                        </th>

                                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Đơn giá
                                        </th>

                                        <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Số lượng
                                        </th>

                                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/[0.04]">
                                    {details.map((item) => {
                                        const product = item.san_pham;

                                        const quantity = Number(
                                            item.so_luong || 0
                                        );

                                        const price = Number(item.gia || 0);

                                        return (
                                            <tr
                                                key={item.id}
                                                className="text-xs text-slate-300"
                                            >
                                                {/* Sản phẩm */}
                                                <td className="px-4 py-4">
                                                    <div className="font-medium text-white">
                                                        {product?.ten ||
                                                            `Sản phẩm #${item.san_pham_id}`}
                                                    </div>

                                                    <div className="mt-1 text-[11px] text-slate-500">
                                                        ID sản phẩm:{" "}
                                                        {item.san_pham_id}
                                                    </div>
                                                </td>

                                                {/* Đơn giá */}
                                                <td className="px-4 py-4 text-slate-400">
                                                    {formatCurrency(price)}
                                                </td>

                                                {/* Số lượng */}
                                                <td className="px-4 py-4 text-center text-slate-300">
                                                    {quantity}
                                                </td>

                                                {/* Thành tiền */}
                                                <td className="px-4 py-4 text-right font-semibold text-violet-400">
                                                    {formatCurrency(
                                                        price * quantity
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tổng tiền */}
                    <div className="mt-5 flex justify-end border-t border-white/[0.06] pt-5">
                        <div className="text-right">
                            <p className="text-xs text-slate-500">
                                Tổng tiền chi tiết
                            </p>

                            <p className="mt-1 text-xl font-bold text-violet-400">
                                {formatCurrency(
                                    totalDetail || order.tong_tien
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-white/[0.06] px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}