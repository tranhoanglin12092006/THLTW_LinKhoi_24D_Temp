"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPostById, getPosts } from "@/services/postServices";

/**
 * Trang Chi tiết Bài viết & Tin tức công nghệ (dành cho khách hàng)
 * Hiển thị đầy đủ: Tiêu đề, ảnh bìa, chuyên mục, ngày đăng, nội dung chi tiết và các bài viết gợi ý
 */
export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        // 1. Lấy chi tiết bài viết theo ID
        getPostById(id)
            .then((res) => {
                const data = res?.data || res;
                setPost(data);
            })
            .catch((err) => console.error("Lỗi khi tải chi tiết bài viết:", err))
            .finally(() => setLoading(false));

        // 2. Lấy thêm 3 bài viết khác làm mục "Bài viết liên quan"
        getPosts(1, 3, "", "all", "1", false)
            .then((res) => {
                const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                setRelatedPosts(list.filter((item) => String(item.id) !== String(id)));
            })
            .catch((err) => console.error("Lỗi tải bài liên quan:", err));
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
                <div className="max-w-4xl mx-auto animate-pulse">
                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6" />
                    <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
                    <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8" />
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
                    </div>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Không tìm thấy bài viết!
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    Bài viết này có thể đã bị xóa hoặc không tồn tại.
                </p>
                <Link
                    href="/posts"
                    className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                    ← Quay lại danh sách tin tức
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Điều hướng Breadcrumb */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>/</span>
                    <Link href="/posts" className="hover:text-blue-600">Tin tức</Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold line-clamp-1">
                        {post.tieu_de}
                    </span>
                </nav>

                {/* Khung bài viết chính */}
                <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                    {/* Chuyên mục & Ngày đăng */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                            {post.category_name || "Tin Công Nghệ"}
                        </span>
                        <span className="text-xs text-slate-400">
                            📅 Đăng ngày: {post.ngay_dang ? new Date(post.ngay_dang).toLocaleDateString("vi-VN") : "Mới cập nhật"}
                        </span>
                        <span className="text-xs text-slate-400">• 5 phút đọc</span>
                    </div>

                    {/* Tiêu đề bài viết */}
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                        {post.tieu_de}
                    </h1>

                    {/* Hình ảnh đại diện bài viết */}
                    {(post.anh_dai_dien_url || post.anh_dai_dien) && (
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 shadow-sm">
                            <img
                                src={post.anh_dai_dien_url || post.anh_dai_dien}
                                alt={post.tieu_de}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Nội dung chi tiết bài viết */}
                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line border-b border-slate-100 dark:border-slate-800 pb-10">
                        {post.noi_dung}
                    </div>

                    {/* Nút quay lại */}
                    <div className="mt-8 flex items-center justify-between">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            <span>← Xem thêm bài viết khác</span>
                        </Link>
                    </div>
                </article>

                {/* Khu vực Gợi ý các bài viết liên quan */}
                {relatedPosts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                            Bài viết liên quan
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedPosts.map((item) => (
                                <article
                                    key={item.id}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
                                >
                                    <Link href={`/posts/${item.id}`} className="aspect-[16/10] overflow-hidden block">
                                        <img
                                            src={item.anh_dai_dien_url || item.anh_dai_dien || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"}
                                            alt={item.tieu_de}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 line-clamp-2">
                                            <Link href={`/posts/${item.id}`}>
                                                {item.tieu_de}
                                            </Link>
                                        </h3>
                                        <Link
                                            href={`/posts/${item.id}`}
                                            className="mt-3 text-xs font-bold text-blue-600 inline-block"
                                        >
                                            Đọc tiếp →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
