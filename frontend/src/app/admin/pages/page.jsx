"use client";

import { useState, useEffect } from "react";
import {
    getPages,
    getTrashPages,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    restorePage,
    forceDeletePage,
} from "@/services/pageServices";
import Pagination from "@/components/common/Pagination";

// Hàm định dạng ngày giờ chuẩn tiếng Việt
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

/**
 * =========================================================================
 * TRANG QUẢN LÝ TRANG ĐƠN (ADMIN PAGES MANAGEMENT)
 * Thiết kế giao diện Dark Luxury đồng bộ với TECHNOVA Dashboard
 * Đầy đủ tính năng:
 *  - Phân trang, Tìm kiếm, Lọc trạng thái xuất bản
 *  - Thêm mới trang đơn (Tự động tạo Slug chuẩn SEO)
 *  - Xem chi tiết & Xem trước nội dung HTML
 *  - Chỉnh sửa trang đơn
 *  - Xóa mềm (Thùng rác) & Khôi phục
 *  - Xóa vĩnh viễn có hộp thoại xác nhận an toàn
 * =========================================================================
 */
export default function AdminPagesPage() {
    // 1. Quản lý tab: "active" (Danh sách) hoặc "trash" (Thùng rác)
    const [tab, setTab] = useState("active");
    const [trashCount, setTrashCount] = useState(0);

    // 2. Dữ liệu danh sách
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Phân trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // 4. Tìm kiếm & Lọc
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // 5. Modal Thêm / Sửa
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null); // null = Thêm mới, object = Sửa

    // Form data
    const [formData, setFormData] = useState({
        tieu_de: "",
        duong_dan: "",
        noi_dung: "",
        trang_thai: 1,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    // 6. Modal Xem chi tiết
    const [viewingPage, setViewingPage] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // 7. Modal Xác nhận xóa
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState("soft"); // "soft" | "force"
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Tự sinh Slug từ Tiêu đề
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const autoSlug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");

        setFormData((prev) => ({
            ...prev,
            tieu_de: title,
            duong_dan: editingPage ? prev.duong_dan : autoSlug,
        }));
    };

    // Load danh sách trang đơn từ API
    const loadPages = async () => {
        try {
            setLoading(true);
            const isTrash = tab === "trash";

            const res = isTrash
                ? await getTrashPages(page, 10, search)
                : await getPages(page, 10, search, filterStatus, false);

            const items = res?.data || [];
            setPages(items);

            if (res?.meta) {
                setTotalPages(res.meta.last_page || 1);
                setTotalItems(res.meta.total || 0);
                if (typeof res.meta.trash_count === "number") {
                    setTrashCount(res.meta.trash_count);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách trang đơn:", error);
            setPages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, [page, tab, filterStatus]);

    // Tìm kiếm với Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        loadPages();
    };

    // Mở Modal Thêm mới
    const handleOpenCreateModal = () => {
        setEditingPage(null);
        setFormData({
            tieu_de: "",
            duong_dan: "",
            noi_dung: "",
            trang_thai: 1,
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Sửa
    const handleOpenEditModal = (item) => {
        setEditingPage(item);
        setFormData({
            tieu_de: item.tieu_de || "",
            duong_dan: item.duong_dan || "",
            noi_dung: item.noi_dung || "",
            trang_thai: item.trang_thai ? 1 : 0,
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Xem chi tiết
    const handleOpenViewModal = (item) => {
        setViewingPage(item);
        setIsViewModalOpen(true);
    };

    // Mở Modal xác nhận xóa
    const handleOpenDeleteConfirm = (item, type) => {
        setDeleteTarget(item);
        setDeleteType(type);
        setIsDeleteModalOpen(true);
    };

    // Xử lý gửi Form Thêm / Sửa
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.tieu_de.trim()) {
            setFormError("Vui lòng nhập tiêu đề trang đơn!");
            return;
        }

        try {
            setFormLoading(true);

            if (editingPage) {
                await updatePage(editingPage.id, formData);
            } else {
                await createPage(formData);
            }

            setIsFormModalOpen(false);
            loadPages();
        } catch (error) {
            console.error("Lỗi khi lưu trang đơn:", error);
            setFormError(error.response?.data?.message || "Có lỗi xảy ra khi lưu trang đơn!");
        } finally {
            setFormLoading(false);
        }
    };

    // Xử lý Khôi phục từ thùng rác
    const handleRestore = async (id) => {
        try {
            await restorePage(id);
            loadPages();
        } catch (error) {
            console.error("Lỗi khi khôi phục trang đơn:", error);
            alert("Lỗi khi khôi phục: " + (error.response?.data?.message || error.message));
        }
    };

    // Xử lý Xóa (Xóa mềm hoặc Xóa vĩnh viễn)
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            if (deleteType === "soft") {
                await deletePage(deleteTarget.id);
            } else {
                await forceDeletePage(deleteTarget.id);
            }

            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
            loadPages();
        } catch (error) {
            console.error("Lỗi khi xóa trang đơn:", error);
            alert("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER TIÊU ĐỀ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                            📄
                        </span>
                        Quản Lý Trang Đơn (Single Pages)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Quản lý các trang tĩnh như Giới thiệu, Chính sách bảo hành, Điều khoản dịch vụ và Hướng dẫn mua hàng.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <span>➕</span>
                        <span>Tạo Trang Đơn Mới</span>
                    </button>
                </div>
            </div>

            {/* THANH TAB CHUYỂN ĐỔI: DANH SÁCH / THÙNG RÁC */}
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => { setTab("active"); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            tab === "active"
                                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <span>📑 Danh Sách Trang</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
                            {tab === "active" ? totalItems : "—"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setTab("trash"); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            tab === "trash"
                                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <span>🗑️ Thùng Rác</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/30 text-rose-300">
                            {trashCount}
                        </span>
                    </button>
                </div>

                <div className="text-xs text-slate-400">
                    Tổng cộng: <strong className="text-white">{totalItems}</strong> trang
                </div>
            </div>

            {/* BỘ LỌC & TÌM KIẾM */}
            <div className="p-4 rounded-2xl bg-[#0c0e1e]/60 border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-md relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
                        className="w-full pl-10 pr-24 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                        🔍
                    </span>
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold transition-all"
                    >
                        Tìm
                    </button>
                </form>

                {tab === "active" && (
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-xs text-slate-400 whitespace-nowrap">Trạng thái:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                        >
                            <option value="all" className="bg-[#0c0e1e]">Tất cả trạng thái</option>
                            <option value="1" className="bg-[#0c0e1e]">Đang xuất bản (Hiện)</option>
                            <option value="0" className="bg-[#0c0e1e]">Bản nháp (Ẩn)</option>
                        </select>
                    </div>
                )}
            </div>

            {/* BẢNG DỮ LIỆU TRANG ĐƠN */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e1e]/80 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.03] border-b border-white/[0.06] text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                            <tr>
                                <th className="py-3.5 px-4 w-12 text-center">#</th>
                                <th className="py-3.5 px-4 min-w-[220px]">Tiêu đề trang</th>
                                <th className="py-3.5 px-4 min-w-[180px]">Đường dẫn (Slug)</th>
                                <th className="py-3.5 px-4 min-w-[130px] text-center">Trạng thái</th>
                                <th className="py-3.5 px-4 min-w-[140px]">Ngày tạo</th>
                                <th className="py-3.5 px-4 min-w-[150px] text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="inline-block animate-spin text-xl mb-2">⏳</div>
                                        <p>Đang tải dữ liệu trang đơn...</p>
                                    </td>
                                </tr>
                            ) : pages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <span className="text-3xl block mb-2">📭</span>
                                        {tab === "trash" ? "Thùng rác hiện đang trống!" : "Chưa có trang đơn nào phù hợp với tìm kiếm."}
                                    </td>
                                </tr>
                            ) : (
                                pages.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4 text-center text-slate-500">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-white hover:text-violet-400 transition-colors cursor-pointer" onClick={() => handleOpenViewModal(item)}>
                                                {item.tieu_de}
                                            </div>
                                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                {item.noi_dung ? item.noi_dung.replace(/<[^>]*>?/gm, "").substring(0, 60) + "..." : "Chưa có nội dung"}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-violet-300 font-mono text-[11px]">
                                                /{item.duong_dan}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {item.trang_thai ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                    Hiển thị
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                    Bản nháp
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {tab === "active" ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenViewModal(item)}
                                                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-blue-400 hover:text-blue-300 transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            👁️
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(item)}
                                                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-amber-400 hover:text-amber-300 transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenDeleteConfirm(item, "soft")}
                                                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors"
                                                            title="Chuyển vào thùng rác"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRestore(item.id)}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-semibold transition-colors flex items-center gap-1"
                                                        >
                                                            <span>🔄</span> Khôi phục
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenDeleteConfirm(item, "force")}
                                                            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-[11px] font-semibold transition-colors flex items-center gap-1"
                                                        >
                                                            <span>⚠️</span> Xóa hẳn
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Trang {page} / {totalPages}
                        </span>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
            </div>

            {/* =========================================================================
                MODAL THÊM / SỬA TRANG ĐƠN
            ========================================================================= */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="max-w-2xl w-full bg-[#0c0e1e] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <span>{editingPage ? "✏️ Chỉnh Sửa Trang Đơn" : "➕ Thêm Mới Trang Đơn"}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {formError && (
                            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                                <span>⚠️</span>
                                <span>{formError}</span>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* Tiêu đề */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Tiêu Đề Trang Đơn <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.tieu_de}
                                    onChange={handleTitleChange}
                                    required
                                    placeholder="Ví dụ: Chính sách bảo mật & quyền riêng tư"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                />
                            </div>

                            {/* Slug / Đường dẫn */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Đường Dẫn Slug (Tự động sinh hoặc tùy chỉnh)
                                </label>
                                <div className="flex items-center">
                                    <span className="px-3 py-2.5 rounded-l-xl bg-white/[0.06] border border-r-0 border-white/[0.1] text-xs text-slate-400 font-mono">
                                        /
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.duong_dan}
                                        onChange={(e) => setFormData({ ...formData, duong_dan: e.target.value })}
                                        placeholder="chinh-sach-bao-mat"
                                        className="w-full px-4 py-2.5 rounded-r-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Nội dung trang */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nội Dung Trang (Hỗ trợ HTML / Văn bản)
                                </label>
                                <textarea
                                    rows={8}
                                    value={formData.noi_dung}
                                    onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                                    placeholder="Nhập nội dung bài viết, điều khoản hoặc HTML..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-mono resize-y"
                                />
                                <span className="text-[11px] text-slate-500">Có thể dùng các thẻ &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;b&gt; để định dạng đẹp mắt.</span>
                            </div>

                            {/* Trạng thái */}
                            <div className="space-y-1.5 pt-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Trạng Thái Xuất Bản
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                                        <input
                                            type="radio"
                                            name="trang_thai"
                                            checked={formData.trang_thai === 1}
                                            onChange={() => setFormData({ ...formData, trang_thai: 1 })}
                                            className="text-violet-600 focus:ring-violet-500"
                                        />
                                        <span>🟢 Hiển thị công khai</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                                        <input
                                            type="radio"
                                            name="trang_thai"
                                            checked={formData.trang_thai === 0}
                                            onChange={() => setFormData({ ...formData, trang_thai: 0 })}
                                            className="text-violet-600 focus:ring-violet-500"
                                        />
                                        <span>⚪ Bản nháp (Ẩn)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-xs text-slate-300 hover:bg-white/[0.06] transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                                >
                                    {formLoading ? "Đang lưu..." : editingPage ? "Cập Nhật Trang" : "Tạo Trang Mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================================
                MODAL XEM CHI TIẾT TRANG ĐƠN
            ========================================================================= */}
            {isViewModalOpen && viewingPage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="max-w-2xl w-full bg-[#0c0e1e] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                            <div>
                                <h3 className="text-lg font-black text-white">
                                    {viewingPage.tieu_de}
                                </h3>
                                <span className="text-xs text-violet-400 font-mono">
                                    /{viewingPage.duong_dan}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Nội dung trang đơn */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs leading-relaxed text-slate-300 space-y-3 prose prose-invert max-w-none">
                            {viewingPage.noi_dung ? (
                                <div dangerouslySetInnerHTML={{ __html: viewingPage.noi_dung }} />
                            ) : (
                                <p className="italic text-slate-500">Chưa có nội dung chi tiết cho trang này.</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/[0.06]">
                            <span>Ngày tạo: {formatDate(viewingPage.created_at)}</span>
                            <span>Trạng thái: {viewingPage.trang_thai ? "🟢 Hiển thị" : "⚪ Bản nháp"}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================================
                MODAL XÁC NHẬN XÓA (XÓA MỀM & XÓA VĨNH VIỄN)
            ========================================================================= */}
            {isDeleteModalOpen && deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="max-w-md w-full bg-[#0c0e1e] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5 text-center">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl">
                            {deleteType === "soft" ? "🗑️" : "⚠️"}
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="text-base font-bold text-white">
                                {deleteType === "soft" ? "Chuyển vào thùng rác?" : "Xóa vĩnh viễn trang đơn?"}
                            </h3>
                            <p className="text-xs text-slate-400">
                                {deleteType === "soft"
                                    ? `Bạn có chắc muốn chuyển trang "${deleteTarget.tieu_de}" vào thùng rác? Bạn có thể khôi phục lại bất kỳ lúc nào.`
                                    : `Hành động này sẽ XÓA HOÀN TOÀN trang "${deleteTarget.tieu_de}" khỏi cơ sở dữ liệu và không thể hoàn tác!`
                                }
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-xs text-slate-300 hover:bg-white/[0.06] transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                                    deleteType === "soft"
                                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                                        : "bg-red-700 hover:bg-red-600 shadow-red-700/30"
                                }`}
                            >
                                {deleteType === "soft" ? "Chuyển vào thùng rác" : "Xóa vĩnh viễn"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
