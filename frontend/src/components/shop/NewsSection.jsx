"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STATIC_NEWS } from "@/data/news";
import { getPosts } from "@/services/postServices";

/**
 * Component hiển thị khu vực Bài viết / Tin tức công nghệ
 * Thiết kế phong cách e-commerce cao cấp, hiển thị bài viết thật từ Backend API
 */
export default function NewsSection() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // 1. Gọi API lấy 4 bài viết mới nhất từ Database
                const res = await getPosts(1, 4, "", "all", "1", false);
                
                // 2. Trích xuất mảng bài viết (hỗ trợ cả dạng res.data của Laravel Resource)
                const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

                if (items.length > 0) {
                    const formatted = items.map((p, index) => {
                        const fallbackStatic = STATIC_NEWS[index % STATIC_NEWS.length];
                        return {
                            id: p.id,
                            title: p.tieu_de,
                            slug: p.duong_dan || p.id,
                            category: p.category_name || p.danh_muc?.ten || "Tin Công Nghệ",
                            date: p.ngay_dang 
                                ? new Date(p.ngay_dang).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                }) 
                                : fallbackStatic.date,
                            author: fallbackStatic.author,
                            authorRole: fallbackStatic.authorRole,
                            authorAvatar: fallbackStatic.authorAvatar,
                            readTime: "5 phút đọc",
                            image: p.anh_dai_dien_url || p.anh_dai_dien || fallbackStatic.image,
                            description: p.noi_dung 
                                ? p.noi_dung.replace(/<[^>]*>?/gm, "").slice(0, 130) + "..." 
                                : fallbackStatic.description,
                        };
                    });
                    setNewsList(formatted);
                } else {
                    // Nếu chưa có bài nào thì dùng bài mẫu tạm
                    setNewsList(STATIC_NEWS);
                }
            } catch (err) {
                console.error("Lỗi kết nối API bài viết:", err);
                setNewsList(STATIC_NEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const displayList = newsList.length > 0 ? newsList : STATIC_NEWS;

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
                            Cập nhật xu hướng thiết bị tương lai, cẩm nang mua sắm thông minh và bài đánh giá chuyên sâu từ đội ngũ TECHNOVA.
                        </p>
                    </div>

                    {/* Nút bấm xem tất cả bài viết */}
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold transition-all shadow-sm group hover:-translate-y-0.5 whitespace-nowrap self-start md:self-auto"
                    >
                        <span>Xem tất cả bài viết</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {/* Grid 4 bài viết hiển thị hình ảnh cao cấp */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayList.map((post) => (
                        <article
                            key={post.id}
                            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden"
                        >
                            {/* Khối Ảnh bìa bài viết có kèm link sang trang chi tiết */}
                            <Link href={`/posts/${post.id}`} className="relative aspect-[16/10] overflow-hidden bg-slate-900 block">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />

                                {/* Lớp bóng phủ tinh tế */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Badge Chuyên mục */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-white shadow-md border border-white/10">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Thời gian đọc */}
                                <div className="absolute bottom-3 right-3 z-10">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-md text-slate-200 border border-white/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        {post.readTime}
                                    </span>
                                </div>
                            </Link>

                            {/* Khối Nội dung chi tiết */}
                            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                <div className="space-y-3">
                                    {/* Ngày đăng */}
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <span>📅</span>
                                        <span>{post.date}</span>
                                    </div>

                                    {/* Tiêu đề bài viết */}
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={post.title}>
                                        <Link href={`/posts/${post.id}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {/* Tóm tắt mô tả */}
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                {/* Chân bài viết: Tác giả và Nút xem */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={post.authorAvatar}
                                            alt={post.author}
                                            className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
                                            }}
                                        />
                                        <div className="text-[11px]">
                                            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{post.author}</p>
                                            <p className="text-slate-400 text-[10px]">{post.authorRole}</p>
                                        </div>
                                    </div>

                                    <Link 
                                        href={`/posts/${post.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                                    >
                                        <span>Khám phá</span>
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
