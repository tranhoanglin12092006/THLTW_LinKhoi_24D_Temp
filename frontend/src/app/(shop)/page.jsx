export default function Home() {
    return (
        <main>
            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-surface dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 py-12 md:py-20">
                {/* Ambient glow decorations */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-cyan-400/20 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-2 bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            CÔNG NGHỆ THẾ HỆ MỚI 2026
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] text-slate-900 dark:text-white mb-6 tracking-tight">
                            Khám Phá Thế Giới <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                Công Nghệ Đỉnh Cao
                            </span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
                            NovaTech mang đến những thiết bị flagship chính hãng Apple, Samsung,
                            Sony, Asus... Giá tốt nhất mỗi ngày, bảo hành 1 đổi 1 và giao nhanh 2h
                            toàn quốc.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-10">
                            <a
                                href="/products"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <span>Mua ngay hôm nay</span>
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </a>
                            <a
                                href="/products?sale=1"
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-800 dark:text-slate-200 font-semibold px-7 py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                                <span>🔥 Săn Flash Sale</span>
                            </a>
                        </div>
                        {/* Trust mini-stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-left">
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    50K+
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Khách hàng tin chọn
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                    100%
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Chính hãng cam kết
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    30 Ngày
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Đổi mới 1-1 miễn phí
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Hero Visual with Real Image & Floating Cards */}
                    <div
                        className="relative animate-fade-up"
                        style={{ animationDelay: ".15s" }}
                    >
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 dark:border-slate-800/80 bg-slate-900 group">
                                <img
                                    src="https://images.unsplash.com/photo-1468495244123-6c6c332eeede?w=1000&auto=format&fit=crop&q=80"
                                    alt="NovaTech Gadgets"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white">
                                    <div>
                                        <p className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                                            NovaTech Flagship 2026
                                        </p>
                                        <p className="text-lg font-bold">
                                            Hệ sinh thái thiết bị thông minh
                                        </p>
                                    </div>
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                                        Chính hãng
                                    </span>
                                </div>
                            </div>
                            {/* Floating Badges */}
                            <div
                                className="absolute -left-6 top-8 bg-white/95 dark:bg-slate-800/95 shadow-xl rounded-2xl p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 border border-slate-100 dark:border-slate-700 animate-fade-up backdrop-blur-md"
                                style={{ animationDelay: ".3s" }}
                            >
                                <span
                                    className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"
                                    id="ic-truck"
                                />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                        Free Fast Shipping
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Đơn từ 500K toàn quốc
                                    </p>
                                </div>
                            </div>
                            <div
                                className="absolute -right-4 top-1/3 bg-white/95 dark:bg-slate-800/95 shadow-xl rounded-2xl p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 border border-slate-100 dark:border-slate-700 animate-fade-up backdrop-blur-md"
                                style={{ animationDelay: ".4s" }}
                            >
                                <span
                                    className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
                                    id="ic-shield"
                                />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                        100% Chính Hãng
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Bảo hành 12 tháng uy tín
                                    </p>
                                </div>
                            </div>
                            <div
                                className="absolute left-6 -bottom-6 bg-white/95 dark:bg-slate-800/95 shadow-xl rounded-2xl p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 border border-slate-100 dark:border-slate-700 animate-fade-up backdrop-blur-md"
                                style={{ animationDelay: ".5s" }}
                            >
                                <span
                                    className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0"
                                    id="ic-refresh"
                                />
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                                        Đổi Trả Trong 30 Ngày
                                    </p>
                                    <p className="text-[11px] text-slate-400">1 đổi 1 nhanh chóng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                            Mua sắm theo danh mục
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Khám phá các dòng sản phẩm công nghệ tiên tiến nhất
                        </p>
                    </div>
                    <a
                        href="/products"
                        className="text-primary text-sm font-semibold hover:underline hidden sm:block"
                    >
                        Xem tất cả danh mục →
                    </a>
                </div>
                <div
                    id="home-categories"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
                />
            </section>
            {/* NEW PRODUCTS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            ✨ Sản phẩm mới về
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Những thiết bị công nghệ đỉnh cao vừa cập bến NovaTech
                        </p>
                    </div>
                    <a
                        href="/products?sort=new"
                        className="text-primary text-sm font-semibold hover:underline hidden sm:block"
                    >
                        Xem tất cả →
                    </a>
                </div>
                <div id="home-new" />
            </section>
            {/* FLASH SALE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 mb-8 flex flex-wrap items-center justify-between gap-4 border border-indigo-900/50 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl animate-bounce">⚡</span>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                                Flash Sale — Siêu Deal Công Nghệ
                            </h2>
                            <p className="text-slate-300 text-sm">
                                Số lượng có hạn, nhanh tay săn ngay mức giá hời nhất
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm font-medium">
                            Kết thúc sau:
                        </span>
                        <div
                            id="flash-timer"
                            className="bg-sale text-white font-mono font-black text-lg px-5 py-2.5 rounded-xl tracking-widest shadow-lg shadow-sale/30"
                        >
                            02 : 15 : 48
                        </div>
                    </div>
                </div>
                <div id="home-sale" className="w-full" />
            </section>
            {/* HOT PRODUCTS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            🔥 Sản phẩm bán chạy nhất
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Được đông đảo tín đồ công nghệ đánh giá cao &amp; tin chọn
                        </p>
                    </div>
                    <a
                        href="/products?sort=bestseller"
                        className="text-primary text-sm font-semibold hover:underline hidden sm:block"
                    >
                        Xem tất cả →
                    </a>
                </div>
                <div
                    id="home-hot"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                />
            </section>
            {/* PROMOTION BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 px-8 py-12 md:py-16 text-center shadow-2xl text-white">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 border border-white/30">
                            NovaTech Mega Festival
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            SALE BÙNG NỔ LÊN ĐẾN 50%
                        </h2>
                        <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed">
                            Ưu đãi công nghệ đỉnh cao dành riêng cho bạn — áp dụng cho hàng trăm
                            sản phẩm flagship chọn lọc.
                        </p>
                        <a
                            href="/products?sale=1"
                            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            <span>Xem tất cả khuyến mãi</span>
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
            {/* FEATURES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-6 text-center shadow-sm">
                        <div
                            className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-700/60 text-primary flex items-center justify-center mb-3.5"
                            id="feat-1"
                        />
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                            Miễn phí vận chuyển
                        </h3>
                        <p className="text-xs text-slate-400">Đơn hàng từ 500.000đ toàn quốc</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-6 text-center shadow-sm">
                        <div
                            className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-700/60 text-primary flex items-center justify-center mb-3.5"
                            id="feat-2"
                        />
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                            100% Chính hãng
                        </h3>
                        <p className="text-xs text-slate-400">
                            Cam kết nguồn gốc xuất xứ rõ ràng
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-6 text-center shadow-sm">
                        <div
                            className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-700/60 text-primary flex items-center justify-center mb-3.5"
                            id="feat-3"
                        />
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                            Đổi trả trong 30 ngày
                        </h3>
                        <p className="text-xs text-slate-400">
                            Lỗi 1 đổi 1 nhanh chóng thuận tiện
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-6 text-center shadow-sm">
                        <div
                            className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-700/60 text-primary flex items-center justify-center mb-3.5"
                            id="feat-4"
                        />
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">
                            Hỗ trợ kỹ thuật 24/7
                        </h3>
                        <p className="text-xs text-slate-400">
                            Đội ngũ kỹ thuật viên chuyên nghiệp
                        </p>
                    </div>
                </div>
            </section>
            {/* BRANDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="text-center mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Đối tác thương hiệu hàng đầu
                    </p>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 items-center">
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Apple
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Samsung
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Sony
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Asus
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Lenovo
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Dell
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        HP
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl py-4 text-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/40 transition-all font-bold text-sm shadow-sm">
                        Xiaomi
                    </div>
                </div>
            </section>
            {/* NEWS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                            Tin tức công nghệ mới
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Cập nhật tin tức, đánh giá sản phẩm và xu hướng số
                        </p>
                    </div>
                    <a
                        href="news.html"
                        className="text-primary text-sm font-semibold hover:underline hidden sm:block"
                    >
                        Xem tất cả bài viết →
                    </a>
                </div>
                <div id="home-news" className="grid md:grid-cols-3 gap-6" />
            </section>
            {/* NEWSLETTER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-gradient-to-br from-slate-100 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 md:p-14 text-center">
                    <div className="max-w-xl mx-auto">
                        <span
                            className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4"
                            id="nl-icon"
                        />
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                            Đăng ký nhận ưu đãi độc quyền
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                            Nhận ngay voucher giảm giá 100.000đ cho đơn hàng đầu tiên và cập nhật
                            sớm nhất các sản phẩm mới.
                        </p>
                        <form
                            onsubmit="event.preventDefault(); showToast('Đăng ký nhận tin thành công!','success'); this.reset()"
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <input
                                required=""
                                type="email"
                                placeholder="Nhập địa chỉ email của bạn..."
                                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:text-white"
                            />
                            <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg shadow-primary/20">
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
} ``