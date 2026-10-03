import ProductCard from "./ProductCard";
import Link from "next/link";

/**
 * Component ProductList hiển thị danh sách sản phẩm theo từng nhóm
 * (Ví dụ: Sản phẩm Mới, Sản phẩm Hot, Sản phẩm Giảm giá)
 * Bám theo cấu trúc chuẩn của tranhoanglin-frontend
 */
export default function ProductList({
    title = "Danh sách sản phẩm",
    subtitle = "Khám phá các sản phẩm công nghệ chính hãng giá tốt nhất.",
    products = [],
    type = "default",
    loading = false,
}) {
    return (
        <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
            
            {/* =========================================================
                1. PHẦN TIÊU ĐỀ SECTION
            ========================================================= */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    {/* Badge thể loại */}
                    <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        Bộ sưu tập
                    </span>

                    {/* Tiêu đề chính */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h2>

                    {/* Mô tả phụ */}
                    <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {subtitle}
                    </p>
                </div>

                {/* Phần bên phải: Số lượng và Nút Xem tất cả */}
                <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                        {loading ? "Đang tải..." : `${products.length} sản phẩm`}
                    </span>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-4 py-1.5 text-xs font-semibold transition-all hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white shadow-sm"
                    >
                        Xem tất cả
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                </div>
            </div>

            {/* Dải phân cách gradient nhẹ */}
            <div className="mb-6 h-px bg-gradient-to-r from-blue-500/50 via-slate-200 dark:via-slate-800 to-transparent" />

            {/* =========================================================
                2. HIỂN THỊ DANH SÁCH SẢN PHẨM
            ========================================================= */}
            {loading ? (
                // Hiển thị khung chờ khi đang tải dữ liệu (Skeleton)
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
                            <div className="w-full pt-[80%] bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                            <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : products && products.length > 0 ? (
                // Lưới sản phẩm responsive: 1 cột mobile, 2 cột tablet, 4 cột desktop
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            type={type}
                        />
                    ))}
                </div>
            ) : (
                // Khi chưa có sản phẩm nào
                <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">Hiện chưa có sản phẩm nào trong mục này.</p>
                </div>
            )}

        </section>
    );
}
