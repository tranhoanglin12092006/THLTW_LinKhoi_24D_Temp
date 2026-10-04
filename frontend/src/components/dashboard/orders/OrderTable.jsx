"use client";

import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderTable({
    orders,
    loading,
    onView,
    onEdit,
    onDelete,
}) {
    // Hiển thị trạng thái đơn hàng
    const getStatus = (status) => {
        switch (Number(status)) {
            case 0:
                return {
                    text: "Chờ xử lý",
                    className:
                        "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
                };

            case 1:
                return {
                    text: "Đang xử lý",
                    className:
                        "bg-blue-500/15 text-blue-400 border-blue-500/20",
                };

            case 2:
                return {
                    text: "Đang giao",
                    className:
                        "bg-violet-500/15 text-violet-400 border-violet-500/20",
                };

            case 3:
                return {
                    text: "Đã giao",
                    className:
                        "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
                };

            case 4:
                return {
                    text: "Đã hủy",
                    className:
                        "bg-rose-500/15 text-rose-400 border-rose-500/20",
                };

            default:
                return {
                    text: "Không xác định",
                    className:
                        "bg-slate-500/15 text-slate-400 border-slate-500/20",
                };
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse text-left">

                    {/* Tiêu đề bảng */}
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="w-16 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                ID
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Mã đơn hàng
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Người nhận
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Số điện thoại
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thanh toán
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Tổng tiền
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Trạng thái
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Ngày tạo
                            </th>

                            <th className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    {/* Dữ liệu */}
                    <tbody className="divide-y divide-white/[0.04]">

                        {/* Đang tải */}
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 animate-ping rounded-full bg-violet-500" />
                                        Đang tải danh sách đơn hàng...
                                    </div>
                                </td>
                            </tr>

                        ) : orders.length === 0 ? (

                            /* Không có dữ liệu */
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>

                        ) : (

                            /* Hiển thị danh sách */
                            orders.map((order) => {
                                const status = getStatus(order.trang_thai);

                                return (
                                    <tr
                                        key={order.id}
                                        className="text-xs text-slate-300 transition-colors hover:bg-white/[0.02]"
                                    >

                                        {/* ID */}
                                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                                            #{order.id}
                                        </td>

                                        {/* Mã đơn hàng */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-white">
                                                {order.ma_don_hang}
                                            </span>
                                        </td>

                                        {/* Người nhận */}
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-white">
                                                {order.ten_nguoi_nhan}
                                            </div>

                                            <div className="mt-1 max-w-[220px] truncate text-[11px] text-slate-500">
                                                {order.dia_chi}
                                            </div>
                                        </td>

                                        {/* Số điện thoại */}
                                        <td className="px-4 py-3.5 text-slate-400">
                                            {order.so_dien_thoai}
                                        </td>

                                        {/* Phương thức thanh toán */}
                                        <td className="px-4 py-3.5">
                                            <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
                                                {order.phuong_thuc_thanh_toan ||
                                                    "Chưa xác định"}
                                            </span>
                                        </td>

                                        {/* Tổng tiền */}
                                        <td className="px-4 py-3.5 font-semibold text-violet-400">
                                            {formatCurrency(order.tong_tien)}
                                        </td>

                                        {/* Trạng thái */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />

                                                {status.text}
                                            </span>
                                        </td>

                                        {/* Ngày tạo */}
                                        <td className="px-4 py-3.5 text-slate-500">
                                            {order.created_at
                                                ? new Date(
                                                    order.created_at
                                                ).toLocaleDateString(
                                                    "vi-VN"
                                                )
                                                : "—"}
                                        </td>

                                        {/* Thao tác */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-2">

                                                {/* Xem */}
                                                <button
                                                    type="button"
                                                    onClick={() => onView?.(order)}
                                                    className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold text-violet-400 transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                                                >
                                                    Xem
                                                </button>

                                                {/* Sửa - đơn đã hủy thì không được sửa */}
                                                {Number(order.trang_thai) !== 4 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit?.(order)}
                                                        className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                                                    >
                                                        Sửa
                                                    </button>
                                                )}

                                                {/* Xóa - kể cả đơn đã hủy vẫn được xóa */}
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete?.(order.id)}
                                                    className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                                                >
                                                    Xóa
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}