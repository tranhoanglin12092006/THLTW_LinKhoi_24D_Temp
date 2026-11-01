"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, getPostCategories } from "@/services/postServices";

/**
 * Trang Danh sách Bài viết & Tin tức công nghệ (dành cho khách hàng)
 * Hỗ trợ: Xem tất cả bài viết từ Database, lọc theo Chuyên mục, tìm kiếm bài viết
 */
export default function ShopPostsPage() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. Lấy danh sách chuyên mục cho thanh lọc
    useEffect(() => {
        getPostCategories()
            .then((res) => {
                const cats = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                setCategories(cats);
            })
            .catch((err) => console.error("Lỗi lấy danh mục bài viết:", err));
    }, []);

    // 2. Lấy danh sách bài viết từ Backend theo bộ lọc
    const fetchPostsData = () => {
        setLoading(true);
        getPosts(1, 20, search, selectedCat, "1", false)
            .then((res) => {
                const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                setPosts(list);
            })
            .catch((err) => console.error("Lỗi lấy danh sách bài viết:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPostsData();
    }, [selectedCat]);

    // Xử lý tìm kiếm bài viết
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPostsData();
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Đường dẫn điều hướng (Breadcrumb) */}
                <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
                    <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Tin tức công nghệ</span>
                </nav>

                {/* Tiêu đề & Thanh tìm kiếm */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                            TECHNOVA BLOG
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            Khám Phá Tin Tức & Đánh Giá
                        </h1>
                        <p className="mt-2 text-slate-500 text-sm max-w-xl">
                            Cập nhật liên tục các bài đánh giá thiết bị, cẩm nang tư vấn và thủ thuật công nghệ hữu ích.
                        </p>
                    </div>

                    {/* Ô tìm kiếm bài viết */}
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                        >
                            Tìm
                        </button>
                    </form>
                </div>

                {/* Bộ lọc theo chuyên mục bài viết */}
                <div className="flex flex-wrap items-center gap-2 my-8">
                    <button
                        onClick={() => setSelectedCat("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                            selectedCat === "all"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                        }`}
                    >
                        Tất cả chuyên mục
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCat(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                selectedCat === cat.id
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                            }`}
                        >
                            {cat.ten}
                        </button>
                    ))}
                </div>

                {/* Danh sách hiển thị bài viết */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 text-sm">Không tìm thấy bài viết nào phù hợp.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                            >
                                {/* Ảnh bìa có link */}
                                <Link href={`/posts/${post.id}`} className="aspect-[16/10] overflow-hidden bg-slate-800 relative block">
                                    <img
                                        src={post.anh_dai_dien_url || post.anh_dai_dien || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                                        alt={post.tieu_de}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold rounded-full">
                                        {post.category_name || "Tin Công Nghệ"}
                                    </span>
                                </Link>

                                {/* Nội dung bài viết */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2">
                                            📅 {post.ngay_dang ? new Date(post.ngay_dang).toLocaleDateString("vi-VN") : "Mới cập nhật"}
                                        </p>
                                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2" title={post.tieu_de}>
                                            <Link href={`/posts/${post.id}`}>
                                                {post.tieu_de}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                                            {post.noi_dung ? post.noi_dung.replace(/<[^>]*>?/gm, "").slice(0, 130) + "..." : ""}
                                        </p>
                                    </div>

                                    {/* Nút xem chi tiết */}
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400 font-medium">Thời gian đọc: 5 phút</span>
                                        <Link 
                                            href={`/posts/${post.id}`}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                        >
                                            Xem chi tiết →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
