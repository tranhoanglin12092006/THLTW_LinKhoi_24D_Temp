
"use client";

import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderTable({
    orders = [],
    loading = false,
    onView,
    onUpdateStatus,
    updatingStatus,
}) {
    // Lay trang thai don hang
    const getStatus = (status) => {
        switch (status) {
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

    // Danh sach trang thai
    const statusOptions = [
        { value: 0, label: "Chờ xử lý" },
        { value: 1, label: "Đang xử lý" },
        { value: 2, label: "Đang giao" },
        { value: 3, label: "Đã giao" },
        { value: 4, label: "Đã hủy" },
    ];

    // Kiem tra danh sach don hang
    const orderList = Array.isArray(orders) ? orders : [];

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse text-left">
                    {/* Tieu de bang */}
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

                    {/* Du lieu don hang */}
                    <tbody className="divide-y divide-white/[0.04]">
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
                        ) : orderList.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    Không tìm thấy đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            orderList.map((order) => {
                                // Chuyen trang thai thanh so an toan
                                const rawStatus = order.trang_thai;

                                const trangThai =
                                    rawStatus !== null &&
                                    rawStatus !== undefined &&
                                    rawStatus !== "" &&
                                    Number.isInteger(Number(rawStatus)) &&
                                    Number(rawStatus) >= 0 &&
                                    Number(rawStatus) <= 4
                                        ? Number(rawStatus)
                                        : null;

                                const status = getStatus(trangThai);
                                const isUpdating =
                                    updatingStatus === order.id;

                                // Don da giao hoac da huy thi khong doi trang thai
                                const isFinalStatus =
                                    trangThai === 2 || trangThai === 3 || trangThai === 4;

                                return (
                                    <tr
                                        key={order.id}
                                        className="text-xs text-slate-300 transition-colors hover:bg-white/[0.02]"
                                    >
                                        {/* ID */}
                                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                                            #{order.id}
                                        </td>

                                        {/* Ma don hang */}
                                        <td className="px-4 py-3.5">
                                            <span className="font-semibold text-white">
                                                {order.ma_don_hang || "—"}
                                            </span>
                                        </td>

                                        {/* Nguoi nhan */}
                                        <td className="px-4 py-3.5">
                                            <div className="font-medium text-white">
                                                {order.ten_nguoi_nhan || "—"}
                                            </div>

                                            <div className="mt-1 max-w-[220px] truncate text-[11px] text-slate-500">
                                                {order.dia_chi || "—"}
                                            </div>
                                        </td>

                                        {/* So dien thoai */}
                                        <td className="px-4 py-3.5 text-slate-400">
                                            {order.so_dien_thoai || "—"}
                                        </td>

                                        {/* Phuong thuc thanh toan */}
                                        <td className="px-4 py-3.5">
                                            <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
                                                {order.phuong_thuc_thanh_toan ||
                                                    "Chưa xác định"}
                                            </span>
                                        </td>

                                        {/* Tong tien */}
                                        <td className="px-4 py-3.5 font-semibold text-violet-400">
                                            {formatCurrency(
                                                Number(order.tong_tien) || 0
                                            )}
                                        </td>

                                        {/* Trang thai */}
                                        <td className="px-4 py-3.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {status.text}
                                            </span>
                                        </td>

                                        {/* Ngay tao */}
                                        <td className="px-4 py-3.5 text-slate-500">
                                            {order.created_at
                                                ? new Date(
                                                      order.created_at
                                                  ).toLocaleDateString("vi-VN")
                                                : "—"}
                                        </td>

                                        {/* Thao tac */}
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                {/* Xem chi tiet */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onView?.(order)
                                                    }
                                                    className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold text-violet-400 transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                                                >
                                                    Xem
                                                </button>

                                                {/* Cap nhat trang thai */}
                                                {trangThai !== null &&
                                                    !isFinalStatus && (
                                                        <select
                                                            value={String(
                                                                trangThai
                                                            )}
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onChange={(e) => {
                                                                const newStatus =
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    );

                                                                if (
                                                                    Number.isInteger(
                                                                        newStatus
                                                                    ) &&
                                                                    newStatus >=
                                                                        0 &&
                                                                    newStatus <=
                                                                        4 &&
                                                                    newStatus !==
                                                                        trangThai
                                                                ) {
                                                                    onUpdateStatus?.(
                                                                        order,
                                                                        newStatus
                                                                    );
                                                                }
                                                            }}
                                                            className="max-w-[145px] rounded-xl border border-blue-500/20 bg-[#151728] px-2 py-1.5 text-[11px] text-blue-300 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                            aria-label={`Cập nhật trạng thái đơn hàng ${order.ma_don_hang || order.id}`}
                                                        >
                                                            <option
                                                                value={String(
                                                                    trangThai
                                                                )}
                                                            >
                                                                {status.text}
                                                            </option>

                                                            {statusOptions
                                                                .filter(
                                                                    (option) =>
                                                                        option.value !==
                                                                        trangThai
                                                                )
                                                                .map((option) => (
                                                                    <option
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={String(
                                                                            option.value
                                                                        )}
                                                                        className="bg-[#151728] text-white"
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    )}

                                                {/* Bao loi neu don hang thieu trang thai */}
                                                {trangThai === null && (
                                                    <span className="text-[11px] text-rose-400">
                                                        Thiếu trạng thái
                                                    </span>
                                                )}

                                                {/* Hien thi khi dang cap nhat */}
                                                {isUpdating && (
                                                    <span className="text-[10px] text-slate-400">
                                                        Đang lưu...
                                                    </span>
                                                )}
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
