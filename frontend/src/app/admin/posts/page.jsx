"use client";

import { useState, useEffect } from "react";
import {
    getPosts,
    getPostCategories,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    restorePost,
    forceDeletePost,
} from "@/services/postServices";
import Pagination from "@/components/common/Pagination";

// Hàm định dạng ngày giờ hiển thị
function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AdminPostsPage() {
    // 1. Quản lý tab: "active" (Danh sách bài viết) hoặc "trash" (Thùng rác)
    const [tab, setTab] = useState("active");
    const [trashCount, setTrashCount] = useState(0);

    // 2. Danh sách bài viết & danh mục
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Phân trang 10 mục / trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // 4. Tìm kiếm & Lọc
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // 5. Quản lý Modal Thêm / Sửa
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null); // null = Thêm mới, object = Sửa

    // Dữ liệu Form Thêm / Sửa
    const [formData, setFormData] = useState({
        tieu_de: "",
        duong_dan: "",
        danh_muc_bai_viet_id: "",
        noi_dung: "",
        anh_dai_dien: "",
        trang_thai: 1,
        ngay_dang: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    // 6. Quản lý Modal Xem Chi Tiết
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingPost, setViewingPost] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    // 7. Quản lý Lightbox xem ảnh lớn
    const [lightboxImage, setLightboxImage] = useState(null);

    // Danh sách bộ ảnh công nghệ mẫu chất lượng cao (Unsplash HD)
    const TECH_IMAGE_PRESETS = [
        { label: "Trí tuệ nhân tạo (AI)", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80" },
        { label: "Laptop Gaming & Ultra", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80" },
        { label: "Điện thoại Flagship", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80" },
        { label: "Kính thực tế ảo (VR)", url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80" },
        { label: "Nhà thông minh (IoT)", url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80" },
        { label: "Bảo mật số Cybersecurity", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80" },
        { label: "Linh kiện PC & Phần cứng", url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80" },
        { label: "Mạng viễn thông 5G", url: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80" },
    ];

    // Tải danh mục bài viết cho bộ lọc và select form
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getPostCategories();
                const items = res.data || res;
                setCategories(Array.isArray(items) ? items : []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục bài viết:", error);
            }
        };
        loadCategories();
    }, []);

    // Tải danh sách bài viết
    const loadPosts = async () => {
        try {
            setLoading(true);
            const isTrashTab = tab === "trash";
            const res = await getPosts(
                page,
                10,
                search,
                filterCategory,
                filterStatus,
                isTrashTab
            );

            const items = res.data || res;
            setPosts(Array.isArray(items) ? items : []);

            if (res.meta) {
                setTotalPages(res.meta.last_page || 1);
                setTotalItems(res.meta.total || 0);
            } else if (res.last_page) {
                setTotalPages(res.last_page || 1);
                setTotalItems(res.total || 0);
            } else {
                setTotalPages(1);
                setTotalItems(Array.isArray(items) ? items.length : 0);
            }

            if (res.trash_count !== undefined) {
                setTrashCount(res.trash_count);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [page, search, filterCategory, filterStatus, tab]);

    // Tạo slug tự động từ tiêu đề khi người dùng nhập
    const handleTitleChange = (e) => {
        const val = e.target.value;
        const autoSlug = val
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");

        setFormData((prev) => ({
            ...prev,
            tieu_de: val,
            duong_dan: editingPost ? prev.duong_dan : autoSlug,
        }));
    };

    // Mở Modal Thêm mới
    const handleOpenCreateModal = () => {
        setEditingPost(null);
        setFormData({
            tieu_de: "",
            duong_dan: "",
            danh_muc_bai_viet_id: categories.length > 0 ? categories[0].id : "",
            noi_dung: "",
            anh_dai_dien: "",
            trang_thai: 1,
            ngay_dang: new Date().toISOString().slice(0, 16),
        });
        setImageFile(null);
        setPreviewImage("");
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Sửa bài viết
    const handleOpenEditModal = (p) => {
        setEditingPost(p);
        setFormData({
            tieu_de: p.tieu_de || "",
            duong_dan: p.duong_dan || "",
            danh_muc_bai_viet_id: p.danh_muc_bai_viet_id || (categories.length > 0 ? categories[0].id : ""),
            noi_dung: p.noi_dung || "",
            anh_dai_dien: p.anh_dai_dien || "",
            trang_thai: p.trang_thai ? 1 : 0,
            ngay_dang: p.ngay_dang ? new Date(p.ngay_dang).toISOString().slice(0, 16) : "",
        });
        setImageFile(null); //chưa chọn ảnh mới.
        setPreviewImage(p.anh_dai_dien_url || p.anh_dai_dien || ""); //hiển thi ảnh
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Xem chi tiết
    const handleOpenViewModal = async (p) => {
        try {
            setViewLoading(true);
            setIsViewModalOpen(true);
            setViewingPost(p);
            const res = await getPostById(p.id);
            setViewingPost(res.data || res);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết bài viết:", error);
        } finally {
            setViewLoading(false);
        }
    };

    // Xử lý chọn ảnh file từ máy
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Lưu Form (Thêm hoặc Sửa)
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.tieu_de.trim()) {
            setFormError("Vui lòng nhập tiêu đề bài viết.");
            return;
        }

        if (!formData.danh_muc_bai_viet_id) {
            setFormError("Vui lòng chọn danh mục bài viết.");
            return;
        }

        try {
            setFormLoading(true);

            // Sử dụng FormData nếu có upload file ảnh, ngược lại gửi JSON
            let payload;
            if (imageFile) {
                payload = new FormData();
                payload.append("tieu_de", formData.tieu_de.trim());
                if (formData.duong_dan) payload.append("duong_dan", formData.duong_dan.trim());
                payload.append("danh_muc_bai_viet_id", formData.danh_muc_bai_viet_id);
                payload.append("noi_dung", formData.noi_dung || "");
                payload.append("trang_thai", formData.trang_thai);
                if (formData.ngay_dang) payload.append("ngay_dang", formData.ngay_dang);
                payload.append("anh_dai_dien", imageFile);
            } else {
                payload = {
                    tieu_de: formData.tieu_de.trim(),
                    duong_dan: formData.duong_dan.trim() || null,
                    danh_muc_bai_viet_id: Number(formData.danh_muc_bai_viet_id),
                    noi_dung: formData.noi_dung || "",
                    anh_dai_dien: formData.anh_dai_dien || null,
                    trang_thai: Number(formData.trang_thai),
                    ngay_dang: formData.ngay_dang || null,
                };
            }

            if (editingPost) {
                await updatePost(editingPost.id, payload);
                alert("✓ Cập nhật bài viết thành công!");
            } else {
                await createPost(payload);
                alert("✓ Thêm bài viết mới thành công!");
            }

            setIsFormModalOpen(false);
            loadPosts();
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin!";
            setFormError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    // Xóa mềm bài viết
    const handleDelete = async (p) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn chuyển bài viết "${p.tieu_de}" (ID: #${p.id}) vào thùng rác không?`
        );
        if (!confirmDelete) return;

        try {
            await deletePost(p.id);
            alert("✓ Đã chuyển bài viết vào thùng rác (xóa mềm)!");
            loadPosts();
        } catch (error) {
            const msg = error.response?.data?.message || "Không thể xóa bài viết này.";
            alert(`Lỗi: ${msg}`);
        }
    };

    // Khôi phục bài viết
    const handleRestore = async (p) => {
        try {
            await restorePost(p.id);
            alert(`✓ Đã khôi phục thành công bài viết "${p.tieu_de}"!`);
            loadPosts();
        } catch (error) {
            const msg = error.response?.data?.message || "Khôi phục thất bại.";
            alert(`Lỗi: ${msg}`);
        }
    };

    // Xóa vĩnh viễn bài viết
    const handleForceDelete = async (p) => {
        const confirmDelete = window.confirm(
            `CẢNH BÁO NGUY HIỂM:\nBạn có chắc chắn muốn XÓA VĨNH VIỄN bài viết "${p.tieu_de}" (ID: #${p.id}) khỏi cơ sở dữ liệu?\nHành động này KHÔNG THỂ HOÀN TÁC!`
        );
        if (!confirmDelete) return;

        try {
            await forceDeletePost(p.id);
            alert("✓ Đã xóa vĩnh viễn bài viết khỏi hệ thống!");
            loadPosts();
        } catch (error) {
            const msg = error.response?.data?.message || "Xóa vĩnh viễn thất bại.";
            alert(`Lỗi: ${msg}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* =========================================================
                1. TIÊU ĐỀ TRANG VÀ NÚT THÊM BÀI VIẾT
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>Quản lý Bài viết</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            {totalItems} bài viết
                        </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Thêm, sửa, xóa, xem chi tiết, xóa mềm và khôi phục bài viết tĩnh tin tức công nghệ (10 mục / trang)
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Thêm bài viết mới
                    </button>
                </div>
            </div>

            {/* =========================================================
                2. TABS CHUYỂN ĐỔI: HOẠT ĐỘNG VS THÙNG RÁC
            ========================================================= */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <button
                    type="button"
                    onClick={() => {
                        setTab("active");
                        setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${tab === "active"
                        ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    <span>Danh sách bài viết</span>
                    {tab === "active" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/30 text-violet-200">
                            {totalItems}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setTab("trash");
                        setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${tab === "trash"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                    <span>Thùng rác</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${trashCount > 0
                        ? "bg-rose-500/30 text-rose-200 font-bold"
                        : "bg-white/10 text-slate-400"
                        }`}>
                        {trashCount}
                    </span>
                </button>
            </div>

            {/* =========================================================
                3. THANH TÌM KIẾM & BỘ LỌC
            ========================================================= */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Tìm bài viết theo tiêu đề, slug, nội dung..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Lọc theo Danh mục */}
                <select
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#0f1129] border border-white/[0.08] text-slate-300 text-xs focus:outline-none focus:border-violet-500"
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.ten}
                        </option>
                    ))}
                </select>

                {/* Lọc theo Trạng thái (chỉ hiện ở tab hoạt động) */}
                {tab === "active" && (
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#0f1129] border border-white/[0.08] text-slate-300 text-xs focus:outline-none focus:border-violet-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="1">Đã xuất bản</option>
                        <option value="0">Bản nháp / Ẩn</option>
                    </select>
                )}

                {/* Nút đặt lại bộ lọc */}
                {(search || filterCategory !== "all" || filterStatus !== "all") && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setFilterCategory("all");
                            setFilterStatus("all");
                            setPage(1);
                        }}
                        className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                        Đặt lại
                    </button>
                )}
            </div>

            {/* =========================================================
                4. BẢNG DANH SÁCH BÀI VIẾT
            ========================================================= */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.03] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                <th className="py-3.5 px-4 w-14 text-center">#ID</th>
                                <th className="py-3.5 px-4 min-w-[280px]">Bài viết</th>
                                <th className="py-3.5 px-4 min-w-[140px]">Danh mục</th>
                                <th className="py-3.5 px-4 min-w-[120px]">Ngày đăng</th>
                                <th className="py-3.5 px-4 min-w-[120px] text-center">Trạng thái</th>
                                <th className="py-3.5 px-4 min-w-[150px] text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.04] text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="inline-flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Đang tải dữ liệu bài viết...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                            <p className="text-sm font-medium">Không tìm thấy bài viết nào.</p>
                                            <p className="text-[11px] text-slate-600">
                                                {tab === "trash" ? "Thùng rác hiện đang trống." : "Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm bài viết mới."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                posts.map((p) => {
                                    const imgUrl = p.anh_dai_dien_url || p.anh_dai_dien;

                                    return (
                                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* ID */}
                                            <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500">
                                                #{p.id}
                                            </td>

                                            {/* Ảnh đại diện & Tiêu đề */}
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3.5">
                                                    {/* Khối Ảnh bìa bài viết sắc nét */}
                                                    <div
                                                        onClick={() => imgUrl && setLightboxImage({ url: imgUrl, title: p.tieu_de })}
                                                        className={`relative w-20 h-13 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.1] shadow-lg shadow-black/30 flex-shrink-0 flex items-center justify-center group/img ${imgUrl ? 'cursor-pointer hover:border-violet-500/50 hover:shadow-violet-500/10' : ''} transition-all`}
                                                        title={imgUrl ? "Bấm vào để phóng to ảnh xem chi tiết" : ""}
                                                    >
                                                        {imgUrl ? (
                                                            <>
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={p.tieu_de}
                                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-115"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80";
                                                                    }}
                                                                />
                                                                {/* Lớp phủ hover zoom */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                                                </div>
                                                                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold bg-black/70 text-slate-200 backdrop-blur-xs uppercase tracking-tighter">HD</span>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-white truncate max-w-[340px] text-[13px] group-hover:text-violet-300 transition-colors" title={p.tieu_de}>
                                                            {p.tieu_de}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[240px]">
                                                                /{p.duong_dan}
                                                            </span>
                                                            {imgUrl && (
                                                                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                                                    <span>🖼️</span> Có ảnh
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Danh mục */}
                                            <td className="py-3 px-4">
                                                <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-white/[0.06]">
                                                    {p.category_name || p.danh_muc?.ten || "Chưa phân loại"}
                                                </span>
                                            </td>

                                            {/* Ngày đăng */}
                                            <td className="py-3 px-4 text-slate-400 text-[11px]">
                                                {formatDate(p.ngay_dang || p.created_at)}
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="py-3 px-4 text-center">
                                                {tab === "trash" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                                        Trong thùng rác
                                                    </span>
                                                ) : p.trang_thai ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                        Đã xuất bản
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                        Bản nháp / Ẩn
                                                    </span>
                                                )}
                                            </td>

                                            {/* Thao tác */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {tab === "active" ? (
                                                        <>
                                                            {/* Nút Xem chi tiết */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenViewModal(p)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                                                                title="Xem chi tiết bài viết"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            </button>

                                                            {/* Nút Sửa */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditModal(p)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                                                title="Chỉnh sửa bài viết"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                            </button>

                                                            {/* Nút Xóa mềm */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(p)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                                title="Xóa mềm (chuyển vào thùng rác)"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Nút Xem chi tiết (khi ở thùng rác) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenViewModal(p)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                                                                title="Xem chi tiết bài viết"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            </button>

                                                            {/* Nút Khôi phục */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRestore(p)}
                                                                className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                                                title="Khôi phục bài viết"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                                                            </button>

                                                            {/* Nút Xóa vĩnh viễn */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleForceDelete(p)}
                                                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                                title="Xóa vĩnh viễn khỏi CSDL"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang (10 mục / trang) */}
                <div className="p-4 bg-white/[0.01]">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={10}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>

            {/* =========================================================
                5. MODAL XEM CHI TIẾT BÀI VIẾT
            ========================================================= */}
            {isViewModalOpen && viewingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e1026] border border-white/[0.1] shadow-2xl p-6 text-slate-200">
                        {/* Nút Đóng Modal */}
                        <button
                            type="button"
                            onClick={() => setIsViewModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Chi tiết Bài viết</h3>
                                <p className="text-xs text-slate-400">Mã bài viết: #{viewingPost.id}</p>
                            </div>
                        </div>

                        {viewLoading ? (
                            <div className="py-12 text-center text-slate-400">
                                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-xs">Đang tải chi tiết...</p>
                            </div>
                        ) : (
                            <div className="space-y-5 text-xs">
                                {/* Ảnh bìa bài viết phong cách Cinematic Banner */}
                                {(viewingPost.anh_dai_dien_url || viewingPost.anh_dai_dien) ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] aspect-[16/8] bg-slate-900 shadow-2xl group/detailimg">
                                        <img
                                            src={viewingPost.anh_dai_dien_url || viewingPost.anh_dai_dien}
                                            alt={viewingPost.tieu_de}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/detailimg:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
                                            }}
                                        />
                                        {/* Gradient vignette bóng mờ bên dưới */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-transparent to-black/30 pointer-events-none" />

                                        {/* Category badge trên ảnh */}
                                        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-md shadow-lg shadow-violet-600/30">
                                                {viewingPost.category_name || viewingPost.danh_muc?.ten || "Công nghệ"}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                                                ✦ Ảnh HD
                                            </span>
                                        </div>

                                        {/* Nút phóng to ảnh chi tiết */}
                                        <button
                                            type="button"
                                            onClick={() => setLightboxImage({
                                                url: viewingPost.anh_dai_dien_url || viewingPost.anh_dai_dien,
                                                title: viewingPost.tieu_de
                                            })}
                                            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 cursor-pointer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                                            <span>Xem ảnh gốc</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-white/[0.08] p-8 text-center bg-white/[0.01]">
                                        <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-2 text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                        </div>
                                        <p className="text-slate-500 text-xs">Bài viết này chưa có ảnh đại diện</p>
                                    </div>
                                )}

                                {/* Tiêu đề */}
                                <div>
                                    <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Tiêu đề:</span>
                                    <h4 className="text-base font-bold text-white leading-snug">{viewingPost.tieu_de}</h4>
                                </div>

                                {/* Đường dẫn slug */}
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                                    <span className="text-slate-400">Đường dẫn (Slug):</span>
                                    <span className="font-mono text-violet-300 font-medium">/{viewingPost.duong_dan}</span>
                                </div>

                                {/* Lưới thông tin danh mục, trạng thái, ngày đăng */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-400 block mb-1">Danh mục</span>
                                        <span className="font-semibold text-white">
                                            {viewingPost.category_name || viewingPost.danh_muc?.ten || "Chưa phân loại"}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-400 block mb-1">Trạng thái</span>
                                        {viewingPost.deleted_at ? (
                                            <span className="text-rose-400 font-semibold">Thùng rác</span>
                                        ) : viewingPost.trang_thai ? (
                                            <span className="text-emerald-400 font-semibold">Đã xuất bản</span>
                                        ) : (
                                            <span className="text-slate-400 font-semibold">Bản nháp / Ẩn</span>
                                        )}
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <span className="text-slate-400 block mb-1">Ngày đăng</span>
                                        <span className="font-semibold text-white">{formatDate(viewingPost.ngay_dang)}</span>
                                    </div>
                                </div>

                                {/* Nội dung bài viết */}
                                <div>
                                    <span className="text-slate-400 block mb-2 font-semibold uppercase text-[10px]">Nội dung bài viết:</span>
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
                                        {viewingPost.noi_dung || <em className="text-slate-500">Chưa có nội dung cho bài viết này.</em>}
                                    </div>
                                </div>

                                {/* Thông tin thời gian */}
                                <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                                    <div>Tạo lúc: {formatDate(viewingPost.created_at)}</div>
                                    <div className="text-right">Cập nhật: {formatDate(viewingPost.updated_at)}</div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium text-xs transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                6. MODAL THÊM HOẶC CHỈNH SỬA BÀI VIẾT
            ========================================================= */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0e1026] border border-white/[0.1] shadow-2xl p-6 text-slate-200">
                        {/* Nút Đóng Modal */}
                        <button
                            type="button"
                            onClick={() => setIsFormModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {editingPost ? `Sửa bài viết #${editingPost.id}` : "Thêm bài viết mới"}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {editingPost ? "Chỉnh sửa thông tin bài viết và lưu thay đổi" : "Điền đầy đủ thông tin để đăng bài viết mới"}
                                </p>
                            </div>
                        </div>

                        {formError && (
                            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                                <span>⚠️</span>
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4 text-xs">
                            {/* Tiêu đề bài viết */}
                            <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                    Tiêu đề bài viết <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.tieu_de}
                                    onChange={handleTitleChange}
                                    placeholder="Ví dụ: Công nghệ mạng 5G và kết nối tương lai..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* Đường dẫn Slug */}
                            <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                    Đường dẫn tĩnh (Slug) <span className="text-slate-500 text-[10px]">(Tự động tạo hoặc tùy chỉnh)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.duong_dan}
                                    onChange={(e) => setFormData({ ...formData, duong_dan: e.target.value })}
                                    placeholder="cong-nghe-mang-5g-ket-noi-tuong-lai"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>

                            {/* Danh mục & Trạng thái */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">
                                        Danh mục bài viết <span className="text-rose-400">*</span>
                                    </label>
                                    <select
                                        value={formData.danh_muc_bai_viet_id}
                                        onChange={(e) => setFormData({ ...formData, danh_muc_bai_viet_id: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1129] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500"
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.ten}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-medium mb-1">
                                        Trạng thái hiển thị
                                    </label>
                                    <select
                                        value={formData.trang_thai}
                                        onChange={(e) => setFormData({ ...formData, trang_thai: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1129] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500"
                                    >
                                        <option value={1}>Đã xuất bản (Hiển thị)</option>
                                        <option value={0}>Bản nháp (Ẩn bài viết)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Ngày đăng */}
                            <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                    Ngày đăng bài
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.ngay_dang}
                                    onChange={(e) => setFormData({ ...formData, ngay_dang: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>

                            {/* Ảnh đại diện: Upload file hoặc chọn URL với bộ preset công nghệ */}
                            <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                                <div className="flex items-center justify-between">
                                    <label className="block text-slate-300 font-semibold text-xs">
                                        Ảnh bìa bài viết (Ảnh đại diện)
                                    </label>
                                    <span className="text-[10px] text-violet-400 font-medium">Hỗ trợ File hoặc Link ảnh trực tuyến</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Tải ảnh từ máy */}
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/40 transition-colors">
                                        <div className="flex items-center gap-2 mb-1.5 text-[11px] font-semibold text-slate-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                            <span>Tải ảnh từ máy tính:</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-slate-400 text-xs file:mr-2.5 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500 cursor-pointer"
                                        />
                                    </div>

                                    {/* Hoặc dán link ảnh */}
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/40 transition-colors">
                                        <div className="flex items-center gap-2 mb-1.5 text-[11px] font-semibold text-slate-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                            <span>Hoặc dán URL hình ảnh:</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.anh_dai_dien}
                                            onChange={(e) => {
                                                setFormData({ ...formData, anh_dai_dien: e.target.value });
                                                setPreviewImage(e.target.value);
                                            }}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>

                                {/* Gợi ý ảnh đẹp chọn nhanh 1 chạm */}
                                <div>
                                    <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
                                        ⚡ Gợi ý ảnh công nghệ đẹp độ nét cao (Bấm để chọn nhanh):
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {TECH_IMAGE_PRESETS.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setFormData({ ...formData, anh_dai_dien: item.url });
                                                    setPreviewImage(item.url);
                                                }}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${previewImage === item.url
                                                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400"
                                                    : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]"
                                                    }`}
                                            >
                                                ✦ {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview ảnh chuẩn 16:9 sắc nét */}
                                {previewImage && (
                                    <div className="relative mt-2 rounded-2xl overflow-hidden border border-white/[0.12] aspect-[16/7] bg-slate-900 shadow-xl group/prev">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/90 text-white backdrop-blur-md shadow-md">
                                                Xem trước ảnh
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                                                ✦ Sắc nét (HD)
                                            </span>
                                        </div>

                                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setLightboxImage({ url: previewImage, title: "Xem trước ảnh đại diện bài viết" })}
                                                className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                                            >
                                                🔍 Phóng to
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setPreviewImage("");
                                                    setFormData({ ...formData, anh_dai_dien: "" });
                                                }}
                                                className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-semibold backdrop-blur-md transition-all cursor-pointer"
                                            >
                                                ✕ Gỡ ảnh
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nội dung bài viết */}
                            <div>
                                <label className="block text-slate-300 font-medium mb-1">
                                    Nội dung bài viết
                                </label>
                                <textarea
                                    rows={6}
                                    value={formData.noi_dung}
                                    onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                                    placeholder="Nhập nội dung chi tiết bài viết ở đây..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-violet-500 transition-colors leading-relaxed"
                                ></textarea>
                            </div>

                            {/* Nút hành động */}
                            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    {formLoading && (
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    <span>{editingPost ? "Lưu thay đổi" : "Tạo bài viết"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                7. LIGHTBOX XEM ẢNH FULL-SIZE SẮC NÉT
            ========================================================= */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in cursor-zoom-out"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0b0d1e] border border-white/20 shadow-2xl overflow-hidden cursor-default"
                    >
                        {/* Thanh tiêu đề Lightbox */}
                        <div className="flex items-center justify-between px-5 py-3.5 bg-black/50 border-b border-white/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <h4 className="text-xs font-bold text-white truncate max-w-md">
                                    {lightboxImage.title || "Xem ảnh bài viết chi tiết"}
                                </h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={lightboxImage.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                                >
                                    <span>Mở tab mới</span>
                                    <span>↗</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setLightboxImage(null)}
                                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Vùng hiển thị ảnh phóng to */}
                        <div className="p-2 sm:p-4 flex items-center justify-center bg-black/40 overflow-hidden">
                            <img
                                src={lightboxImage.url}
                                alt={lightboxImage.title || "Ảnh bài viết"}
                                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
