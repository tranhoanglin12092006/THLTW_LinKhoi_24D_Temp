"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductList from "@/components/shop/product/ProductList";
import { getNewProducts, getHotProducts, getSaleProducts } from "@/services/productServices";
import TrustBadges from "@/components/shop/TrustBadges";
import CategoryBar from "@/components/shop/CategoryBar";
import NewsSection from "@/components/shop/NewsSection";
import TestimonialSection from "@/components/shop/TestimonialSection";

/**
 * Trang chủ E-commerce TECHNOVA - Nâng cấp toàn diện giao diện & trải nghiệm mua sắm
 * Tích hợp đầy đủ:
 * - Sản phẩm Mới, HOT, SALE từ API Laravel Backend
 * - Khu vực Bài viết / Tin tức công nghệ tĩnh cao cấp
 * - Đồng hồ đếm ngược Flash Sale realtime
 * - Thanh cam kết vàng Trust Badges & Danh mục mua sắm
 * - Hệ thống mã ưu đãi & Đánh giá khách hàng
 */
export default function ShopHomePage() {
    // 1. State quản lý sản phẩm từ API Laravel Backend
    const [newProducts, setNewProducts] = useState([]);
    const [hotProducts, setHotProducts] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. State đồng hồ đếm ngược Flash Sale (Hours, Minutes, Seconds)
    const [timeLeft, setTimeLeft] = useState({
        hours: 8,
        minutes: 45,
        seconds: 30,
    });

    // 3. State copy mã voucher
    const [copiedCoupon, setCopiedCoupon] = useState(false);

    // 4. State Newsletter
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);

    // Hiệu ứng đếm ngược Flash Sale theo thời gian thực
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 12, minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Tải dữ liệu sản phẩm Mới, Hot, Sale từ API Laravel Backend
    useEffect(() => {
        const fetchShopData = async () => {
            setLoading(true);
            try {
                const [newRes, hotRes, saleRes] = await Promise.all([
                    getNewProducts(8),
                    getHotProducts(8),
                    getSaleProducts(8),
                ]);

                setNewProducts(Array.isArray(newRes) ? newRes : []);
                setHotProducts(Array.isArray(hotRes) ? hotRes : []);
                setSaleProducts(Array.isArray(saleRes) ? saleRes : []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm từ API Laravel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, []);

    // Xử lý sao chép mã giảm giá
    const handleCopyCoupon = (code) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code);
            setCopiedCoupon(true);
            setTimeout(() => setCopiedCoupon(false), 2500);
        }
    };

    // Xử lý đăng ký nhận tin
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setNewsletterSuccess(true);
            setNewsletterEmail("");
            setTimeout(() => setNewsletterSuccess(false), 4000);
        }
    };

    return (
        <main className="flex-1 space-y-12 sm:space-y-16 pb-16">
            
            {/* =========================================================================
                1. HERO SHOWCASE SECTION (BANNER ĐẲNG CẤP CÔNG NGHỆ 2026)
            ========================================================================= */}
            <section className="relative overflow-hidden pt-8 pb-14 lg:py-16 bg-gradient-to-b from-blue-50/70 via-slate-50 to-slate-50 dark:from-slate-900/70 dark:via-slate-950 dark:to-slate-950">
                {/* Glow phát sáng nghệ thuật nền */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        
                        {/* Cột Trái: Tiêu đề, slogan và nút kêu gọi mua sắm */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                ✦ TECHNOVA 2026 • FLAGSHIP COLLECTION
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                                Trải nghiệm đỉnh cao <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                    công nghệ tương lai
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                Hệ thống siêu thị thiết bị điện tử & công nghệ cao cấp chính hãng. Cam kết giá tốt nhất mỗi ngày, bảo hành 1 đổi 1 trong 30 ngày và ưu đãi trả góp 0% lãi suất.
                            </p>

                            {/* Cụm Nút Call to Action */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href="/products"
                                    className="px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5 group"
                                >
                                    <span>Khám phá sản phẩm ngay</span>
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                                <a
                                    href="#flash-sale-section"
                                    className="px-7 py-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <span>🔥 Săn Deal Flash Sale</span>
                                </a>
                            </div>

                            {/* Thống kê cam kết */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">50.000+</span>
                                    <span className="text-xs text-slate-500">Khách hàng tin cậy</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">100%</span>
                                    <span className="text-xs text-slate-500">Hàng chính hãng</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-slate-900 dark:text-white">2 Giờ</span>
                                    <span className="text-xs text-slate-500">Giao siêu tốc 2H</span>
                                </div>
                            </div>
                        </div>

                        {/* Cột Phải: Thẻ Showcase Flagship Interactive Card */}
                        <div className="lg:col-span-5">
                            <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl group">
                                <div className="absolute -top-3 -right-3 z-20">
                                    <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/30 animate-bounce">
                                        GIẢM 4.000.000đ
                                    </span>
                                </div>

                                {/* Khối Showcase iPhone 16 Pro Max */}
                                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white text-center relative">
                                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        Siêu Phẩm Nổi Bật 2026
                                    </span>
                                    <h3 className="text-2xl font-black tracking-tight">iPhone 16 Pro Max 256GB</h3>
                                    <p className="text-xs text-slate-300 mt-1">Titanium Sa Mạc • Chip A18 Pro Đột Phá</p>

                                    {/* Hình ảnh flagship */}
                                    <div className="my-6 relative h-48 sm:h-56 flex items-center justify-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                                            alt="iPhone 16 Pro Max"
                                            className="h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Các thông số chip nhanh */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 text-[10px]">
                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                            <span className="block font-bold text-white">Chip A18 Pro</span>
                                            <span className="text-slate-400">Tiến trình 3nm</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                            <span className="block font-bold text-white">Camera 5x</span>
                                            <span className="text-slate-400">Tetraprism Zoom</span>
                                        </div>
                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                                            <span className="block font-bold text-white">Pin 33h</span>
                                            <span className="text-slate-400">Video playback</span>
                                        </div>
                                    </div>

                                    {/* Giá tiền và nút Mua */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <div className="text-left">
                                            <span className="text-xs text-slate-400 line-through block">38.990.000₫</span>
                                            <span className="text-xl font-black text-rose-400">34.990.000₫</span>
                                        </div>
                                        <Link
                                            href="/products"
                                            className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-md"
                                        >
                                            Đặt hàng ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* =========================================================================
                2. THANH CAM KẾT VÀNG (E-COMMERCE TRUST BADGES & GUARANTEES)
            ========================================================================= */}
            <TrustBadges />

            {/* =========================================================================
                3. DANH MỤC MUA SẮM CÔNG NGHỆ NỔI BẬT (CATEGORY BAR)
            ========================================================================= */}
            <CategoryBar />

            {/* =========================================================================
                4. KHU VỰC FLASH SALE & REALTIME COUNTDOWN TIMER (SẢN PHẨM SALE TỪ API)
            ========================================================================= */}
            <section id="flash-sale-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
                <div className="rounded-3xl border border-rose-200/80 dark:border-rose-950/60 bg-gradient-to-b from-rose-50/50 via-white to-white dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
                    {/* Header Flash Sale với Đồng hồ đếm ngược chạy thật */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-rose-100 dark:border-slate-800">
                        <div className="flex items-center gap-3.5">
                            <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 text-2xl animate-pulse">
                                🔥
                            </span>
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                                    <span>CƠ HỘI DUY NHẤT HÔM NAY</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Flash Sale Giảm Giá Sốc
                                </h2>
                            </div>
                        </div>

                        {/* Đồng hồ đếm ngược giờ:phút:giây */}
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                                Kết thúc sau:
                            </span>
                            <div className="flex items-center gap-1.5 font-mono">
                                <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-center min-w-[44px] shadow-sm">
                                    <span className="block text-base sm:text-lg font-black">{String(timeLeft.hours).padStart(2, "0")}</span>
                                    <span className="text-[9px] text-slate-400 block -mt-1 uppercase">Giờ</span>
                                </div>
                                <span className="font-bold text-rose-500 text-lg">:</span>
                                <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 text-center min-w-[44px] shadow-sm">
                                    <span className="block text-base sm:text-lg font-black">{String(timeLeft.minutes).padStart(2, "0")}</span>
                                    <span className="text-[9px] text-slate-400 block -mt-1 uppercase">Phút</span>
                                </div>
                                <span className="font-bold text-rose-500 text-lg">:</span>
                                <div className="bg-rose-600 text-white rounded-xl px-3 py-1.5 text-center min-w-[44px] shadow-sm shadow-rose-500/20">
                                    <span className="block text-base sm:text-lg font-black">{String(timeLeft.seconds).padStart(2, "0")}</span>
                                    <span className="text-[9px] text-rose-200 block -mt-1 uppercase">Giây</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm Sale từ API */}
                    <div className="mt-8">
                        <ProductList
                            title="🏷️ Danh Sách Deal Chớp Nhoáng"
                            subtitle="Sản phẩm giảm giá đặc biệt lấy trực tiếp từ API backend Laravel."
                            products={saleProducts}
                            type="sale"
                            loading={loading}
                        />
                    </div>
                </div>
            </section>

            {/* =========================================================================
                5. SẢN PHẨM MỚI NHẤT (NEW PRODUCTS TỪ API BACKEND LARAVEL)
            ========================================================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductList
                    title="✨ Siêu phẩm công nghệ mới ra mắt"
                    subtitle="Cập nhật những mẫu điện thoại, laptop, phụ kiện thế hệ mới nhất chính hãng."
                    products={newProducts}
                    type="new"
                    loading={loading}
                />
            </div>

            {/* =========================================================================
                6. MEGA PROMOTIONAL BANNER & VOUCHER COPY TRỰC TIẾP
            ========================================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-2xl">
                    <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                            🎉 ĐẠI TIỆC CÔNG NGHỆ THÁNG 10
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            GIẢM THÊM 500.000₫ <br />
                            <span className="text-cyan-300">
                                Áp dụng cho mọi đơn hàng từ 5 triệu
                            </span>
                        </h2>
                        <p className="text-sm text-blue-100 max-w-lg leading-relaxed">
                            Nhập mã ưu đãi độc quyền bên dưới khi thanh toán để nhận ngay voucher trừ trực tiếp vào đơn hàng. Số lượng có hạn!
                        </p>

                        {/* Box sao chép mã coupon tiện lợi */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="flex items-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md px-4 py-2 text-white font-mono text-base font-bold tracking-wider">
                                <span>TECHNOVA500K</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopyCoupon("TECHNOVA500K")}
                                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
                            >
                                {copiedCoupon ? (
                                    <>
                                        <span className="text-emerald-600 font-bold">✓ Đã sao chép!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>📋 Sao chép mã</span>
                                    </>
                                )}
                            </button>
                            <Link
                                href="/products"
                                className="px-5 py-3 rounded-2xl bg-indigo-900/60 hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
                            >
                                Mua sắm áp mã →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================================
                7. SẢN PHẨM NỔI BẬT / BÁN CHẠY (HOT PRODUCTS TỪ API BACKEND LARAVEL)
            ========================================================================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProductList
                    title="⚡ Top Sản Phẩm Bán Chạy Nhất (HOT)"
                    subtitle="Các thiết bị được đông đảo người dùng đánh giá 5 sao và tin dùng."
                    products={hotProducts}
                    type="hot"
                    loading={loading}
                />
            </div>

            {/* =========================================================================
                8. ĐỐI TÁC THƯƠNG HIỆU TOÀN CẦU CHÍNH HÃNG
            ========================================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                        Đối tác thương hiệu toàn cầu phân phối chính hãng
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
                        {[
                            { name: "Apple", desc: "Đại lý ủy quyền" },
                            { name: "Samsung", desc: "Flagship Store" },
                            { name: "Sony", desc: "Official Dealer" },
                            { name: "ASUS", desc: "ROG Partner" },
                            { name: "Dell", desc: "Premium Partner" },
                            { name: "HP", desc: "Authorized" },
                            { name: "Lenovo", desc: "Legion Partner" },
                            { name: "Xiaomi", desc: "Official Store" },
                        ].map((b, idx) => (
                            <Link
                                key={idx}
                                href="/products"
                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all text-center group cursor-pointer"
                            >
                                <h4 className="font-black text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors text-sm">
                                    {b.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {b.desc}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================================
                9. PHẦN BÀI VIẾT / TIN TỨC TĨNH (STATIC NEWS & TECH REVIEWS)
            ========================================================================= */}
            <NewsSection />

            {/* =========================================================================
                10. ĐÁNH GIÁ CỦA KHÁCH HÀNG (CUSTOMER TESTIMONIALS & REVIEWS)
            ========================================================================= */}
            <TestimonialSection />

            {/* =========================================================================
                11. ĐĂNG KÝ NHẬN TIN & NHẬN VOUCHER 500K (NEWSLETTER VIP)
            ========================================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-blue-200/80 dark:border-slate-800 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center text-xl shadow-inner">
                            ✉️
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Đăng ký nhận tin công nghệ & Voucher VIP
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Nhận ngay thông báo khi có đợt Flash Sale, mã giảm giá độc quyền 500.000₫ cho khách hàng mới và bài đánh giá thiết bị sớm nhất.
                        </p>

                        {/* Form email */}
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                            <input
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Nhập email của bạn..."
                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all whitespace-nowrap active:scale-95 shadow-lg shadow-blue-600/30"
                            >
                                Đăng ký ngay
                            </button>
                        </form>

                        {newsletterSuccess && (
                            <p className="text-xs text-emerald-400 font-bold animate-fadeIn">
                                ✓ Cảm ơn bạn! Mã voucher 500k đã được gửi tới hòm thư của bạn.
                            </p>
                        )}
                    </div>
                </div>
            </section>

        </main>
    );
}