"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { resolveProductImage, isFallbackImage, FALLBACK_PRODUCT_IMAGE } from "@/utils/productImage";

export default function MiniCartDropdown({
    isOpen,
    onClose,
    cartItems = [],
    onRemoveItem,
    totalPrice = 0,
    totalCount = 0,
    justAddedItem = null,
    onNavigate,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="absolute right-0 top-full mt-3 w-[360px] sm:w-[410px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden transform transition-all duration-200 animate-mini-cart origin-top-right text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Mũi tên Caret nhỏ chỉ lên trên kết nối với nút Giỏ hàng */}
            <div className="absolute -top-1.5 right-7 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-t border-l border-slate-200/90 dark:border-slate-800 rotate-45 z-10" />

            {/* Header của Mini Cart */}
            <div className="relative px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Giỏ hàng của bạn
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300">
                        {totalCount} món
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    title="Đóng xem nhanh"
                    aria-label="Đóng"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Banner nhỏ thông báo khi người dùng vừa thêm sản phẩm */}
            {justAddedItem && (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-100 dark:border-emerald-900/50 px-4 py-2 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="truncate">
                        Đã thêm <strong className="font-bold">&ldquo;{justAddedItem.name}&rdquo;</strong> vào giỏ!
                    </span>
                </div>
            )}

            {/* Danh sách các sản phẩm trong giỏ hàng */}
            {cartItems.length === 0 ? (
                /* Empty state khi chưa có sản phẩm nào */
                <div className="py-10 px-6 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        Giỏ hàng của bạn đang trống
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
                        Hãy chọn thêm sản phẩm công nghệ yêu thích của bạn nhé!
                    </p>
                    <Link
                        href="/products"
                        onClick={onClose}
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 inline-flex items-center gap-1.5"
                    >
                        <span>Khám phá sản phẩm ngay</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            ) : (
                /* Có sản phẩm: Danh sách cuộn mượt mà */
                <div className="max-h-[330px] overflow-y-auto mini-cart-scroll divide-y divide-slate-100 dark:divide-slate-800/80 px-2">
                    {cartItems.map((item, idx) => {
                        const itemId = item.id || item.productId || idx;
                        const itemUrl = `/products/${item.slug || item.id || item.productId}`;
                        const imgUrl = resolveProductImage(item.imageUrl || item.image || item.hinh_anh_url || item.hinh_anh);
                        const hasImg = imgUrl && !isFallbackImage(imgUrl);
                        const isJustAdded = justAddedItem && (String(justAddedItem.id || justAddedItem.productId) === String(itemId));

                        return (
                            <div
                                key={itemId}
                                className={`p-2.5 flex items-center gap-3 rounded-xl transition-all duration-200 group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                    isJustAdded ? "bg-blue-50/70 dark:bg-blue-950/40" : ""
                                }`}
                            >
                                {/* Ảnh sản phẩm */}
                                <Link
                                    href={itemUrl}
                                    onClick={onClose}
                                    className="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-1 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform"
                                    title={item.name}
                                >
                                    {hasImg ? (
                                        <img
                                            src={imgUrl}
                                            alt={item.name || "Sản phẩm"}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                        </div>
                                    )}
                                </Link>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 min-w-0 pr-1">
                                    <Link
                                        href={itemUrl}
                                        onClick={onClose}
                                        title={item.name}
                                        className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug"
                                    >
                                        {item.name}
                                    </Link>

                                    <div className="flex items-center justify-between mt-1.5">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(item.price)}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                × {item.quantity}
                                            </span>
                                        </div>

                                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                                            {formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}
                                        </span>
                                    </div>
                                </div>

                                {/* Nút xóa nhanh khỏi giỏ */}
                                <button
                                    type="button"
                                    onClick={() => onRemoveItem && onRemoveItem(itemId, item.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                                    title="Xóa khỏi giỏ hàng"
                                    aria-label={`Xóa ${item.name}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Footer của Mini Cart khi có sản phẩm */}
            {cartItems.length > 0 && (
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
                    {/* Tổng cộng */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                            Tổng tiền tạm tính:
                        </span>
                        <span className="text-base font-extrabold text-rose-600 dark:text-rose-400">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>

                    {/* Các nút hành động */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate("/cart")}
                            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                            </svg>
                            <span>Xem giỏ hàng</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onNavigate && onNavigate("/cart?checkout=1")}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                        >
                            <span>Thanh toán</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
