import HomePageContent from "@/components/shop/HomePageContent";

export default function Home() {
    return (
        <>
            {/* MAIN CONTENT */}
            {/* ========================================================================== */}
            <main className="flex-1">
                {/* ========================================== */}
                {/* 1. HERO SECTION */}
                {/* ========================================== */}
                <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
                    {/* Decorative Glow Circles */}
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Hero Content */}
                            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                                    <i
                                        data-lucide="zap"
                                        className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                                    />
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
                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                    <a
                                        href="shop.html"
                                        className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                    >
                                        <i data-lucide="shopping-bag" className="w-4 h-4" /> Mua ngay
                                    </a>
                                    <a
                                        href="#categories"
                                        className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="compass"
                                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                        />{" "}
                                        Khám phá sản phẩm
                                    </a>
                                </div>
                                {/* Mini Highlights Counter */}
                                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                                    <div>
                                        <span className="block text-2xl font-black text-slate-900 dark:text-white">
                                            100%
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Chính hãng ủy quyền
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-black text-slate-900 dark:text-white">
                                            24/7
                                        </span>
                                        <span className="text-xs text-slate-500">Hỗ trợ kỹ thuật</span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-black text-slate-900 dark:text-white">
                                            50K+
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Khách hàng tin chọn
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Right Hero Showcase Visual with Floating Cards */}
                            <div className="lg:col-span-5 relative flex justify-center">
                                <div className="relative w-full max-w-md lg:max-w-none aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600/20 to-cyan-500/10 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 flex items-center justify-center">
                                    <img
                                        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                                        alt="MacBook & High Tech Devices"
                                        className="w-full h-full object-cover rounded-2xl shadow-inner"
                                    />
                                    {/* Floating Card 1: Free Shipping */}
                                    <div className="absolute -top-3 -left-3 sm:top-6 sm:left-4 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 animate-pulse-subtle">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                                            <i data-lucide="truck" className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Free Shipping
                                            </h4>
                                            <p className="text-[11px] text-slate-500">Đơn từ 500.000đ</p>
                                        </div>
                                    </div>
                                    {/* Floating Card 2: 100% Chính Hãng */}
                                    <div className="absolute -bottom-3 -right-3 sm:bottom-6 sm:right-4 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                                            <i data-lucide="shield-check" className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                100% Chính Hãng
                                            </h4>
                                            <p className="text-[11px] text-slate-500">
                                                Bảo hành Apple, Sony...
                                            </p>
                                        </div>
                                    </div>
                                    {/* Floating Card 3: 30 Ngày Đổi Trả */}
                                    <div className="hidden sm:flex absolute bottom-24 -left-4 p-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                                            <i data-lucide="refresh-cw" className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                                            Đổi trả 30 ngày
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 2. FEATURES SECTION (4 CARDS) */}
                {/* ========================================== */}
                <section className="py-10 border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 transition-all hover:border-blue-500/40">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    <i data-lucide="truck" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Miễn phí vận chuyển
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Cho đơn hàng từ 500.000đ
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 transition-all hover:border-emerald-500/40">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                    <i data-lucide="shield-check" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Sản phẩm chính hãng
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Cam kết 100% xuất xứ rõ ràng
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 transition-all hover:border-purple-500/40">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                                    <i data-lucide="rotate-ccw" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Đổi trả dễ dàng
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        1 đổi 1 trong vòng 30 ngày
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 transition-all hover:border-cyan-500/40">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                                    <i data-lucide="headphones" className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Hỗ trợ 24/7
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Tư vấn kỹ thuật chuyên sâu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 3. CATEGORIES SECTION */}
                {/* ========================================== */}
                <section id="categories" className="py-16 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Danh mục hàng đầu
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Mua sắm theo danh mục
                                </h2>
                            </div>
                            <a
                                href="shop.html"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
                            >
                                Xem tất cả danh mục →
                            </a>
                        </div>
                        {/* 8 Categories Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            <a
                                href="shop.html?category=phone"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="smartphone" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Điện thoại
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">42 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=laptop"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="laptop" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Laptop
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">36 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=tablet"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="tablet" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Tablet
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">24 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=headphone"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="headphones" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Tai nghe
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">58 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=watch"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="watch" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Đồng hồ
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">31 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=gaming"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="gamepad-2" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Gaming Gear
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">45 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=camera"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="camera" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Camera
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">19 sản phẩm</p>
                            </a>
                            <a
                                href="shop.html?category=accessories"
                                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                    <i data-lucide="plug" className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    Phụ kiện
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">67 sản phẩm</p>
                            </a>
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 4. FLASH SALE / DEAL GIẢM SỐC SECTION */}
                {/* ========================================== */}
                <section className="py-16 bg-gradient-to-r from-rose-900/20 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        {/* Section Header with Countdown */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center">
                                    <i data-lucide="flame" className="w-6 h-6" />
                                </span>
                                <div>
                                    <span className="text-xs font-bold text-rose-400 tracking-wider uppercase">
                                        Cơ hội duy nhất trong ngày
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                                        Deal giảm giá sốc - Flash Sale
                                    </h2>
                                </div>
                            </div>
                            {/* Countdown Timer */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 mr-2 font-medium">
                                    Kết thúc sau:
                                </span>
                                <div className="flex items-center gap-1.5 font-mono text-center">
                                    <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5">
                                        <span
                                            id="sale-hours"
                                            className="block text-lg font-bold text-white"
                                        >
                                            08
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase">Giờ</span>
                                    </div>
                                    <span className="font-bold text-rose-500 text-lg">:</span>
                                    <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5">
                                        <span
                                            id="sale-minutes"
                                            className="block text-lg font-bold text-white"
                                        >
                                            45
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase">
                                            Phút
                                        </span>
                                    </div>
                                    <span className="font-bold text-rose-500 text-lg">:</span>
                                    <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5">
                                        <span
                                            id="sale-seconds"
                                            className="block text-lg font-bold text-rose-400"
                                        >
                                            30
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase">
                                            Giây
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Flash Sale Products Grid (Loaded dynamically from data.js) */}
                        <div
                            id="flash-sale-grid"
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8"
                        >
                            {/* Populated by JS */}
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 5. NEW PRODUCTS SECTION */}
                {/* ========================================== */}
                <section className="py-16 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Cập nhật liên tục
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Sản phẩm mới
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Những siêu phẩm công nghệ vừa ra mắt chính hãng
                                </p>
                            </div>
                            <a
                                href="shop.html?badge=new"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
                            >
                                Xem tất cả sản phẩm mới →
                            </a>
                        </div>
                        {/* New Products Grid */}
                        <div
                            id="new-products-grid"
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                        >
                            {/* Populated by JS */}
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 6. PROMOTION BANNER */}
                {/* ========================================== */}
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
                            {/* Background Art Glow */}
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative z-10 max-w-2xl space-y-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                                    ĐẠI TIỆC CÔNG NGHỆ 2026
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                                    SALE LÊN ĐẾN 50% <br />
                                    <span className="text-cyan-300">
                                        Ưu đãi công nghệ không thể bỏ lỡ
                                    </span>
                                </h2>
                                <p className="text-sm sm:text-base text-blue-100 max-w-lg leading-relaxed">
                                    Nâng cấp dàn thiết bị của bạn với voucher giảm sốc 1.000.000đ và
                                    quà tặng trị giá lên tới 3.000.000đ khi thanh toán qua thẻ tín
                                    dụng.
                                </p>
                                <div className="pt-2">
                                    <a
                                        href="shop.html?badge=sale"
                                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-slate-100 font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        <i data-lucide="tag" className="w-4 h-4" /> Xem khuyến mãi ngay
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 7. HOT PRODUCTS SECTION */}
                {/* ========================================== */}
                <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                    🔥 Bán chạy hàng đầu
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Sản phẩm bán chạy
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Lựa chọn được hàng ngàn tín đồ công nghệ tin dùng
                                </p>
                            </div>
                            <a
                                href="shop.html?badge=hot"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
                            >
                                Xem tất cả sản phẩm HOT →
                            </a>
                        </div>
                        {/* Hot Products Grid */}
                        <div
                            id="hot-products-grid"
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                        >
                            {/* Populated by JS */}
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 8. BRANDS SECTION */}
                {/* ========================================== */}
                <section className="py-14 border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                            Đối tác thương hiệu toàn cầu chính hãng
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
                            <a
                                href="shop.html?brand=Apple"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Apple
                            </a>
                            <a
                                href="shop.html?brand=Samsung"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Samsung
                            </a>
                            <a
                                href="shop.html?brand=Sony"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Sony
                            </a>
                            <a
                                href="shop.html?brand=Asus"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                ASUS
                            </a>
                            <a
                                href="shop.html?brand=Dell"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Dell
                            </a>
                            <a
                                href="shop.html?brand=HP"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                HP
                            </a>
                            <a
                                href="shop.html?brand=Lenovo"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Lenovo
                            </a>
                            <a
                                href="shop.html?brand=Xiaomi"
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0 transition-all font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 text-base"
                            >
                                Xiaomi
                            </a>
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 9. NEWS SECTION */}
                {/* ========================================== */}
                <section className="py-16 sm:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    Blog &amp; Đánh giá
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                    Tin tức công nghệ
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Cập nhật tin công nghệ nóng hổi và đánh giá chuyên sâu
                                </p>
                            </div>
                            <a
                                href="news.html"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
                            >
                                Xem tất cả bài viết →
                            </a>
                        </div>
                        <div
                            id="home-news-grid"
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Populated by JS */}
                        </div>
                    </div>
                </section>
                {/* ========================================== */}
                {/* 10. NEWSLETTER SECTION */}
                {/* ========================================== */}
                <section className="py-16 bg-blue-600 dark:bg-blue-900/50 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                            <i data-lucide="mail" className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Đăng ký nhận tin công nghệ
                        </h2>
                        <p className="text-blue-100 text-sm mt-2 mb-8 leading-relaxed">
                            Nhận thông tin sản phẩm mới ra mắt, mã giảm giá độc quyền lên đến
                            500.000đ và các bài viết review chuyên sâu hàng tuần.
                        </p>
                        <form
                            id="newsletter-form"
                            className="flex flex-col sm:flex-row items-center gap-3"
                        >
                            <input
                                type="email"
                                required=""
                                placeholder="Nhập địa chỉ email của bạn..."
                                className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400 shadow-md"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition-all whitespace-nowrap active:scale-95"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                </section>
                <HomePageContent />
            </main>
        </>

    );
} 