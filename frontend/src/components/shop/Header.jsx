"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox";
import MiniCartDropdown from "./MiniCartDropdown";
import { logoutUser } from "@/services/authServices";
import { getOrCreateGuestCart } from "@/services/cartServices";
import {
    getLocalCart,
    getLocalCartCount,
    getLocalCartTotal,
    removeLocalCartItem,
    isUserLoggedIn,
} from "@/services/cartStorage";
import { showToast } from "@/components/common/Toast";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    // Dữ liệu giỏ hàng
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Trạng thái hiển thị và hiệu ứng giỏ hàng
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartBouncing, setCartBouncing] = useState(false);
    const [justAddedItem, setJustAddedItem] = useState(null);

    // Trạng thái người dùng và giao diện
    const [currentUser, setCurrentUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Refs để quản lý debounce timeout khi hover / auto close
    const cartCloseTimerRef = useRef(null);
    const justAddedTimerRef = useRef(null);
    const cartContainerRef = useRef(null);

    // Đọc và đồng bộ dữ liệu giỏ hàng đầy đủ
    const refreshCart = useCallback(async () => {
        try {
            const items = getLocalCart();
            setCartItems(items);

            const count = getLocalCartCount();
            const total = getLocalCartTotal();
            setCartCount(count);
            setCartTotal(total);

            // Nếu local cart trống nhưng có session_id từ server, thử fallback đồng bộ
            if (items.length === 0 && typeof window !== "undefined") {
                const sessionId = localStorage.getItem("cart_session_id");
                if (sessionId) {
                    try {
                        const res = await getOrCreateGuestCart(sessionId);
                        const dbItems = res?.data?.chi_tiet_gio_hang || [];
                        if (dbItems.length > 0) {
                            const dbCount = dbItems.reduce((s, it) => s + Number(it.so_luong || 1), 0);
                            setCartCount(dbCount);
                        }
                    } catch (e) {
                        // ignore API error
                    }
                }
            }
        } catch (e) {
            console.error("Lỗi cập nhật giỏ hàng Header:", e);
        }
    }, []);

    // Khởi tạo và lắng nghe thay đổi route
    useEffect(() => {
        const timer = setTimeout(() => {
            refreshCart();

            // Đọc thông tin user
            try {
                const userStored = localStorage.getItem("user");
                setCurrentUser(userStored ? JSON.parse(userStored) : null);
            } catch (e) {
                setCurrentUser(null);
            }

            // Đồng bộ trạng thái dark mode
            if (typeof window !== "undefined") {
                const isDarkMode = document.documentElement.classList.contains("dark") ||
                    localStorage.getItem("theme") === "dark";
                setIsDark(isDarkMode);
            }

            // Đóng dropdown khi chuyển trang
            setIsCartOpen(false);
            setIsMobileMenuOpen(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname, refreshCart]);

    // Lắng nghe scroll để áp dụng hiệu ứng glass header tinh tế
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lắng nghe sự kiện thêm/xóa sản phẩm và cập nhật giỏ hàng từ bất kỳ đâu trong app
    useEffect(() => {
        const handleCartUpdate = (e) => {
            refreshCart();
        };

        const handleItemAdded = (e) => {
            refreshCart();

            // Kích hoạt hiệu ứng nảy badge và rung nhẹ nút giỏ hàng
            setCartBouncing(true);
            setTimeout(() => setCartBouncing(false), 800);

            // Lấy item vừa được thêm
            const item = e?.detail?.item;
            if (item) {
                setJustAddedItem(item);
                // Tự động mở Mini Cart Dropdown để người dùng thấy ngay
                setIsCartOpen(true);

                // Hẹn giờ tự đóng sau 3.5 giây nếu người dùng không hover vào
                if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
                justAddedTimerRef.current = setTimeout(() => {
                    setIsCartOpen(false);
                    setJustAddedItem(null);
                }, 3500);
            }
        };

        const handleUserUpdate = () => {
            try {
                const userStored = localStorage.getItem("user");
                setCurrentUser(userStored ? JSON.parse(userStored) : null);
                refreshCart();
            } catch (e) {}
        };

        window.addEventListener("cartUpdated", handleCartUpdate);
        window.addEventListener("cart:updated", handleCartUpdate);
        window.addEventListener("cartItemAdded", handleItemAdded);
        window.addEventListener("userUpdated", handleUserUpdate);
        window.addEventListener("storage", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
            window.removeEventListener("cart:updated", handleCartUpdate);
            window.removeEventListener("cartItemAdded", handleItemAdded);
            window.removeEventListener("userUpdated", handleUserUpdate);
            window.removeEventListener("storage", handleCartUpdate);

            if (cartCloseTimerRef.current) clearTimeout(cartCloseTimerRef.current);
            if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
        };
    }, [refreshCart]);

    // Xử lý Click Outside để đóng Dropdown giỏ hàng
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartContainerRef.current && !cartContainerRef.current.contains(e.target)) {
                setIsCartOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Xử lý Hover mở Giỏ hàng với Intent Debounce mượt mà
    const handleCartMouseEnter = () => {
        if (cartCloseTimerRef.current) {
            clearTimeout(cartCloseTimerRef.current);
            cartCloseTimerRef.current = null;
        }
        setIsCartOpen(true);
    };

    const handleCartMouseLeave = () => {
        // Debounce 280ms tránh giật tắt khi rê chuột qua lại
        cartCloseTimerRef.current = setTimeout(() => {
            setIsCartOpen(false);
            setJustAddedItem(null);
        }, 280);
    };

    // Điều hướng giỏ hàng và kiểm tra đăng nhập
    const handleCartNavigation = (url = "/cart") => {
        setIsCartOpen(false);
        if (!isUserLoggedIn()) {
            showToast.warning("Vui lòng đăng nhập tài khoản để quản lý giỏ hàng của bạn!");
            router.push(`/login?redirect=${encodeURIComponent(url)}`);
            return;
        }
        router.push(url);
    };

    // Xóa nhanh sản phẩm khỏi mini cart
    const handleQuickRemove = (id, name = "Sản phẩm") => {
        try {
            const updated = removeLocalCartItem(id);
            setCartItems(updated);
            setCartCount(getLocalCartCount());
            setCartTotal(getLocalCartTotal());
            showToast.info(`Đã xóa "${name}" khỏi giỏ hàng.`);
        } catch (e) {
            console.error("Lỗi xóa sản phẩm:", e);
        }
    };

    // Toggle Dark Mode
    const handleToggleTheme = () => {
        if (typeof window !== "undefined") {
            if (typeof window.toggleTheme === "function") {
                window.toggleTheme();
            } else {
                const isCurrentDark = document.documentElement.classList.contains("dark");
                if (isCurrentDark) {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                    setIsDark(false);
                } else {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                    setIsDark(true);
                }
            }
            setIsDark(document.documentElement.classList.contains("dark"));
        }
    };

    // Xử lý đăng xuất
    const handleLogout = async () => {
        if (!confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) return;

        try {
            await logoutUser();
        } catch (error) {
            console.error("Lỗi khi gọi API đăng xuất:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("user");

            setCurrentUser(null);
            refreshCart();
            showToast.success("Đã đăng xuất thành công.");
            router.push("/login");
        }
    };

    return (
        <>
            {/* TOP BAR */}
            {/* ========================================================================== */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-2 text-center sm:text-left">
                        <span className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[10px] shadow-sm">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </span>
                        <span>
                            Miễn phí vận chuyển cho đơn hàng từ <strong className="text-white">500.000đ</strong> • Đổi trả trong 30 ngày
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-slate-400">
                        <a
                            href="tel:18006868"
                            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>
                                Hotline: <strong className="text-slate-200">1800 6868</strong>
                            </span>
                        </a>

                        <Link
                            href="/profile?tab=orders"
                            className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Theo dõi đơn hàng</span>
                        </Link>

                        {/* Dark Mode Toggle Button */}
                        <button
                            type="button"
                            onClick={handleToggleTheme}
                            className="p-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
                            aria-label="Toggle dark mode"
                            title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                        >
                            {isDark ? (
                                <svg className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-slate-300 transition-transform duration-300 hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================================== */}
            {/* MAIN HEADER */}
            {/* ========================================================================== */}
            <header className={`sticky top-0 z-40 glass-header border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${isScrolled ? "shadow-md bg-white/95 dark:bg-slate-900/95" : ""}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Mobile Menu Hamburger & Brand Logo */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                                aria-label="Open navigation menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                                        TECH<span className="text-blue-600 dark:text-blue-400">NOVA</span>
                                    </span>
                                    <span className="hidden sm:block text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                                        Premium Electronics
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Main Search Bar */}
                        <div className="flex-1 max-w-2xl hidden md:block relative">
                            <SearchBox
                                variant="desktop"
                                placeholder="Tìm kiếm iPhone 16, MacBook Pro, tai nghe chống ồn, PS5..."
                            />
                        </div>

                        {/* Action Buttons: Wishlist, Account, Cart */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Wishlist */}
                            <Link
                                href="/products"
                                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors relative"
                                title="Sản phẩm yêu thích"
                            >
                                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="hidden xl:inline text-xs font-semibold">
                                    Yêu thích
                                </span>
                            </Link>

                            {/* Account Dropdown */}
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
                                <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block z-50 animate-mini-cart">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 text-xs">
                                        {currentUser ? (
                                            <>
                                                {/* Header thông tin người dùng */}
                                                <div className="px-3 py-2.5 mb-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <div className="font-bold text-slate-900 dark:text-white truncate">
                                                        {currentUser.ho_ten || currentUser.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
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
                                                    href="/profile?tab=orders"
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

                            {/* CART CONTAINER VỚI MINI-CART DROPDOWN CHUYÊN NGHIỆP */}
                            {/* ========================================================== */}
                            <div
                                ref={cartContainerRef}
                                className="relative"
                                onMouseEnter={handleCartMouseEnter}
                                onMouseLeave={handleCartMouseLeave}
                            >
                                {/* Cart Button */}
                                <button
                                    type="button"
                                    onClick={() => handleCartNavigation("/cart")}
                                    data-cart-icon
                                    className={`p-2 sm:px-3.5 sm:py-2 rounded-xl text-white flex items-center gap-2 transition-all duration-200 active:scale-95 relative cursor-pointer shadow-md ${
                                        cartBouncing
                                            ? "bg-blue-700 animate-cart-wiggle cart-pulse-active shadow-blue-600/40"
                                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                                    }`}
                                    title="Xem giỏ hàng"
                                    aria-expanded={isCartOpen}
                                    aria-haspopup="true"
                                >
                                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="hidden sm:inline text-xs font-bold tracking-tight">
                                        Giỏ hàng
                                    </span>

                                    {/* Cart Badge với hiệu ứng nảy số */}
                                    <span
                                        className={`bg-rose-500 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm ${
                                            cartBouncing ? "animate-cart-bounce" : ""
                                        }`}
                                    >
                                        {cartCount}
                                    </span>
                                </button>

                                {/* Dropdown Mini-Cart hiển thị đúng sản phẩm */}
                                <MiniCartDropdown
                                    isOpen={isCartOpen}
                                    onClose={() => setIsCartOpen(false)}
                                    cartItems={cartItems}
                                    onRemoveItem={handleQuickRemove}
                                    totalPrice={cartTotal}
                                    totalCount={cartCount}
                                    justAddedItem={justAddedItem}
                                    onNavigate={handleCartNavigation}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar in Header */}
                    <div className="mt-2.5 md:hidden">
                        <SearchBox variant="mobile" placeholder="Tìm sản phẩm điện tử, điện thoại..." />
                    </div>
                </div>

                {/* ========================================================================== */}
                {/* NAVIGATION BAR (DESKTOP) */}
                {/* ========================================================================== */}
                <nav className="hidden lg:block border-t border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center text-sm py-1.5 relative">
                            <div className="flex items-center justify-center gap-1 xl:gap-2 font-medium">
                                <Link
                                    href="/"
                                    className={`px-3.5 py-2 rounded-xl transition-colors ${
                                        pathname === "/"
                                            ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                            : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    Trang chủ
                                </Link>

                                <Link
                                    href="/products"
                                    className={`px-3.5 py-2 rounded-xl transition-colors ${
                                        pathname === "/products"
                                            ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                            : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    Sản phẩm
                                </Link>

                                {/* Categories Dropdown */}
                                <div className="relative group-dropdown">
                                    <button
                                        type="button"
                                        className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <span>Danh mục</span>
                                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div className="dropdown-menu absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                                        <Link
                                            href="/products?category=phone"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 text-sm">
                                                📱
                                            </span>
                                            <span className="text-xs font-semibold">Điện thoại di động</span>
                                        </Link>

                                        <Link
                                            href="/products?category=laptop"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 text-sm">
                                                💻
                                            </span>
                                            <span className="text-xs font-semibold">Laptop & Macbook</span>
                                        </Link>

                                        <Link
                                            href="/products?category=tablet"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 text-sm">
                                                📲
                                            </span>
                                            <span className="text-xs font-semibold">Máy tính bảng</span>
                                        </Link>

                                        <Link
                                            href="/products?category=headphone"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 text-sm">
                                                🎧
                                            </span>
                                            <span className="text-xs font-semibold">Tai nghe & Âm thanh</span>
                                        </Link>

                                        <Link
                                            href="/products?category=watch"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 text-sm">
                                                ⌚
                                            </span>
                                            <span className="text-xs font-semibold">Đồng hồ thông minh</span>
                                        </Link>

                                        <Link
                                            href="/products?category=gaming"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 text-sm">
                                                🎮
                                            </span>
                                            <span className="text-xs font-semibold">Gaming & Console</span>
                                        </Link>
                                    </div>
                                </div>

                                <Link
                                    href="/products?badge=sale"
                                    className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                                >
                                    <span>Khuyến mãi</span>
                                    <span className="px-1.5 py-0.5 text-[10px] font-black text-white bg-rose-500 rounded-full animate-pulse">
                                        HOT
                                    </span>
                                </Link>

                                <Link
                                    href="/posts"
                                    className={`px-3.5 py-2 rounded-xl transition-colors ${
                                        pathname === "/posts"
                                            ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                            : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    Tin tức
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* ========================================================================== */}
            {/* MOBILE NAVIGATION DRAWER (REACT STATE CHUẨN XÁC, MƯỢT MÀ KHÔNG BỊ LỖI) */}
            {/* ========================================================================== */}
            {/* Backdrop mờ */}
            <div
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer trượt từ bên trái */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-out flex flex-col justify-between overflow-y-auto lg:hidden ${
                    isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                }`}
            >
                <div className="p-5">
                    {/* Header Drawer */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <span className="font-black text-lg text-slate-900 dark:text-white uppercase">
                                TECHNOVA
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                            aria-label="Đóng menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Danh sách điều hướng Mobile */}
                    <div className="py-4 space-y-1 text-sm font-semibold">
                        <Link
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Trang chủ</span>
                        </Link>

                        <Link
                            href="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Tất cả sản phẩm</span>
                        </Link>

                        {/* Nút Giỏ hàng trên Mobile Drawer */}
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleCartNavigation("/cart");
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span>Giỏ hàng của bạn</span>
                            </span>
                            <span className="text-xs bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                                {cartCount}
                            </span>
                        </button>

                        <Link
                            href="/products?badge=sale"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>Khuyến mãi sốc</span>
                            </span>
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                                SALE
                            </span>
                        </Link>

                        <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                            Danh mục nổi bật
                        </div>

                        <Link
                            href="/products?category=phone"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            📱 Điện thoại di động
                        </Link>
                        <Link
                            href="/products?category=laptop"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            💻 Laptop & Macbook
                        </Link>
                        <Link
                            href="/products?category=tablet"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            📲 Máy tính bảng
                        </Link>
                        <Link
                            href="/products?category=headphone"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            🎧 Tai nghe Hi-Res
                        </Link>
                        <Link
                            href="/products?category=watch"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            ⌚ Đồng hồ thông minh
                        </Link>
                        <Link
                            href="/products?category=gaming"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600"
                        >
                            🎮 Máy chơi game & Gear
                        </Link>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800" />
                        <Link
                            href="/posts"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <span>Tin công nghệ</span>
                        </Link>
                    </div>
                </div>

                {/* Footer Drawer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between">
                        {currentUser ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                        {(currentUser.ho_ten || currentUser.name || "U").charAt(0)}
                                    </div>
                                    <span className="max-w-[120px] truncate">
                                        {currentUser.ho_ten || currentUser.name}
                                    </span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 cursor-pointer"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Đăng nhập / Tài khoản</span>
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={handleToggleTheme}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
