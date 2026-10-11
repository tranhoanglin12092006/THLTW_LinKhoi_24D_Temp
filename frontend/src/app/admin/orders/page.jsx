
"use client";

import { useEffect, useState } from "react";

import OrderTable from "@/components/dashboard/orders/OrderTable";
import OrderDetailModal from "@/components/dashboard/orders/OrderDetailModal";
import Pagination from "@/components/common/Pagination";

import {
    getAllOrders,
    updateOrderStatus,
} from "@/services/orderServices";

export default function OrdersPage() {
    // Danh sach don hang
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Don hang dang cap nhat trang thai
    const [updatingStatus, setUpdatingStatus] = useState(null);

    // Modal xem chi tiet
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Tim kiem va phan trang
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Thong bao
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    // Hien thi thong bao
    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
    };

    // Lay danh sach don hang
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await getAllOrders();

            // Ho tro ca mang du lieu va Laravel Resource
            const data = Array.isArray(res)
                ? res
                : Array.isArray(res?.data)
                    ? res.data
                    : [];

            setOrders(data);
        } catch (error) {
            console.error(
                "Loi lay danh sach don hang:",
                error?.response?.data || error
            );

            showMessage(
                error?.response?.data?.message ||
                    "Khong the lay danh sach don hang.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // Lay du lieu khi mo trang
    useEffect(() => {
        fetchOrders();
    }, []);

    // Xem chi tiet don hang
    const handleView = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    // Dong modal chi tiet
    const handleCloseDetail = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    // Cap nhat trang thai don hang
    const handleUpdateStatus = async (order, trangThai) => {
        if (!order?.id || updatingStatus !== null) {
            return;
        }

        const currentStatus = Number(order.trang_thai);

        if (
            !Number.isInteger(trangThai) ||
            trangThai < 0 ||
            trangThai > 4 ||
            trangThai === currentStatus
        ) {
            showMessage("Trang thai don hang khong hop le.", "error");
            return;
        }

        // Don da giao hoac da huy thi khong cap nhat
        if ([3, 4].includes(currentStatus)) {
            showMessage(
                "Don hang da giao hoac da huy, khong the cap nhat.",
                "error"
            );
            return;
        }

        try {
            setUpdatingStatus(order.id);
            setMessage("");

            // Goi API rieng de cap nhat trang thai
            const res = await updateOrderStatus(order.id, trangThai);

            // Cap nhat giao dien ngay sau khi API thanh cong
            setOrders((prevOrders) =>
                prevOrders.map((item) =>
                    item.id === order.id
                        ? { ...item, trang_thai: trangThai }
                        : item
                )
            );

            // Cap nhat trang thai trong modal neu dang mo
            setSelectedOrder((prevOrder) =>
                prevOrder?.id === order.id
                    ? { ...prevOrder, trang_thai: trangThai }
                    : prevOrder
            );

            showMessage(
                res?.message ||
                    res?.data?.message ||
                    "Cap nhat trang thai don hang thanh cong.",
                "success"
            );

            // Tai lai du lieu tu backend
            await fetchOrders();
        } catch (error) {
            console.error(
                "Loi cap nhat trang thai:",
                error?.response?.data || error
            );

            showMessage(
                error?.response?.data?.message ||
                    "Cap nhat trang thai that bai.",
                "error"
            );

            // Tai lai du lieu that neu cap nhat that bai
            await fetchOrders();
        } finally {
            setUpdatingStatus(null);
        }
    };

    // Tim kiem don hang
    const filteredOrders = orders.filter((order) => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return true;
        }

        return (
            String(order.id ?? "").toLowerCase().includes(keyword) ||
            String(order.ma_don_hang ?? "")
                .toLowerCase()
                .includes(keyword) ||
            String(order.ten_nguoi_nhan ?? "")
                .toLowerCase()
                .includes(keyword) ||
            String(order.so_dien_thoai ?? "")
                .toLowerCase()
                .includes(keyword)
        );
    });

    // Tinh phan trang
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + pageSize
    );

    return (
        <div className="space-y-6">
            {/* Tieu de va tim kiem */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Quan ly don hang
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Xem chi tiet va cap nhat trang thai don hang
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Tim ma don, nguoi nhan, so dien thoai..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#151728] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-72"
                />
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Thong bao */}
            {message && (
                <div
                    className={`fixed right-6 top-6 z-[100] rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
                        messageType === "error"
                            ? "border-rose-500/20 bg-[#1a1220] text-rose-400"
                            : "border-emerald-500/20 bg-[#101c1a] text-emerald-400"
                    }`}
                >
                    {message}
                </div>
            )}

            {/* Tong so don hang */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                    Danh sach don hang
                </p>

                <p className="text-sm text-slate-500">
                    Tong cong{" "}
                    <span className="font-semibold text-slate-200">
                        {filteredOrders.length}
                    </span>{" "}
                    don hang
                </p>
            </div>

            {/* Bang don hang */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111328]/80 shadow-xl">
                <OrderTable
                    orders={currentOrders}
                    loading={loading}
                    onView={handleView}
                    onUpdateStatus={handleUpdateStatus}
                    updatingStatus={updatingStatus}
                />
            </div>

            {/* Phan trang */}
            {totalPages > 0 && (
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111328]/80 shadow-lg">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal chi tiet don hang */}
            <OrderDetailModal
                open={showDetailModal}
                order={selectedOrder}
                onClose={handleCloseDetail}
            />
        </div>
    );
}
