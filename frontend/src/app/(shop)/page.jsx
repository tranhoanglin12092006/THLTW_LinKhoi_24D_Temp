"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductList from "@/components/shop/product/ProductList";
import { getNewProducts, getHotProducts, getSaleProducts } from "@/services/productServices";

/**
 * Trang chủ Shop (Trang mua sắm)
 * Bám sát cấu trúc folder tranhoanglin-frontend
 * Lấy dữ liệu sản phẩm MỚI, sản phẩm HOT, sản phẩm SALE từ API Laravel Backend
 */
export default function ShopHomePage() {
    // State lưu trữ dữ liệu sản phẩm từ API
    const [newProducts, setNewProducts] = useState([]);
    const [hotProducts, setHotProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect gọi API khi component xuất hiện trên màn hình
    useEffect(() => {
        const fetchShopData = async () => {
            setLoading(true);
            try {
                // Gọi song song 3 API lấy sản phẩm mới, sale và hot
                const [newRes, hotRes, saleRes] = await Promise.all([
                    getNewProducts(4),
                    getHotProducts(4),
                    getSaleProducts(4),
                ]);

                setNewProducts(Array.isArray(newRes) ? newRes : []);
                setHotProducts(Array.isArray(hotRes) ? hotRes : []);
                setSaleProducts(Array.isArray(saleRes) ? saleRes : []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm từ API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, []);

    return (
        <main className="flex-1 space-y-12 sm:space-y-16 pb-16">
            
            {/* =========================================================
                1. HERO SECTION (BANNER ĐẦU TRANG)
            ========================================================= */}
            <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Nội dung bên trái */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                CÔNG NGHỆ MỚI NHẤT 2026
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                                Khám phá thế giới <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                    công nghệ tương lai
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                Thiết bị công nghệ chính hãng - Giá tốt mỗi ngày. Trải nghiệm hệ
                                sinh thái thông minh đỉnh cao với chế độ bảo hành 1 đổi 1 và ưu
                                đãi trả góp 0%.
                            </p>

                            {/* Nút Call To Action */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href="/products"
                                    className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                >
                                    Mua sắm ngay →
                                </Link>
                                <a
                                    href="#sale-section"
                                    className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-0.5"
                                >
                                    Xem khuyến mãi
                                </a>
                            </div>

                            {/* 3 cam kết nhỏ */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">100%</span>
                                    <span className="text-xs text-slate-500">Chính hãng</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">24/7</span>
                                    <span className="text-xs text-slate-500">Hỗ trợ kỹ thuật</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">Miễn phí</span>
                                    <span className="text-xs text-slate-500">Giao toàn quốc</span>
                                </div>
                            </div>
                        </div>

                        {/* Banner bên phải */}
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 p-8 text-white text-center">
                                    <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-200">Ưu đãi giới hạn</span>
                                    <h3 className="text-3xl font-black mt-2">GIẢM ĐẾN 30%</h3>
                                    <p className="text-xs text-indigo-100 mt-2">Dành cho các đơn hàng thiết bị cao cấp hôm nay</p>
                                    <div className="mt-6">
                                        <Link href="/products" className="inline-block px-5 py-2.5 rounded-full bg-white text-indigo-900 text-xs font-bold shadow-md hover:bg-indigo-50 transition-colors">
                                            Khám phá bộ sưu tập
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                2. SẢN PHẨM MỚI (NEW PRODUCTS) TỪ API LARAVEL
            ========================================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductList
                    title="✨ Sản phẩm mới nhất"
                    subtitle="Những sản phẩm công nghệ vừa cập nhật tại hệ thống TECHNOVA."
                    products={newProducts}
                    type="new"
                    loading={loading}
                />
            </div>

            {/* =========================================================
                3. SẢN PHẨM NỔI BẬT / BÁN CHẠY (HOT PRODUCTS) TỪ API LARAVEL
            ========================================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductList
                    title="🔥 Sản phẩm nổi bật (HOT)"
                    subtitle="Các thiết bị được nhiều khách hàng yêu thích và săn đón nhất."
                    products={hotProducts}
                    type="hot"
                    loading={loading}
                />
            </div>

            {/* =========================================================
                4. SẢN PHẨM ĐANG GIẢM GIÁ (SALE PRODUCTS) TỪ API LARAVEL
            ========================================================= */}
            <div id="sale-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <ProductList
                    title="🏷️ Đang giảm giá (SALE)"
                    subtitle="Cơ hội sở hữu thiết bị điện tử chính hãng với mức giá ưu đãi hấp dẫn."
                    products={saleProducts}
                    type="sale"
                    loading={loading}
                />
            </div>

            {/* =========================================================
                5. PROMOTION BANNER GIỮA TRANG
            ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                            ĐẠI TIỆC CÔNG NGHỆ 2026
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            SALE LÊN ĐẾN 50% <br />
                            <span className="text-cyan-300">
                                Ưu đãi công nghệ không thể bỏ lỡ
                            </span>
                        </h2>
                        <p className="text-sm text-blue-100 max-w-lg leading-relaxed">
                            Nâng cấp dàn thiết bị của bạn với voucher giảm sốc 1.000.000đ và
                            quà tặng trị giá lên tới 3.000.000đ khi đặt mua trong tuần này.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-blue-700 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                Mua ngay hôm nay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                6. ĐỐI TÁC THƯƠNG HIỆU HÀNG ĐẦU
            ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Đối tác thương hiệu toàn cầu chính hãng
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
                        {["Apple", "Samsung", "Sony", "ASUS", "Dell", "HP", "Lenovo", "Xiaomi"].map((brand) => (
                            <div
                                key={brand}
                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-sm cursor-pointer"
                            >
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}