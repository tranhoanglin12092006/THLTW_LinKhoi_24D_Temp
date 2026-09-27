"use client";

import { useEffect } from "react";

export default function Products() {
    useEffect(() => {
        const products = window.TECHNOVA_DATA?.products;
        const renderProductCard = window.renderProductCard;
        const productGrid = document.getElementById("shop-product-grid");

        if (!products || typeof renderProductCard !== "function" || !productGrid) return;

        productGrid.innerHTML = products.map(renderProductCard).join("");

        const productCount = document.getElementById("product-count-label");
        if (productCount) {
            productCount.textContent = `Hiển thị ${products.length} sản phẩm chính hãng`;
        }

        window.lucide?.createIcons();
        window.updateWishlistUI?.();
    }, []);

    return (
        <>
            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <a
                        href="index.html"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Trang chủ
                    </a>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                        Cửa hàng
                    </span>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ========================================== */}
                    {/* SIDEBAR FILTERS */}
                    {/* ========================================== */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <i
                                        data-lucide="sliders-horizontal"
                                        className="w-4 h-4 text-blue-600"
                                    />{" "}
                                    Bộ lọc sản phẩm
                                </h3>
                                <button
                                    onclick="resetFilters()"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Xóa lọc
                                </button>
                            </div>
                            {/* Category Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Danh mục
                                </h4>
                                <div className="space-y-1.5 text-xs" id="category-filter-list">
                                    <button
                                        onclick="setFilter('category', 'all')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                                        data-cat="all"
                                    >
                                        <span>Tất cả danh mục</span>
                                        <span className="text-[11px] opacity-75">24</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'phone')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="phone"
                                    >
                                        <span>📱 Điện thoại</span>
                                        <span className="text-[11px] opacity-75">4</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'laptop')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="laptop"
                                    >
                                        <span>💻 Laptop</span>
                                        <span className="text-[11px] opacity-75">4</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'tablet')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="tablet"
                                    >
                                        <span>📲 Máy tính bảng</span>
                                        <span className="text-[11px] opacity-75">2</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'headphone')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="headphone"
                                    >
                                        <span>🎧 Tai nghe</span>
                                        <span className="text-[11px] opacity-75">3</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'watch')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="watch"
                                    >
                                        <span>⌚ Đồng hồ</span>
                                        <span className="text-[11px] opacity-75">2</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'gaming')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="gaming"
                                    >
                                        <span>🎮 Gaming Gear</span>
                                        <span className="text-[11px] opacity-75">3</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'camera')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="camera"
                                    >
                                        <span>📷 Camera &amp; Lens</span>
                                        <span className="text-[11px] opacity-75">3</span>
                                    </button>
                                    <button
                                        onclick="setFilter('category', 'accessories')"
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="accessories"
                                    >
                                        <span>🔌 Phụ kiện</span>
                                        <span className="text-[11px] opacity-75">3</span>
                                    </button>
                                </div>
                            </div>
                            {/* Price Range Filter */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Khoảng giá
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            defaultValue="all"
                                            defaultChecked=""
                                            onchange="setPriceFilter('all')"
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Tất cả mức giá</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            defaultValue="0-5"
                                            onchange="setPriceFilter('0-5')"
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Dưới 5 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            defaultValue="5-15"
                                            onchange="setPriceFilter('5-15')"
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Từ 5 - 15 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            defaultValue="15-30"
                                            onchange="setPriceFilter('15-30')"
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Từ 15 - 30 triệu</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            defaultValue="30+"
                                            onchange="setPriceFilter('30+')"
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>Trên 30 triệu</span>
                                    </label>
                                </div>
                            </div>
                            {/* Brand Filter */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Thương hiệu
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <button
                                        onclick="setBrandFilter('all')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                                        data-brand="all"
                                    >
                                        Tất cả
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Apple')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Apple"
                                    >
                                        Apple
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Samsung')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Samsung"
                                    >
                                        Samsung
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Sony')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Sony"
                                    >
                                        Sony
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Asus')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Asus"
                                    >
                                        ASUS
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Dell')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Dell"
                                    >
                                        Dell
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Lenovo')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Lenovo"
                                    >
                                        Lenovo
                                    </button>
                                    <button
                                        onclick="setBrandFilter('Xiaomi')"
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Xiaomi"
                                    >
                                        Xiaomi
                                    </button>
                                </div>
                            </div>
                            {/* Rating Filter */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Đánh giá
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <button
                                        onclick="setRatingFilter(5)"
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★★★{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                5 sao
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        onclick="setRatingFilter(4)"
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★★☆{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                Từ 4 sao
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        onclick="setRatingFilter(3)"
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★☆☆{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                Từ 3 sao
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                    {/* ========================================== */}
                    {/* PRODUCT GRID & SORT TOP BAR */}
                    {/* ========================================== */}
                    <section className="lg:col-span-3 space-y-6">
                        {/* Top Toolbar: Product count & Sort */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                            <div>
                                <h1
                                    className="text-lg font-bold text-slate-900 dark:text-white"
                                    id="shop-title"
                                >
                                    Tất cả sản phẩm
                                </h1>
                                <p
                                    className="text-xs text-slate-500 mt-0.5"
                                    id="product-count-label"
                                >
                                    Hiển thị 24 sản phẩm chính hãng
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    Sắp xếp theo:
                                </span>
                                <select
                                    id="sort-select"
                                    onchange="applySorting(this.value)"
                                    className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="default">Mới nhất (Mặc định)</option>
                                    <option value="price-asc">Giá: Thấp → Cao</option>
                                    <option value="price-desc">Giá: Cao → Thấp</option>
                                    <option value="rating-desc">Đánh giá cao nhất</option>
                                    <option value="sales-desc">Bán chạy nhất</option>
                                </select>
                            </div>
                        </div>
                        {/* Products Grid Container */}
                        <div
                            id="shop-product-grid"
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[400px]"
                        >
                            {/* Populated by JS */}
                        </div>
                        {/* Empty State (Hidden by default) */}
                        <div
                            id="shop-empty-state"
                            className="hidden text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
                                <i data-lucide="package-search" className="w-8 h-8" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Không tìm thấy sản phẩm phù hợp
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm với từ khóa khác.
                            </p>
                            <button
                                onclick="resetFilters()"
                                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                            >
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                        {/* Pagination */}
                        <div
                            className="flex items-center justify-center gap-2 pt-6 pb-2"
                            id="shop-pagination"
                        >
                            <button className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                ← Trước
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs">
                                1
                            </button>
                            <button className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800">
                                2
                            </button>
                            <button className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                Sau →
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>


    );
}
