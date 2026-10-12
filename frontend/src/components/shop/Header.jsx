"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authServices";

export default function Header() {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    // Đồng bộ thông tin người dùng và giỏ hàng từ localStorage
    useEffect(() => {
        const updateUserData = () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                } else {
                    setCurrentUser(null);
                }
            } catch (e) {
                setCurrentUser(null);
            }
        };

        const updateCount = () => {
            try {
                const stored = localStorage.getItem("technova_cart");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        const total = parsed.reduce((sum, item) => sum + (item.quantity || 1), 0);
                        setCartCount(total);
                        return;
                    }
                }
                setCartCount(0);
            } catch (e) {
                setCartCount(0);
            }
        };

        updateUserData();
        updateCount();

        window.addEventListener("userUpdated", updateUserData);
        window.addEventListener("cartUpdated", updateCount);
        window.addEventListener("storage", () => {
            updateUserData();
            updateCount();
        });

        return () => {
            window.removeEventListener("userUpdated", updateUserData);
            window.removeEventListener("cartUpdated", updateCount);
            window.removeEventListener("storage", () => {
                updateUserData();
                updateCount();
            });
        };
    }, []);

    // Xử lý Đăng xuất
    const handleLogout = async () => {
        if (!confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
            return;
        }

        try {
            await logoutUser();
        } catch (error) {
            console.error("Lỗi khi gọi API đăng xuất:", error);
        } finally {
            // Xóa toàn bộ token và thông tin user trong localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("user");

            setCurrentUser(null);
            window.dispatchEvent(new Event("userUpdated"));

            // Chuyển hướng về trang đăng nhập
            router.push("/login");
        }
    };

    return (
        <>
            {/* TOP BAR */}
            {/* ========================================================================== */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-2 text-center sm:text-left">
                        <span className="inline-flex items-center justify-center p-1 bg-blue-600 text-white rounded-full text-[10px]">
                            <i data-lucide="sparkles" className="w-3 h-3" />
                        </span>
                        <span>
                            Miễn phí vận chuyển cho đơn hàng từ <strong>500.000đ</strong> • Đổi
                            trả trong 30 ngày
                        </span>
                    </div>
                    <div className="flex items-center gap-5 text-slate-400">
                        <a
                            href="tel:18006868"
                            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                            <i data-lucide="phone-call" className="w-3.5 h-3.5" />
                            <span>
                                Hotline: <strong className="text-slate-200">1800 6868</strong>
                            </span>
                        </a>
                        <a
                            href="orders.html"
                            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                            <i data-lucide="package" className="w-3.5 h-3.5" />
                            <span>Theo dõi đơn hàng</span>
                        </a>
                        {/* Dark Mode Toggle Button */}
                        <button
                            onClick={() => window.toggleTheme?.()}
                            className="theme-toggle-btn p-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-slate-300"
                            aria-label="Toggle dark mode"
                        >
                            <i data-lucide="moon" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* ========================================================================== */}
            {/* MAIN HEADER */}
            {/* ========================================================================== */}
            <header className="sticky top-0 z-40 glass-header border-b border-slate-200/80 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Menu Hamburger & Brand Logo */}
                        <div className="flex items-center gap-3">
                            <button
                                id="mobile-menu-btn"
                                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                                aria-label="Open navigation menu"
                            >
                                <i data-lucide="menu" className="w-6 h-6" />
                            </button>
                            <a href="index.html" className="flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                    <i data-lucide="cpu" className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                                        TECH
                                        <span className="text-blue-600 dark:text-blue-400">NOVA</span>
                                    </span>
                                    <span className="hidden sm:block text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                                        Premium Electronics
                                    </span>
                                </div>
                            </a>
                        </div>
                        {/* Main Search Bar */}
                        <div className="flex-1 max-w-2xl hidden md:block relative">
                            <form className="header-search-form relative flex items-center">
                                <div className="relative w-full">
                                    <i
                                        data-lucide="search"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm iPhone 16, MacBook, tai nghe chống ồn, PS5..."
                                        className="search-autocomplete-input w-full pl-11 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:text-white placeholder-slate-400 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                                {/* Live Search Results Dropdown */}
                                <div className="search-results-dropdown hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden" />
                            </form>
                        </div>
                        {/* Action Buttons: Wishlist, Account, Cart */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Wishlist */}
                            <a
                                href="wishlist.html"
                                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors relative"
                                title="Sản phẩm yêu thích"
                            >
                                <i
                                    data-lucide="heart"
                                    className="w-5 h-5 text-slate-600 dark:text-slate-300"
                                />
                                <span className="hidden xl:inline text-xs font-semibold">
                                    Yêu thích
                                </span>
                                <span className="wishlist-count-badge absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </a>
                            {/* Account */}
                            <div className="relative group">
                                {currentUser ? (
                                    <Link
                                        href="/profile"
                                        className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                        title={`Tài khoản: ${currentUser.ho_ten || currentUser.name || "Người dùng"}`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                                            {(currentUser.ho_ten || currentUser.name || "U").charAt(0)}
                                        </div>
                                        <span className="hidden xl:inline text-xs font-semibold max-w-[130px] truncate text-slate-900 dark:text-white">
                                            {currentUser.ho_ten || currentUser.name || "Tài khoản"}
                                        </span>
                                        <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                                        title="Đăng nhập tài khoản"
                                    >
                                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="hidden xl:inline text-xs font-semibold">
                                            Tài khoản
                                        </span>
                                    </Link>
                                )}

                                {/* Account Dropdown Menu */}
                                <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block z-50 animate-fadeIn">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 text-xs">
                                        {currentUser ? (
                                            <>
                                                {/* Header thông tin người dùng */}
                                                <div className="px-3 py-2.5 mb-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <div className="font-bold text-slate-900 dark:text-white truncate">
                                                        {currentUser.ho_ten || currentUser.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        {currentUser.email}
                                                    </div>
                                                    {currentUser.vai_tro === "admin" && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                                                            Quản trị viên (Admin)
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Đường dẫn cho Admin */}
                                                {currentUser.vai_tro === "admin" && (
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        Trang Quản trị (Admin)
                                                    </Link>
                                                )}

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Thông tin cá nhân
                                                </Link>

                                                <Link
                                                    href="/orders"
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                    Đơn hàng của tôi
                                                </Link>

                                                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                                {/* Nút Đăng xuất */}
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold transition-colors cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Đăng xuất
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    Đăng nhập tài khoản
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    Đăng ký thành viên mới
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Cart */}
                            <a
                                href="/cart"
                                className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95 relative"
                                title="Giỏ hàng"
                            >
                                <i data-lucide="shopping-cart" className="w-5 h-5" />
                                <span className="hidden sm:inline text-xs font-bold">Giỏ hàng</span>
                                <span className="cart-count-badge bg-rose-500 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {cartCount}
                                </span>
                            </a>
                        </div>
                    </div>
                    {/* Mobile Search Bar in Header */}
                    <div className="mt-3 md:hidden">
                        <form className="header-search-form relative flex items-center">
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm điện tử..."
                                className="search-autocomplete-input w-full pl-10 pr-20 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                            />
                            <i
                                data-lucide="search"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                            >
                                Tìm
                            </button>
                            <div className="search-results-dropdown hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden" />
                        </form>
                    </div>
                </div>
                {/* ========================================================================== */}
                {/* NAVIGATION BAR (DESKTOP) - CENTER ALIGNED */}
                {/* ========================================================================== */}
                <nav className="hidden lg:block border-t border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center text-sm py-1.5 relative">
                            <div className="flex items-center justify-center gap-1 xl:gap-2">
                                <a
                                    href="index.html"
                                    className="px-3.5 py-2 rounded-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 transition-colors"
                                >
                                    Trang chủ
                                </a>
                                <a
                                    href="products"
                                    className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Sản phẩm
                                </a>
                                {/* Categories Dropdown */}
                                <div className="relative group-dropdown">
                                    <button className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors">
                                        <span>Danh mục</span>
                                        <i
                                            data-lucide="chevron-down"
                                            className="w-4 h-4 transition-transform group-hover:rotate-180"
                                        />
                                    </button>
                                    <div className="dropdown-menu absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                                        <a
                                            href="shop.html?category=phone"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                                                <i data-lucide="smartphone" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Điện thoại di động
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=laptop"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                                                <i data-lucide="laptop" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Laptop &amp; Macbook
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=tablet"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600">
                                                <i data-lucide="tablet" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">Máy tính bảng</span>
                                        </a>
                                        <a
                                            href="shop.html?category=headphone"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                                                <i data-lucide="headphones" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Tai nghe &amp; Âm thanh
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=watch"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                                                <i data-lucide="watch" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Đồng hồ thông minh
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=gaming"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
                                                <i data-lucide="gamepad-2" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Gaming &amp; Console
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=camera"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                                                <i data-lucide="camera" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Camera &amp; Flycam
                                            </span>
                                        </a>
                                        <a
                                            href="shop.html?category=smarthome"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-600">
                                                <i data-lucide="home" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">Smart Home</span>
                                        </a>
                                        <a
                                            href="shop.html?category=accessories"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                                                <i data-lucide="plug" className="w-4 h-4" />
                                            </span>
                                            <span className="text-xs font-semibold">
                                                Phụ kiện công nghệ
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <a
                                    href="shop.html?badge=sale"
                                    className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                                >
                                    <span>Khuyến mãi</span>
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                                        HOT
                                    </span>
                                </a>
                                <a
                                    href="news.html"
                                    className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Tin tức
                                </a>
                                <a
                                    href="about.html"
                                    className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Giới thiệu
                                </a>
                                <a
                                    href="contact.html"
                                    className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Liên hệ
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            {/* ========================================================================== */}
            {/* MOBILE NAVIGATION DRAWER */}
            {/* ========================================================================== */}
            <div
                id="mobile-drawer-backdrop"
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300"
            />
            <div
                id="mobile-drawer"
                className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 -translate-x-full transition-transform duration-300 flex flex-col justify-between overflow-y-auto"
            >
                <div className="p-5">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <a href="index.html" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <i data-lucide="cpu" className="w-5 h-5" />
                            </div>
                            <span className="font-black text-lg text-slate-900 dark:text-white uppercase">
                                TECHNOVA
                            </span>
                        </a>
                        <button
                            id="close-mobile-menu-btn"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            aria-label="Close menu"
                        >
                            <i data-lucide="x" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="py-4 space-y-1 text-sm font-semibold">
                        <a
                            href="index.html"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        >
                            <i data-lucide="home" className="w-4 h-4" /> Trang chủ
                        </a>
                        <a
                            href="shop.html"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <i data-lucide="grid" className="w-4 h-4" /> Tất cả sản phẩm
                        </a>
                        <a
                            href="shop.html?badge=sale"
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="flex items-center gap-3">
                                <i data-lucide="tag" className="w-4 h-4 text-rose-500" /> Khuyến mãi
                                sốc
                            </span>
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                                SALE
                            </span>
                        </a>
                        <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                            Danh mục nổi bật
                        </div>
                        <a
                            href="shop.html?category=phone"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            📱 Điện thoại
                        </a>
                        <a
                            href="shop.html?category=laptop"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            💻 Laptop &amp; Macbook
                        </a>
                        <a
                            href="shop.html?category=tablet"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            📲 Tablet &amp; iPad
                        </a>
                        <a
                            href="shop.html?category=headphone"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            🎧 Tai nghe Hi-Res
                        </a>
                        <a
                            href="shop.html?category=watch"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            ⌚ Đồng hồ thông minh
                        </a>
                        <a
                            href="shop.html?category=gaming"
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            🎮 Máy chơi game &amp; Gear
                        </a>
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800" />
                        <a
                            href="news.html"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <i data-lucide="newspaper" className="w-4 h-4" /> Tin công nghệ
                        </a>
                        <a
                            href="about.html"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <i data-lucide="info" className="w-4 h-4" /> Về chúng tôi
                        </a>
                        <a
                            href="contact.html"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <i data-lucide="mail" className="w-4 h-4" /> Liên hệ
                        </a>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                        {(currentUser.ho_ten || currentUser.name || "U").charAt(0)}
                                    </div>
                                    <span className="max-w-[120px] truncate">{currentUser.ho_ten || currentUser.name}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Đăng nhập / Tài khoản</span>
                            </Link>
                        )}
                        <button
                            onClick={() => window.toggleTheme?.()}
                            className="theme-toggle-btn p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                            aria-label="Toggle theme"
                        >
                            <i data-lucide="moon" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}
