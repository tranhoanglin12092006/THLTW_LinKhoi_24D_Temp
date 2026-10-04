"use client";

import OrderForm from "./OrderForm";

export default function OrderModal({
    open,
    order,
    onSubmit,
    onClose,
    loading = false,
}) {
    // Không hiển thị modal nếu đang đóng
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111328] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {order
                                ? "Cập nhật đơn hàng"
                                : "Thêm đơn hàng"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {order
                                ? "Chỉnh sửa thông tin đơn hàng"
                                : "Nhập thông tin để tạo đơn hàng mới"}
                        </p>
                    </div>

                    {/* Nút đóng */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {/* Nội dung form */}
                <div className="max-h-[80vh] overflow-y-auto p-6">
                    <OrderForm
                        order={order}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}