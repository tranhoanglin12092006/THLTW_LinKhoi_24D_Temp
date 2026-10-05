import Link from "next/link";
import { STATIC_NEWS } from "@/data/news";

/**
 * Component hiển thị khu vực Bài viết / Tin tức công nghệ tĩnh
 * Thiết kế phong cách e-commerce cao cấp, sang trọng, hiệu ứng hover mượt mà
 */
export default function NewsSection() {
    return (
        <section className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 relative overflow-hidden">
            {/* Vệt sáng trang trí nền */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header Tiêu đề Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Góc Tin Tức & Đánh Giá
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Bài viết công nghệ mới nhất
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                            Cập nhật xu hướng thiết bị tương lai, cẩm nang mua sắm thông minh và bài đánh giá chuyên sâu từ đội ngũ biên tập viên TECHNOVA.
                        </p>
                    </div>

                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all shadow-sm group hover:-translate-y-0.5 whitespace-nowrap self-start md:self-auto"
                    >
                        <span>Xem tất cả bài viết</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {/* Grid 4 bài viết tĩnh chất lượng cao */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATIC_NEWS.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden"
                        >
                            {/* Khối Ảnh bìa bài viết */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Badge Chuyên mục */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-white shadow-md">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Thời gian đọc */}
                                <div className="absolute bottom-3 right-3 z-10">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-slate-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        {post.readTime}
                                    </span>
                                </div>
                            </div>

                            {/* Khối Nội dung chi tiết */}
                            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                <div className="space-y-3">
                                    {/* Ngày đăng */}
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>📅 {post.date}</span>
                                    </div>

                                    {/* Tiêu đề bài viết */}
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <Link href={`/posts/${post.slug}`} title={post.title}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {/* Tóm tắt mô tả */}
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                {/* Chân bài viết: Tác giả & Nút Đọc tiếp */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={post.authorAvatar}
                                            alt={post.author}
                                            className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                                        />
                                        <div className="text-[11px]">
                                            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{post.author}</p>
                                            <p className="text-slate-400 text-[10px]">{post.authorRole}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                                    >
                                        <span>Đọc</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
