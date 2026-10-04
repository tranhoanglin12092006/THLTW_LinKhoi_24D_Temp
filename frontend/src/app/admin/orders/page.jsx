"use client";

import { useEffect, useState } from "react";

import OrderTable from "@/components/dashboard/orders/OrderTable";
import OrderModal from "@/components/dashboard/orders/OrderModal";
import OrderDetailModal from "@/components/dashboard/orders/OrderDetailModal";

import {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder,
} from "@/services/orderServices";

export default function OrdersPage() {
    // Danh sách đơn hàng
    const [orders, setOrders] = useState([]);

    // Trạng thái loading
    const [loading, setLoading] = useState(true);

    // Loading khi thêm / sửa
    const [saving, setSaving] = useState(false);

    // Modal thêm / sửa
    const [showFormModal, setShowFormModal] = useState(false);

    // Modal xem chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Đơn hàng đang chọn
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Từ khóa tìm kiếm
    const [search, setSearch] = useState("");

    // Thông báo
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    // =========================================================
    // Lấy danh sách đơn hàng
    // =========================================================
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await getAllOrders();

            // getAllOrders() đã trả về dữ liệu từ API
            const data = Array.isArray(res)
                ? res
                : res?.data || [];

            setOrders(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);

            showMessage(
                error?.response?.data?.message ||
                "Không thể lấy danh sách đơn hàng.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // Hiển thị thông báo
    // =========================================================
    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    // Lấy dữ liệu lần đầu
    useEffect(() => {
        fetchOrders();
    }, []);

    // =========================================================
    // Mở form thêm
    // =========================================================
    const handleAdd = () => {
        setSelectedOrder(null);
        setShowFormModal(true);
    };

    // =========================================================
    // Mở form sửa
    // =========================================================
    const handleEdit = (order) => {
        setSelectedOrder(order);
        setShowFormModal(true);
    };

    // =========================================================
    // Xem chi tiết
    // =========================================================
    const handleView = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // =========================================================
    // Đóng modal form
    // =========================================================
    const handleCloseForm = () => {
        if (saving) return;

        setShowFormModal(false);
        setSelectedOrder(null);
    };

    // =========================================================
    // Đóng modal chi tiết
    // =========================================================
    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    // =========================================================
    // Thêm / cập nhật đơn hàng
    // =========================================================
    const handleSubmit = async (data) => {
        try {
            setSaving(true);

            if (selectedOrder) {
                const res = await updateOrder(
                    selectedOrder.id,
                    data
                );

                showMessage(
                    res?.data?.message ||
                    "Cập nhật đơn hàng thành công."
                );
            } else {
                const res = await createOrder(data);

                showMessage(
                    res?.data?.message ||
                    "Thêm đơn hàng thành công."
                );
            }

            setShowFormModal(false);
            setSelectedOrder(null);

            await fetchOrders();
        } catch (error) {
            console.error("Lỗi lưu đơn hàng:", error);

            // Hiển thị lỗi validation từ Laravel
            const validationErrors =
                error?.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(
                    validationErrors
                )[0]?.[0];

                showMessage(
                    firstError ||
                    "Dữ liệu đơn hàng không hợp lệ.",
                    "error"
                );
            } else {
                showMessage(
                    error?.response?.data?.message ||
                    "Lưu đơn hàng thất bại.",
                    "error"
                );
            }
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // Xóa đơn hàng
    // =========================================================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa đơn hàng này không?"
        );

        if (!confirmDelete) return;

        try {
            await deleteOrder(id);

            showMessage("Xóa đơn hàng thành công.");

            await fetchOrders();
        } catch (error) {
            console.error("Lỗi xóa đơn hàng:", error);

            showMessage(
                error?.response?.data?.message ||
                "Xóa đơn hàng thất bại.",
                "error"
            );
        }
    };

    // =========================================================
    // Tìm kiếm
    // =========================================================
    const filteredOrders = orders.filter((order) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return true;

        return (
            String(order.id)
                .toLowerCase()
                .includes(keyword) ||
            String(order.ma_don_hang || "")
                .toLowerCase()
                .includes(keyword) ||
            String(order.ten_nguoi_nhan || "")
                .toLowerCase()
                .includes(keyword) ||
            String(order.so_dien_thoai || "")
                .toLowerCase()
                .includes(keyword)
        );
    });

    return (
        <div className="space-y-6">
            {/* Tiêu đề + tìm kiếm + nút thêm */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Tiêu đề */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Quản lý đơn hàng
                    </h1>

                    <p className="mt-1 text-xs text-slate-400">
                        Quản lý và theo dõi các đơn hàng của hệ thống
                    </p>
                </div>

                {/* Tìm kiếm + nút thêm */}
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Tìm mã đơn, người nhận, số điện thoại..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="w-56 rounded-xl border border-white/[0.08] bg-[#151728] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none sm:w-64"
                    />

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition-colors hover:bg-violet-500"
                    >
                        <span className="text-base leading-none">
                            +
                        </span>

                        Thêm đơn hàng
                    </button>
                </div>
            </div>

            {/* Thông báo */}
            {/* Label thông báo */}
            {message && (
                <div
                    className={`fixed right-6 top-6 z-[100] flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm ${messageType === "error"
                            ? "border-rose-500/20 bg-[#1a1220] text-rose-400"
                            : "border-emerald-500/20 bg-[#101c1a] text-emerald-400"
                        }`}
                >
                    <span className="text-base">
                        {messageType === "error" ? "✕" : "✓"}
                    </span>

                    <span>{message}</span>
                </div>
            )}

            {/* Số lượng đơn hàng */}
            <div className="text-xs text-slate-500">
                Có{" "}
                <span className="font-semibold text-slate-300">
                    {filteredOrders.length}
                </span>{" "}
                đơn hàng
            </div>

            {/* Bảng đơn hàng */}
            <OrderTable
                orders={filteredOrders}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal thêm / sửa */}
            <OrderModal
                open={showFormModal}
                order={selectedOrder}
                onSubmit={handleSubmit}
                onClose={handleCloseForm}
                loading={saving}
            />

            {/* Modal chi tiết */}
            <OrderDetailModal
                open={showDetailModal}
                order={selectedOrder}
                onClose={handleCloseDetail}
            />
        </div>
    );
}