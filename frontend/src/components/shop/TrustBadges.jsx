/**
 * Component Hiển thị các cam kết dịch vụ & bảo hành thương mại điện tử
 * Giúp gia tăng độ tin cậy và kích thích khách hàng mua sắm
 */
export default function TrustBadges() {
    const badges = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>
            ),
            color: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
            title: "Giao Siêu Tốc 2H",
            description: "Miễn phí đơn từ 500K toàn quốc"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            ),
            color: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
            title: "100% Chính Hãng",
            description: "Bảo hành 24 tháng chính hãng"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            ),
            color: "from-purple-500 to-violet-600",
            bgLight: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
            title: "Đổi Trả 30 Ngày",
            description: "1 đổi 1 ngay khi phát sinh lỗi"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            ),
            color: "from-amber-500 to-orange-600",
            bgLight: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
            title: "Trả Góp 0% Lãi Suất",
            description: "Duyệt hồ sơ nhanh chỉ 5 phút"
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ),
            color: "from-cyan-500 to-blue-600",
            bgLight: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
            title: "Hỗ Trợ 24/7",
            description: "Hotline miễn phí 1800 6868"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                {badges.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 group"
                    >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bgLight} group-hover:scale-110 transition-transform shadow-sm`}>
                            {item.icon}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                                {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-1">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
