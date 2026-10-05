"use client";

import { useState, useEffect } from "react";
import {
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    restoreBrand,
    forceDeleteBrand,
} from "@/services/brandServices";
import Pagination from "@/components/common/Pagination";

// Hàm hỗ trợ tạo slug từ tên tiếng Việt
function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

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

export default function AdminBrandsPage() {
    // 1. Quản lý tab danh sách: "active" (Đang hoạt động) hoặc "trash" (Thùng rác)
    const [tab, setTab] = useState("active");
    const [trashCount, setTrashCount] = useState(0);

    // 2. Quản lý danh sách thương hiệu
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Phân trang 10 thương hiệu / trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");

    // 4. Quản lý Modal Thêm / Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null); // null = Thêm mới, object = Sửa

    // Dữ liệu Form
    const [formData, setFormData] = useState({
        ten: "",
        duong_dan: "",
        trang_thai: 1,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    // Tải danh sách thương hiệu (phân trang 10 mục / trang, hỗ trợ tab thùng rác)
    const loadBrands = async () => {
        try {
            setLoading(true);
            const isTrashTab = tab === "trash";
            const res = await getBrands(page, 10, search, isTrashTab);

            const items = res.data || res;
            setBrands(Array.isArray(items) ? items : []);

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

            // Cập nhật số lượng trong thùng rác
            if (res.trash_count !== undefined) {
                setTrashCount(res.trash_count);
            }
        } catch (error) {
            console.error("Lỗi khi tải thương hiệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, [page, search, tab]);

    // Mở Modal Thêm mới
    const handleOpenCreateModal = () => {
        setEditingBrand(null);
        setFormData({
            ten: "",
            duong_dan: "",
            trang_thai: 1,
        });
        setFormError("");
        setIsModalOpen(true);
    };

    // Mở Modal Sửa thương hiệu
    const handleOpenEditModal = (brand) => {
        setEditingBrand(brand);
        setFormData({
            ten: brand.ten || brand.name || brand.brand_name || "",
            duong_dan: brand.duong_dan || brand.slug || "",
            trang_thai: brand.trang_thai !== undefined ? Number(brand.trang_thai) : 1,
        });
        setFormError("");
        setIsModalOpen(true);
    };

    // Thay đổi tên thương hiệu -> tự động cập nhật slug
    const handleNameChange = (e) => {
        const val = e.target.value;
        setFormData((prev) => ({
            ...prev,
            ten: val,
            duong_dan: createSlug(val),
        }));
    };

    // Lưu Form (Thêm hoặc Sửa)
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.ten.trim()) {
            setFormError("Vui lòng nhập tên thương hiệu.");
            return;
        }

        if (!formData.duong_dan.trim()) {
            setFormError("Đường dẫn (slug) không được để trống.");
            return;
        }

        const payload = {
            ten: formData.ten.trim(),
            duong_dan: formData.duong_dan.trim(),
            trang_thai: Number(formData.trang_thai),
        };

        try {
            setFormLoading(true);
            if (editingBrand) {
                await updateBrand(editingBrand.id, payload);
                alert("✓ Cập nhật thương hiệu thành công!");
            } else {
                await createBrand(payload);
                alert("✓ Thêm thương hiệu mới thành công!");
            }

            setIsModalOpen(false);
            loadBrands();
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Có lỗi xảy ra, vui lòng thử lại!";
            setFormError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    // Xóa mềm thương hiệu (chuyển vào thùng rác)
    const handleSoftDelete = async (id, name) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn chuyển thương hiệu "${name}" (ID: ${id}) vào thùng rác?\n(Bạn vẫn có thể khôi phục lại bất kỳ lúc nào)`
        );
        if (!confirmDelete) return;

        try {
            await deleteBrand(id);
            alert("✓ Đã chuyển thương hiệu vào thùng rác!");
            loadBrands();
        } catch (error) {
            const msg = error.response?.data?.message || "❌ Không thể xóa thương hiệu này.";
            alert(msg);
        }
    };

    // Khôi phục thương hiệu từ thùng rác
    const handleRestore = async (id, name) => {
        try {
            await restoreBrand(id);
            alert(`✓ Đã khôi phục thành công thương hiệu "${name}"!`);
            loadBrands();
        } catch (error) {
            const msg = error.response?.data?.message || "❌ Khôi phục thất bại.";
            alert(msg);
        }
    };

    // Xóa vĩnh viễn thương hiệu khỏi CSDL
    const handleForceDelete = async (id, name) => {
        const confirmDelete = window.confirm(
            `⚠️ CẢNH BÁO NGUY HIỂM:\nBạn có chắc chắn muốn XÓA VĨNH VIỄN thương hiệu "${name}" (ID: ${id})?\nHành động này KHÔNG THỂ HOÀN TÁC!`
        );
        if (!confirmDelete) return;

        try {
            await forceDeleteBrand(id);
            alert("✓ Đã xóa vĩnh viễn thương hiệu!");
            loadBrands();
        } catch (error) {
            const msg = error.response?.data?.message || "❌ Xóa vĩnh viễn thất bại.";
            alert(msg);
        }
    };

    return (
        <div className="space-y-6">
            {/* =========================================================
                1. TIÊU ĐỀ TRANG VÀ NÚT THÊM
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Quản lý Thương hiệu
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Danh sách các đối tác thương hiệu chính hãng (10 thương hiệu / trang)
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Ô tìm kiếm */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm thương hiệu..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-56 sm:w-64 px-3.5 py-2 pl-9 rounded-xl border border-white/[0.08] bg-[#151728] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                        <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>

                    {/* Nút Thêm mới */}
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Thêm thương hiệu
                    </button>
                </div>
            </div>

            {/* =========================================================
                2. TABS CHUYỂN ĐỔI: TẤT CẢ VS THÙNG RÁC
            ========================================================= */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <button
                    type="button"
                    onClick={() => {
                        setTab("active");
                        setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        tab === "active"
                            ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <span>🏷️ Thương hiệu hoạt động</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        tab === "trash"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/10"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <span>🗑️ Thùng rác</span>
                    {trashCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                            {trashCount}
                        </span>
                    ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-slate-400">
                            0
                        </span>
                    )}
                </button>
            </div>

            {/* =========================================================
                3. BẢNG DANH SÁCH THƯƠNG HIỆU
            ========================================================= */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                <th className="py-3.5 px-4 w-16">ID</th>
                                <th className="py-3.5 px-4">Tên thương hiệu</th>
                                <th className="py-3.5 px-4">Đường dẫn (Slug)</th>
                                {tab === "active" ? (
                                    <th className="py-3.5 px-4">Trạng thái</th>
                                ) : (
                                    <th className="py-3.5 px-4">Thời gian xóa</th>
                                )}
                                <th className="py-3.5 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.04] text-xs text-slate-300">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        {tab === "trash"
                                            ? "Thùng rác trống. Không có thương hiệu nào bị xóa."
                                            : "Không tìm thấy thương hiệu nào."}
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-white/[0.02] transition-colors">
                                        {/* ID */}
                                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                                            #{brand.id}
                                        </td>

                                        {/* Tên thương hiệu với avatar ký tự đầu */}
                                        <td className="py-3.5 px-4 font-semibold text-white">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner uppercase ${
                                                    tab === "trash"
                                                        ? "bg-gradient-to-tr from-rose-600 to-amber-600 text-white"
                                                        : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white"
                                                }`}>
                                                    {(brand.ten || brand.name || "B").charAt(0)}
                                                </div>
                                                <span>{brand.ten || brand.name || brand.brand_name}</span>
                                            </div>
                                        </td>

                                        {/* Đường dẫn Slug */}
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                                            /{brand.duong_dan || brand.slug}
                                        </td>

                                        {/* Cột theo tab: Trạng thái hoặc Thời gian xóa */}
                                        {tab === "active" ? (
                                            <td className="py-3.5 px-4">
                                                {brand.trang_thai ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                        Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                        Đang ẩn
                                                    </span>
                                                )}
                                            </td>
                                        ) : (
                                            <td className="py-3.5 px-4 text-rose-300 font-mono text-[11px]">
                                                {formatDate(brand.deleted_at)}
                                            </td>
                                        )}

                                        {/* Thao tác */}
                                        <td className="py-3.5 px-4 text-right">
                                            {tab === "active" ? (
                                                <div className="inline-flex items-center gap-2">
                                                    {/* Nút Sửa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEditModal(brand)}
                                                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-medium transition-colors"
                                                    >
                                                        Sửa
                                                    </button>

                                                    {/* Nút Xóa mềm (vào thùng rác) */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSoftDelete(brand.id, brand.ten || brand.name)}
                                                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium transition-colors inline-flex items-center gap-1"
                                                        title="Chuyển vào thùng rác"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        Xóa
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2">
                                                    {/* Nút Khôi phục */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRestore(brand.id, brand.ten || brand.name)}
                                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-medium transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                                        Khôi phục
                                                    </button>

                                                    {/* Nút Xóa vĩnh viễn */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleForceDelete(brand.id, brand.ten || brand.name)}
                                                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-medium transition-colors shadow-sm shadow-rose-600/30 inline-flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        Xóa vĩnh viễn
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thanh phân trang 10 mục / trang */}
                <div className="p-4 border-t border-white/[0.06]">
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
                4. MODAL THÊM / SỬA THƯƠNG HIỆU
            ========================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#14162e] p-6 shadow-2xl relative space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <h3 className="text-base font-bold text-white">
                                {editingBrand ? "Chỉnh sửa Thương hiệu" : "Thêm Thương hiệu Mới"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Thông báo lỗi nếu có */}
                        {formError && (
                            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                                ⚠ {formError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* Tên thương hiệu */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Tên thương hiệu <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Apple, Samsung, Sony..."
                                    value={formData.ten}
                                    onChange={handleNameChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            {/* Đường dẫn Slug */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Đường dẫn (Slug) <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="apple"
                                    value={formData.duong_dan}
                                    onChange={(e) => setFormData({ ...formData, duong_dan: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                                />
                            </div>

                            {/* Trạng thái hoạt động */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.trang_thai}
                                    onChange={(e) => setFormData({ ...formData, trang_thai: Number(e.target.value) })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                                >
                                    <option value={1}>🟢 Hoạt động (Hiển thị)</option>
                                    <option value={0}>🔴 Ẩn (Tạm khóa)</option>
                                </select>
                            </div>

                            {/* Các nút bấm */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50"
                                >
                                    {formLoading ? "Đang lưu..." : editingBrand ? "Lưu thay đổi" : "Tạo thương hiệu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
