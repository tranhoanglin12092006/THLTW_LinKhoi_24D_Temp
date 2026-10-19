
"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import OrderStatus from "@/components/dashboard/OrderStatus";
import RecentOrders from "@/components/dashboard/RecentOrders";


import { getDashboardData } from "@/services/dashboardServices";
import AdminGuard from "@/components/admin/AdminGuard";

export default function DashboardPage() {
    // Luu du lieu Dashboard tu API
    const [dashboard, setDashboard] = useState(null);

    // Theo doi trang thai tai du lieu
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Goi API khi mo trang Dashboard
    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);
                setError("");

                const response = await getDashboardData();

                // Ho tro ca axios tra response va axios tra truc tiep data
                const data = response?.data ?? response;

                setDashboard(data);
            } catch (err) {
                console.error("Loi tai du lieu Dashboard:", err);
                setError("Khong the tai du lieu Dashboard.");
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    // Lay gia tri thong ke tu API
    const thongKe = dashboard?.thong_ke;

    const hienThiSo = (giaTri) => {
        if (loading) return "...";
        if (error) return "—";

        return Number(giaTri ?? 0).toLocaleString("vi-VN");
    };

    return (
        <AdminGuard>
            <div
                className="min-h-screen bg-[#090b14] text-white"
                style={{
                    background:
                        "radial-gradient(circle at top right, #151a32 0%, #090b14 45%)",
                }}
            >
            {/* Thanh menu ben trai */}
            <Sidebar />

            {/* Noi dung chinh */}
            <main className="ml-[260px] min-h-screen p-8">
                {/* Tieu de Dashboard */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Tong quan hoat dong kinh doanh
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                            📅 Tháng 10, 2026
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                            A
                        </div>
                    </div>
                </div>

                {/* Thong bao loi khi API that bai */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="ml-3 underline"
                        >
                            Tai lai trang
                        </button>
                    </div>
                )}

                {/* Cac the thong ke */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Sản phẩm"
                        value={hienThiSo(thongKe?.san_pham)}
                        icon="📦"
                        color="#8b5cf6"
                    />

                    <StatCard
                        title="Danh mục"
                        value={hienThiSo(thongKe?.danh_muc)}
                        icon="📁"
                        color="#06b6d4"
                    />

                    <StatCard
                        title="Đơn hàng"
                        value={hienThiSo(thongKe?.don_hang)}
                        icon="🛒"
                        color="#f59e0b"
                    />

                    <StatCard
                        title="Người dùng"
                        value={hienThiSo(thongKe?.nguoi_dung)}
                        icon="👥"
                        color="#10b981"
                    />
                </div>

                {/* Bieu do va thong ke trang thai don hang */}
                <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="min-w-0 xl:col-span-2">
                        <SalesChart />
                    </div>

                    <div className="min-w-0">
                        <OrderStatus />
                    </div>
                </div>

                {/* Danh sach don hang gan day */}
                <div className="mb-8">
                    <RecentOrders />
                </div>

                {/* Thong ke thuong hieu */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">
                            Thương hiệu nổi bật
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Thống kê sản phẩm theo thương hiệu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                ten: "Thương hiệu A",
                                soLuong: 85,
                                mau: "#8b5cf6",
                            },
                            {
                                ten: "Thương hiệu B",
                                soLuong: 64,
                                mau: "#06b6d4",
                            },
                            {
                                ten: "Thương hiệu C",
                                soLuong: 51,
                                mau: "#f59e0b",
                            },
                            {
                                ten: "Thương hiệu D",
                                soLuong: 37,
                                mau: "#10b981",
                            },
                        ].map((thuongHieu, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <span className="text-sm text-gray-300">
                                        {thuongHieu.ten}
                                    </span>

                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor: thuongHieu.mau,
                                        }}
                                    />
                                </div>

                                <div className="mb-3 text-2xl font-bold text-white">
                                    {thuongHieu.soLuong}
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(thuongHieu.soLuong / 85) * 100}%`,
                                            backgroundColor: thuongHieu.mau,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
        </AdminGuard>
    );
}
