"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";

// Dữ liệu sản phẩm tĩnh mẫu (Static Mock Data)
const INITIAL_CART_ITEMS = [
    {
        id: 1,
        name: "iPhone 16 Pro Max 256GB - Titan Sa Mạc Chính Hãng VN/A",
        category: "Điện thoại",
        slug: "iphone-16-pro-max-256gb",
        price: 34990000,
        originalPrice: 36990000,
        imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80",
        quantity: 1,
        selected: true,
    },
    {
        id: 2,
        name: "Tai nghe không dây Sony WH-1000XM5 Chống ồn chủ động ANC",
        category: "Âm thanh",
        slug: "tai-nghe-sony-wh-1000xm5",
        price: 7490000,
        originalPrice: 8490000,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
        quantity: 1,
        selected: true,
    },
    {
        id: 3,
        name: "Bàn phím cơ không dây Logitech MX Mechanical Wireless Tactile",
        category: "Phụ kiện",
        slug: "ban-phim-logitech-mx-mechanical",
        price: 3290000,
        originalPrice: 3890000,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
        quantity: 2,
        selected: true,
    },
];

export default function Cart() {
    // Trạng thái tĩnh tại client (không phụ thuộc LocalStorage hay API, hiển thị ngay lập tức)
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
    const [couponCode, setCouponCode] = useState("TECHNOVA");
    const [isCouponApplied, setIsCouponApplied] = useState(true);

    // Tăng / giảm số lượng tĩnh
    const handleUpdateQuantity = (id, delta) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    // Xóa một món đồ tĩnh
    const handleRemoveItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Chọn / bỏ chọn món đồ tĩnh
    const handleToggleSelect = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    // Chọn / bỏ chọn tất cả
    const isAllSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);
    const handleToggleSelectAll = () => {
        const nextState = !isAllSelected;
        setCartItems((prev) => prev.map((item) => ({ ...item, selected: nextState })));
    };

    // Xóa toàn bộ giỏ hàng tĩnh
    const handleClearCart = () => {
        setCartItems([]);
    };

    // Khôi phục lại dữ liệu mẫu tĩnh
    const handleResetMockCart = () => {
        setCartItems(INITIAL_CART_ITEMS);
        setIsCouponApplied(true);
    };

    // Tính toán số tiền tĩnh
    const selectedItems = cartItems.filter((item) => item.selected);
    const totalSelectedQty = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = isCouponApplied && subtotal > 0 ? 1000000 : 0;
    const shippingFee = subtotal >= 500000 || selectedItems.length === 0 ? 0 : 30000;
    const grandTotal = Math.max(0, subtotal - discount + shippingFee);

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
                    Giỏ hàng
                </span>
            </nav>

            {/* =========================================================
                2. TIÊU ĐỀ TRANG
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span>Giỏ hàng</span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                            {cartItems.length} sản phẩm
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kiểm tra danh sách sản phẩm, số lượng và tổng thanh toán của bạn
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Xóa toàn bộ giỏ hàng
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleResetMockCart}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                    >
                        ↺ Nạp lại 3 sản phẩm mẫu
                    </button>
                )}
            </div>

            {/* =========================================================
                3. NỘI DUNG TĨNH CỦA GIỎ HÀNG
            ========================================================= */}
            {cartItems.length === 0 ? (
                /* Giao diện khi giỏ hàng trống */
                <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Giỏ hàng của bạn đang trống!
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Hãy tiếp tục khám phá các thiết bị công nghệ chính hãng với giá ưu đãi hôm nay!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
                        >
                            Khám phá sản phẩm
                        </Link>
                        <button
                            type="button"
                            onClick={handleResetMockCart}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            ↺ Hiển thị sản phẩm mẫu
                        </button>
                    </div>
                </div>
            ) : (
                /* Bảng giỏ hàng tĩnh hiển thị ngay lập tức */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Cột trái: Danh sách sản phẩm (8 cột) */}
                    <div className="lg:col-span-8 space-y-5">
                        
                        {/* Banner Miễn phí vận chuyển */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                <span className="text-base">🚀</span>
                                <span>
                                    Đơn hàng của bạn đã đủ điều kiện <strong>Miễn phí vận chuyển toàn quốc</strong>!
                                </span>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Đạt 100%
                            </span>
                        </div>

                        {/* Thẻ bảng sản phẩm */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
                            
                            {/* Tiêu đề bảng */}
                            <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 items-center">
                                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleToggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        title="Chọn tất cả"
                                    />
                                    <span>Sản phẩm ({cartItems.length})</span>
                                </div>
                                <div className="hidden sm:block sm:col-span-2 text-center">Đơn giá</div>
                                <div className="hidden sm:block sm:col-span-2 text-center">Số lượng</div>
                                <div className="hidden sm:block sm:col-span-2 text-right">Tổng phụ</div>
                            </div>

                            {/* Danh sách từng món */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {cartItems.map((item) => {
                                    const itemTotal = item.price * item.quantity;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`py-4 transition-colors rounded-2xl ${
                                                item.selected ? "bg-transparent" : "opacity-50"
                                            }`}
                                        >
                                            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                                                
                                                {/* Cột sản phẩm */}
                                                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!item.selected}
                                                        onChange={() => handleToggleSelect(item.id)}
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    />

                                                    {/* Ảnh sản phẩm */}
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 p-1.5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                    {/* Tên & danh mục */}
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                            {item.category}
                                                        </span>
                                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                                                            {item.name}
                                                        </h3>

                                                        {/* Đơn giá mobile */}
                                                        <div className="sm:hidden flex items-center gap-2 pt-0.5">
                                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                                {formatCurrency(item.price)}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 line-through">
                                                                {formatCurrency(item.originalPrice)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Đơn giá desktop */}
                                                <div className="hidden sm:block sm:col-span-2 text-center">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(item.price)}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 line-through">
                                                        {formatCurrency(item.originalPrice)}
                                                    </div>
                                                </div>

                                                {/* Bộ số lượng */}
                                                <div className="col-span-6 sm:col-span-2 flex items-center justify-start sm:justify-center gap-1.5">
                                                    <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-xs font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tổng tiền món */}
                                                <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-3 text-right">
                                                    <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(itemTotal)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Thanh điều hướng */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                            >
                                ← Tiếp tục mua sắm các thiết bị khác
                            </Link>

                            <span className="text-xs text-slate-400">
                                Đã chọn: <strong className="text-slate-900 dark:text-white">{totalSelectedQty}</strong> sản phẩm
                            </span>
                        </div>

                        {/* Huy hiệu chính sách */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-emerald-500 text-lg">🛡️</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Chính Hãng 100%</h4>
                                    <p className="text-[11px] text-slate-400">Bảo hành 12 tháng</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-blue-500 text-lg">⚡</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Giao Hàng Siêu Tốc</h4>
                                    <p className="text-[11px] text-slate-400">Nhận trong 24h - 48h</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-purple-500 text-lg">↺</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Đổi Trả 15 Ngày</h4>
                                    <p className="text-[11px] text-slate-400">Miễn phí đổi mới</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng tĩnh (4 cột) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 sticky top-28">
                            
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span>Tóm tắt đơn hàng</span>
                                <span className="text-xs font-normal text-slate-400">
                                    {selectedItems.length} mục chọn
                                </span>
                            </h3>

                            {/* Bảng chi tiết giá tiền */}
                            <div className="space-y-3 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Tạm tính ({totalSelectedQty} món)</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                                        <span className="inline-flex items-center gap-1.5 font-medium">
                                            <span>Mã giảm giá ({couponCode})</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsCouponApplied(false)}
                                                className="text-slate-400 hover:text-rose-500 font-bold text-xs"
                                                title="Bỏ mã"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                        <span className="font-bold">
                                            -{formatCurrency(discount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-emerald-500 font-bold uppercase text-xs">
                                        Miễn phí
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                        Tổng thanh toán
                                    </span>
                                    <div className="text-right">
                                        <div className="font-black text-xl sm:text-2xl text-blue-600 dark:text-blue-400">
                                            {formatCurrency(grandTotal)}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            (Đã bao gồm VAT)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ô Voucher tĩnh */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Mã ưu đãi / Voucher
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã ưu đãi..."
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs uppercase font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsCouponApplied(true)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                    >
                                        Áp dụng
                                    </button>
                                </div>

                                {isCouponApplied && (
                                    <div className="text-[11px] p-2 rounded-xl flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                        <span>✓</span>
                                        <span>Đã áp dụng mã {couponCode}: Giảm 1.000.000₫</span>
                                    </div>
                                )}
                            </div>

                            {/* Nút Thanh toán tĩnh */}
                            <button
                                type="button"
                                onClick={() => {
                                    alert(`Xác nhận đơn hàng mẫu với tổng thanh toán: ${formatCurrency(grandTotal)}`);
                                }}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center block shadow-xl shadow-blue-500/25 transition-all active:scale-95 text-sm"
                            >
                                Tiến hành thanh toán ({formatCurrency(grandTotal)}) →
                            </button>

                            {/* Bảo mật */}
                            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    Bảo mật giao dịch chuẩn mã hóa SSL 256-bit
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </main>
    );
}