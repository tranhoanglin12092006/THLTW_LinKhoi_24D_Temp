"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

export default function ProfilePage() {
    // 1. Quản lý tab hoạt động
    const [activeTab, setActiveTab] = useState("info"); // "info" | "orders" | "security" | "vip"

    // 2. State thông tin cá nhân tĩnh
    const [userInfo, setUserInfo] = useState({
        name: "Nguyễn Văn An",
        email: "nguyenvanan@gmail.com",
        phone: "0987 654 321",
        gender: "male",
        birthdate: "1998-09-12",
        city: "TP. Hồ Chí Minh",
        address: "128 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1",
    });

    // 3. State đổi mật khẩu tĩnh
    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirmPass: "",
    });

    // 4. Thông báo Toast
    const [toastMessage, setToastMessage] = useState("");

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Xử lý lưu thông tin
    const handleSaveProfile = (e) => {
        e.preventDefault();
        showToast("✓ Đã lưu thay đổi thông tin cá nhân thành công!");
    };

    // Xử lý cập nhật mật khẩu
    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwords.newPass !== passwords.confirmPass) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        showToast("✓ Cập nhật mật khẩu bảo mật mới thành công!");
        setPasswords({ current: "", newPass: "", confirmPass: "" });
    };

    // Mock danh sách đơn hàng tĩnh
    const mockOrders = [
        {
            id: "TECH-9824",
            date: "04/10/2026",
            total: 34990000,
            status: "shipping",
            statusLabel: "Đang vận chuyển",
            items: "iPhone 16 Pro Max 256GB Titan Sa Mạc",
        },
        {
            id: "TECH-8521",
            date: "22/09/2026",
            total: 7490000,
            status: "delivered",
            statusLabel: "Giao thành công",
            items: "Tai nghe Sony WH-1000XM5 Chống ồn",
        },
        {
            id: "TECH-7109",
            date: "10/08/2026",
            total: 3290000,
            status: "delivered",
            statusLabel: "Giao thành công",
            items: "Bàn phím cơ Logitech MX Mechanical",
        },
    ];

    return (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* =========================================================
                1. BREADCRUMBS
            ========================================================= */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Trang chủ
                </Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                    Tài khoản cá nhân
                </span>
            </nav>

            {/* Thông báo Toast Popup nếu có */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                    <div className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl shadow-emerald-600/30 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{toastMessage}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* =========================================================
                    2. SIDEBAR HỒ SƠ NGƯỜI DÙNG (4 CỘT)
                ========================================================= */}
                <aside className="lg:col-span-4 space-y-6">
                    {/* Thẻ User Mini Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-4">
                        
                        {/* Avatar */}
                        <div className="relative w-24 h-24 mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full border-4 border-blue-100 dark:border-blue-900/60 shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={() => showToast("✓ Đã chọn ảnh đại diện mới thành công!")}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-md hover:scale-110 active:scale-95 transition-all"
                                title="Đổi ảnh đại diện"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            </button>
                        </div>

                        {/* Tên & Hạng thẻ VIP */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {userInfo.name}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {userInfo.email}
                            </p>
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/15 to-amber-600/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-bold text-[11px] rounded-full">
                                <span>★</span>
                                <span>VIP Diamond Member</span>
                            </div>
                        </div>

                        {/* Thống kê nhanh */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="block text-[11px] text-slate-400 font-medium">Đơn hàng</span>
                                <span className="text-base font-extrabold text-slate-900 dark:text-white">12 đơn</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="block text-[11px] text-slate-400 font-medium">Điểm thưởng</span>
                                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">1.250 pts</span>
                            </div>
                        </div>

                        {/* Danh sách Tab chuyển đổi */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-left font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab("info")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                    activeTab === "info"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Thông tin tài khoản</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                                    activeTab === "orders"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                                    <span>Đơn hàng của tôi</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                    activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                }`}>
                                    3
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                    activeTab === "security"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span>Bảo mật & Mật khẩu</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("vip")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                    activeTab === "vip"
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <span>Đặc quyền Hội viên</span>
                            </button>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
                                            showToast("Đã đăng xuất thành công!");
                                        }
                                    }}
                                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* =========================================================
                    3. NỘI DUNG CHÍNH (8 CỘT)
                ========================================================= */}
                <section className="lg:col-span-8 space-y-6">
                    
                    {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                    {activeTab === "info" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Hồ sơ thông tin tài khoản
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Quản lý tên hiển thị, số điện thoại và địa chỉ giao hàng nhận mặc định
                                    </p>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Tài khoản đã xác thực
                                </span>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Họ và tên */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>

                                    {/* Địa chỉ Email */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Địa chỉ Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                readOnly
                                                value={userInfo.email}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                                            />
                                            <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                                Đã xác thực
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Số điện thoại liên hệ <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>

                                    {/* Tỉnh / Thành phố */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Tỉnh / Thành phố <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={userInfo.city}
                                            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                        >
                                            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                            <option value="Hà Nội">Hà Nội</option>
                                            <option value="Đà Nẵng">Đà Nẵng</option>
                                            <option value="Cần Thơ">Cần Thơ</option>
                                            <option value="Hải Phòng">Hải Phòng</option>
                                            <option value="Bình Dương">Bình Dương</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Địa chỉ chi tiết */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Địa chỉ nhận hàng chi tiết
                                    </label>
                                    <input
                                        type="text"
                                        value={userInfo.address}
                                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        Lưu thay đổi thông tin
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 2: ĐƠN HÀNG CỦA TÔI */}
                    {activeTab === "orders" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Lịch sử đơn hàng
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Xem lại và theo dõi trạng thái các đơn hàng bạn đã mua
                                    </p>
                                </div>
                                <Link
                                    href="/products"
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    + Mua sắm thêm
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {mockOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/30 transition-all space-y-3"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                                    #{order.id}
                                                </span>
                                                <span className="text-xs text-slate-400">• Ngày đặt: {order.date}</span>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                order.status === "shipping"
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === "shipping" ? "bg-amber-500" : "bg-emerald-500"}`} />
                                                {order.statusLabel}
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                            <div className="font-medium text-slate-700 dark:text-slate-300">
                                                {order.items}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-500">Tổng thanh toán:</span>
                                                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(order.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: BẢO MẬT & MẬT KHẨU */}
                    {activeTab === "security" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Đổi mật khẩu bảo mật
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Khuyên dùng mật khẩu mạnh trên 8 ký tự gồm chữ hoa, chữ số và ký tự đặc biệt
                                </p>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Nhập mật khẩu đang dùng..."
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Ít nhất 8 ký tự..."
                                            value={passwords.newPass}
                                            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Nhập lại mật khẩu mới..."
                                            value={passwords.confirmPass}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                                    >
                                        Cập nhật mật khẩu mới
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 4: ĐẶC QUYỀN HỘI VIÊN VIP */}
                    {activeTab === "vip" && (
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-black tracking-widest text-amber-500 uppercase">
                                        Hạng Thẻ Đặc Quyền
                                    </span>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                                        <span>VIP Diamond Club</span>
                                        <span className="text-amber-500">💎</span>
                                    </h2>
                                </div>
                                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25">
                                    Đang Kích Hoạt
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Chúc mừng bạn là một trong những khách hàng thân thiết bậc nhất tại TECHNOVA. Dưới đây là các đặc quyền dành riêng cho bạn:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🎁</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Giảm thêm 5% Mọi Đơn Hàng</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Áp dụng cộng dồn với mọi khuyến mãi hiện hành.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🚀</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Freeship Trọn Đời</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Miễn phí giao hàng hỏa tốc toàn quốc không giới hạn.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🔄</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">1 Đổi 1 Trong 30 Ngày</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Đổi mới thiết bị miễn phí nếu phát sinh lỗi nhà sản xuất.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">👑</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Hỗ Trợ Kỹ Thuật VIP 24/7</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ưu tiên xử lý bởi đội ngũ chuyên gia hàng đầu.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </section>
            </div>
        </main>
    );
}