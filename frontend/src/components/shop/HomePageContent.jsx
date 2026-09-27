"use client";

import { useEffect } from "react";

export default function HomePageContent() {
    useEffect(() => {
        const data = window.TECHNOVA_DATA;
        const renderProductCard = window.renderProductCard;

        if (!data || typeof renderProductCard !== "function") return;

        const renderProducts = (id, products) => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = products.map(renderProductCard).join("");
            }
        };

        renderProducts(
            "flash-sale-grid",
            data.products.filter((product) => product.isSale).slice(0, 4),
        );
        renderProducts(
            "new-products-grid",
            data.products.filter((product) => product.isNew).slice(0, 8),
        );
        renderProducts(
            "hot-products-grid",
            data.products.filter((product) => product.isHot).slice(0, 8),
        );

        const newsContainer = document.getElementById("home-news-grid");
        if (newsContainer) {
            newsContainer.innerHTML = data.news.slice(0, 3).map((article) => `
                <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div class="aspect-[16/10] overflow-hidden relative">
                        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <span class="absolute top-3 left-3 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg">${article.category}</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                                <span>${article.date}</span><span>•</span><span>${article.readTime}</span>
                            </div>
                            <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                <a href="news-detail.html?id=${article.id}">${article.title}</a>
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">${article.description}</p>
                        </div>
                        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">Bởi ${article.author}</span>
                            <a href="news-detail.html?id=${article.id}" class="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Đọc tiếp &rarr;</a>
                        </div>
                    </div>
                </div>
            `).join("");
        }

        window.lucide?.createIcons();
        window.updateWishlistUI?.();
    }, []);

    return null;
}