"use client";

import { useEffect } from "react";

export default function Products() {
    useEffect(() => {
        window.initializeShopRoute?.();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div id="shop-breadcrumb" />
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar (desktop) */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl2 border border-slate-100 dark:border-slate-700 p-5 sticky top-24">
                        <div id="shop-sidebar" />
                    </div>
                </aside>
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                Tất cả sản phẩm
                            </h1>
                            <p id="shop-count" className="text-sm text-slate-400 mt-0.5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                id="filter-mobile-btn"
                                className="lg:hidden flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-lg text-sm"
                            />
                            <select
                                onchange="shopState.sort=this.value; renderShopPage()"
                                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="bestseller">Bán chạy</option>
                                <option value="priceAsc">Giá thấp → cao</option>
                                <option value="priceDesc">Giá cao → thấp</option>
                                <option value="rating">Đánh giá cao</option>
                            </select>
                        </div>
                    </div>
                    <div id="shop-grid" />
                    <div
                        id="shop-pagination"
                        className="flex items-center justify-center gap-2 mt-10"
                    />
                </div>
            </div>
        </main>

    );
}
<div id="filter-drawer" class="hidden fixed inset-0 z-50 lg:hidden">
    <div class="absolute inset-0 bg-black/40" onclick="document.getElementById('filter-drawer').classList.add('hidden')"></div>
    <div class="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white dark:bg-slate-900 p-5 overflow-y-auto">
        <div class="flex items-center justify-between mb-5"><span class="font-semibold">Bộ lọc</span><button onclick="document.getElementById('filter-drawer').classList.add('hidden')">✕</button></div>
        <div id="shop-sidebar-mobile"></div>
    </div>
</div>