"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox";

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        try {
            const stored = localStorage.getItem("technova_cart");
            const cart = stored ? JSON.parse(stored) : [];

            if (Array.isArray(cart)) {
                const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                setCartCount(total);
            } else {
                setCartCount(0);
            }
        } catch (e) {
            setCartCount(0);
        }
    }, [pathname]);

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
                            <Link href="/" className="flex items-center gap-2.5 group">
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
                            </Link>
                        </div>
                        {/* Main Search Bar */}
                        <div className="flex-1 max-w-2xl hidden md:block relative">
                            <SearchBox
                                variant="desktop"
                                placeholder="Tìm kiếm iPhone 16, MacBook, tai nghe chống ồn, PS5..."
                            />
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
                                <a
                                    href="/profile"
                                    className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                                    title="Tài khoản"
                                >
                                    <i
                                        data-lucide="user"
                                        className="w-5 h-5 text-slate-600 dark:text-slate-300"
                                    />
                                    <span className="hidden xl:inline text-xs font-semibold">
                                        Tài khoản
                                    </span>
                                </a>
                                {/* Account Dropdown Menu */}
                                <div className="absolute right-0 top-full pt-2 w-52 hidden group-hover:block z-50">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 text-xs">
                                        <a
                                            href="/profile"
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                        >
                                            <i
                                                data-lucide="user-check"
                                                className="w-4 h-4 text-blue-600"
                                            />{" "}
                                            Thông tin cá nhân
                                        </a>
                                        <a
                                            href="orders.html"
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                        >
                                            <i
                                                data-lucide="shopping-bag"
                                                className="w-4 h-4 text-blue-600"
                                            />{" "}
                                            Đơn hàng của tôi
                                        </a>
                                        <a
                                            href="wishlist.html"
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                        >
                                            <i data-lucide="heart" className="w-4 h-4 text-rose-500" />{" "}
                                            Sản phẩm yêu thích
                                        </a>
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                        <a
                                            href="login.html"
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-300"
                                        >
                                            <i
                                                data-lucide="log-in"
                                                className="w-4 h-4 text-emerald-500"
                                            />{" "}
                                            Đăng nhập / Đăng ký
                                        </a>
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
                        <SearchBox variant="mobile" placeholder="Tìm sản phẩm điện tử..." />
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
            </header >
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
                        <a
                            href="login.html"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                        >
                            <i data-lucide="user" className="w-4 h-4" /> Đăng nhập / Tài khoản
                        </a>
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
