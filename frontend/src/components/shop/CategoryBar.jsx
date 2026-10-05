import Link from "next/link";

/**
 * Component Danh mục mua sắm nổi bật (CategoryBar)
 * Bố cục thẻ bo tròn, màu sắc hiện đại, hover 3D zoom sang trọng
 */
export default function CategoryBar() {
    const categories = [
        {
            name: "Điện thoại",
            slug: "dien-thoai",
            count: "42+ mẫu",
            color: "from-blue-500/20 to-indigo-500/20",
            iconBg: "bg-blue-500 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            ),
        },
        {
            name: "Laptop",
            slug: "laptop",
            count: "36+ mẫu",
            color: "from-indigo-500/20 to-purple-500/20",
            iconBg: "bg-indigo-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>
            ),
        },
        {
            name: "Tablet",
            slug: "tablet",
            count: "24+ mẫu",
            color: "from-cyan-500/20 to-teal-500/20",
            iconBg: "bg-cyan-500 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 18h.01"/></svg>
            ),
        },
        {
            name: "Tai nghe",
            slug: "tai-nghe",
            count: "58+ mẫu",
            color: "from-emerald-500/20 to-green-500/20",
            iconBg: "bg-emerald-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
            ),
        },
        {
            name: "Đồng hồ",
            slug: "dong-ho",
            count: "31+ mẫu",
            color: "from-purple-500/20 to-pink-500/20",
            iconBg: "bg-purple-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.34a2 2 0 0 1 2 1.82l.35 3.83"/></svg>
            ),
        },
        {
            name: "Gaming Gear",
            slug: "gaming-gear",
            count: "45+ mẫu",
            color: "from-rose-500/20 to-red-500/20",
            iconBg: "bg-rose-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>
            ),
        },
        {
            name: "Camera & Flycam",
            slug: "camera",
            count: "19+ mẫu",
            color: "from-amber-500/20 to-yellow-500/20",
            iconBg: "bg-amber-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            ),
        },
        {
            name: "Phụ kiện Cao Cấp",
            slug: "phu-kien",
            count: "67+ mẫu",
            color: "from-teal-500/20 to-cyan-500/20",
            iconBg: "bg-teal-600 text-white",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
            ),
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Khám Phá Danh Mục
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        Mua sắm theo nhu cầu công nghệ
                    </h2>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all self-start sm:self-auto"
                >
                    <span>Xem tất cả danh mục</span>
                    <span>→</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4">
                {categories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/products?category=${cat.slug}`}
                        className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 text-center hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300 mb-3`}>
                            {cat.icon}
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                {cat.name}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                                {cat.count}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
