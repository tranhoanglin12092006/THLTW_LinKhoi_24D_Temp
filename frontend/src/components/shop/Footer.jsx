"use client";



export default function Footer() {
    return (
        <>
            {/* FOOTER */}
            {/* ========================================================================== */}
            <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
                        {/* Col 1: Store Intro */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                    <i data-lucide="cpu" className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-black text-white tracking-tight uppercase">
                                    TECHNOVA
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                Điểm đến tin cậy cho các sản phẩm công nghệ chính hãng hàng đầu Việt
                                Nam. Cam kết 100% chất lượng, bảo hành ủy quyền và dịch vụ tận tâm.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                                    aria-label="Facebook"
                                >
                                    <i data-lucide="thumbs-up" className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <i data-lucide="camera" className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                                    aria-label="Youtube"
                                >
                                    <i data-lucide="play" className="w-4 h-4" />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                                    aria-label="Twitter"
                                >
                                    <i data-lucide="message-circle" className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                        {/* Col 2: Shopping Links with Icons */}
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Mua hàng
                            </h3>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <a
                                        href="shop.html?category=phone"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="smartphone"
                                            className="w-3.5 h-3.5 text-blue-500"
                                        />
                                        <span>Điện thoại thông minh</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="shop.html?category=laptop"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="laptop"
                                            className="w-3.5 h-3.5 text-indigo-400"
                                        />
                                        <span>Laptop &amp; Macbook cao cấp</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="shop.html?category=tablet"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i data-lucide="tablet" className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>Máy tính bảng iPad &amp; Tab</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="shop.html?category=headphone"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="headphones"
                                            className="w-3.5 h-3.5 text-emerald-400"
                                        />
                                        <span>Tai nghe chống ồn Hi-Res</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="shop.html?badge=sale"
                                        className="hover:text-rose-400 transition-colors flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <i data-lucide="zap" className="w-3.5 h-3.5 text-rose-500" />
                                            <span>Khuyến mãi Flash Sale</span>
                                        </span>
                                        <span className="px-1.5 py-0.2 bg-rose-500 text-white font-bold rounded-sm text-[9px]">
                                            HOT
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="shop.html?badge=new"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="sparkles"
                                            className="w-3.5 h-3.5 text-amber-400"
                                        />
                                        <span>Sản phẩm mới ra mắt</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Col 3: Support Links with Icons */}
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Hỗ trợ khách hàng
                            </h3>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <a
                                        href="contact.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="shield-check"
                                            className="w-3.5 h-3.5 text-blue-500"
                                        />
                                        <span>Trung tâm bảo hành &amp; sửa chữa</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="about.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i data-lucide="truck" className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Chính sách vận chuyển toàn quốc</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="about.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="rotate-ccw"
                                            className="w-3.5 h-3.5 text-blue-500"
                                        />
                                        <span>Chính sách đổi trả 30 ngày</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="about.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i data-lucide="lock" className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Chính sách bảo mật thông tin</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="contact.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="help-circle"
                                            className="w-3.5 h-3.5 text-blue-500"
                                        />
                                        <span>Câu hỏi thường gặp (FAQ)</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="orders.html"
                                        className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                    >
                                        <i
                                            data-lucide="package"
                                            className="w-3.5 h-3.5 text-blue-500"
                                        />
                                        <span>Tra cứu tiến độ đơn hàng</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Col 4: Contact Info with Icons */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Thông tin liên hệ
                            </h3>
                            <p className="text-xs flex items-start gap-2.5">
                                <i
                                    data-lucide="map-pin"
                                    className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                                />
                                <span>
                                    Tầng 8, Tòa nhà Bitexco, Số 2 Hải Triều, P. Bến Nghé, Quận 1, TP.
                                    Hồ Chí Minh
                                </span>
                            </p>
                            <p className="text-xs flex items-center gap-2.5">
                                <i
                                    data-lucide="phone"
                                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                                />
                                <span>
                                    Hotline: <strong className="text-white">1800 6868</strong> (Miễn
                                    phí 24/7)
                                </span>
                            </p>
                            <p className="text-xs flex items-center gap-2.5">
                                <i
                                    data-lucide="mail"
                                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                                />
                                <span>
                                    Email: <strong className="text-white">cskh@technova.vn</strong>
                                </span>
                            </p>
                            <p className="text-xs flex items-center gap-2.5">
                                <i
                                    data-lucide="clock"
                                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                                />
                                <span>Giờ mở cửa: 08:00 - 21:30 hàng ngày</span>
                            </p>
                        </div>
                    </div>
                    {/* Middle Row: Trust Badges & Payment Method Icons */}
                    <div className="py-6 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Trust & Certification Badges with Icons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs">
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <i
                                    data-lucide="shield-check"
                                    className="w-4 h-4 text-emerald-400"
                                />
                                <span>100% Chính hãng</span>
                            </span>
                            <span className="text-slate-700 hidden sm:inline">•</span>
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <i data-lucide="lock" className="w-4 h-4 text-blue-400" />
                                <span>Bảo mật SSL 256-bit</span>
                            </span>
                            <span className="text-slate-700 hidden sm:inline">•</span>
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <i data-lucide="truck" className="w-4 h-4 text-cyan-400" />
                                <span>Freeship từ 500k</span>
                            </span>
                            <span className="text-slate-700 hidden sm:inline">•</span>
                            <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                <i data-lucide="badge-check" className="w-4 h-4 text-amber-400" />
                                <span>Đã đăng ký Bộ Công Thương</span>
                            </span>
                        </div>
                        {/* Payment Method Visual Icons */}
                        <div className="flex items-center flex-wrap justify-center gap-2">
                            <span className="text-xs text-slate-400 mr-1 hidden sm:inline font-medium">
                                Thanh toán:
                            </span>
                            {/* VISA Icon */}
                            <div
                                className="h-8 px-2.5 bg-white rounded-lg flex items-center justify-center shadow-sm"
                                title="Thẻ quốc tế VISA"
                            >
                                <svg
                                    className="h-3.5 w-auto"
                                    viewBox="0 0 48 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19.125 15.228h-3.036l1.897-11.71h3.037l-1.898 11.71zM32.81 3.79c-.642-.257-1.644-.535-2.885-.535-3.18 0-5.421 1.693-5.442 4.126-.042 1.794 1.602 2.798 2.822 3.396 1.25.612 1.67.997 1.67 1.539-.02 1.838-1.026 1.22-3.328 1.22-.88 0-1.928-.214-2.738-.57l-.385 1.802c.983.456 2.802.77 4.128.77 3.376 0 5.568-1.668 5.61-4.254.02-1.417-.843-2.5-2.693-3.396-1.121-.57-1.81-.954-1.81-1.539 0-.527.576-1.07 1.83-1.07.982 0 1.69.214 2.227.457l.385-1.786c-.534-.214-1.22-.385-2.228-.385zm12.358 4.298c.085.343.342 1.34.342 1.34l.877 4.21h2.673L45.03 3.518h-2.502c-.792 0-1.432.235-1.774 1.055L35.68 15.228h3.228l.642-1.782h3.94l.678 1.782h2.865l-1.863-7.14zm-3.08 5.347l1.71-4.704.984 4.704h-2.694zm-27.81-5.918l-.342-1.74c-.598-.214-1.645-.443-2.8-.443-3.037 0-5.186 1.611-5.207 3.94-.021 1.71 1.518 2.666 2.673 3.237 1.196.584 1.58.955 1.58 1.475-.021.799-.962 1.17-1.859 1.17-1.218 0-1.881-.186-2.886-.628l-.406 1.897c.534.242 1.517.456 2.544.456 3.23 0 5.337-1.597 5.358-4.068.02-1.37-.812-2.424-2.587-3.28-1.069-.542-1.73-.898-1.73-1.454 0-.499.555-1.027 1.752-1.027.918 0 1.58.199 2.093.428l.386-1.802z"
                                        fill="#1434CB"
                                    />
                                </svg>
                            </div>
                            {/* MASTERCARD Icon */}
                            <div
                                className="h-8 px-2 bg-white rounded-lg flex items-center justify-center shadow-sm"
                                title="Thẻ quốc tế Mastercard"
                            >
                                <svg
                                    className="h-5 w-auto"
                                    viewBox="0 0 32 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx={11} cy={10} r={9} fill="#EB001B" />
                                    <circle cx={21} cy={10} r={9} fill="#F79E1B" />
                                    <path
                                        d="M16 3.8c1.7 1.6 2.8 3.9 2.8 6.2s-1.1 4.6-2.8 6.2c-1.7-1.6-2.8-3.9-2.8-6.2s1.1-4.6 2.8-6.2z"
                                        fill="#FF5F00"
                                    />
                                </svg>
                            </div>
                            {/* VNPAY Icon */}
                            <div
                                className="h-8 px-2.5 bg-white rounded-lg flex items-center justify-center shadow-sm"
                                title="Cổng thanh toán VNPAY-QR"
                            >
                                <span className="font-black text-[11px] text-[#005BAA] tracking-tighter">
                                    VN<span className="text-[#ED1C24]">PAY</span>
                                </span>
                            </div>
                            {/* MOMO Icon */}
                            <div
                                className="h-8 px-2.5 bg-[#A50064] text-white rounded-lg flex items-center justify-center shadow-sm"
                                title="Ví điện tử MoMo"
                            >
                                <span className="font-extrabold text-[11px] tracking-tight">
                                    momo
                                </span>
                            </div>
                            {/* ZALOPAY Icon */}
                            <div
                                className="h-8 px-2.5 bg-[#008FE5] text-white rounded-lg flex items-center justify-center shadow-sm"
                                title="Ví điện tử ZaloPay"
                            >
                                <span className="font-black text-[10px] tracking-tight">
                                    ZaloPay
                                </span>
                            </div>
                            {/* COD Icon */}
                            <div
                                className="h-8 px-2.5 bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 text-slate-300 shadow-sm"
                                title="Thanh toán khi nhận hàng (COD)"
                            >
                                <i
                                    data-lucide="banknote"
                                    className="w-3.5 h-3.5 text-emerald-400"
                                />
                                <span className="font-bold text-[10px]">COD</span>
                            </div>
                        </div>
                    </div>
                    {/* Bottom Copyright & Back to Top with Icon */}
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <p>
                            © 2026 TECHNOVA Store. All rights reserved. Nền tảng thương mại điện
                            tử công nghệ cao cấp hàng đầu Việt Nam.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="about.html"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Điều khoản dịch vụ
                            </a>
                            <span>•</span>
                            <a
                                href="about.html"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Chính sách bảo mật
                            </a>
                            <span>•</span>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-slate-400"
                                aria-label="Cuộn lên đầu trang"
                            >
                                <span>Lên đầu trang</span>
                                <i data-lucide="arrow-up" className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
            {/* Floating Back to Top Button with Icon */}
            <button
                id="floating-back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 z-40 active:scale-95 hover:scale-105"
                aria-label="Cuộn lên đầu trang"
                title="Cuộn lên đầu trang"
            >
                <i data-lucide="arrow-up" className="w-5 h-5" />
            </button>
        </>

    );
}