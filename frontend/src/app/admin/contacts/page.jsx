"use client";

import { useEffect, useState, useMemo } from "react";
import {
    getContacts,
    replyContact,
    deleteContact,
    bulkDeleteContacts,
} from "@/services/contactServices";

/**
 * TRANG QUẢN LÝ LIÊN HỆ & GÓP Ý (DÀNH CHO ADMIN)
 * Chức năng:
 * 1. Xem danh sách liên hệ, phân trang, tìm kiếm
 * 2. Lọc theo trạng thái xử lý: Tất cả, Chưa xử lý, Đang xử lý, Đã xử lý
 * 3. Xem chi tiết nội dung liên hệ & Ghi nhận phản hồi / chuyển trạng thái
 * 4. Xóa liên hệ đã xử lý (chỉ cho phép xóa khi đã ở trạng thái 'da_xu_ly')
 */
export default function AdminContactsPage() {
    // Danh sách & trạng thái dữ liệu
    const [contacts, setContacts] = useState([]);
    const [counts, setCounts] = useState({ all: 0, chua_xu_ly: 0, dang_xu_ly: 0, da_xu_ly: 0 });
    const [loading, setLoading] = useState(true);

    // Bộ lọc & Phân trang
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });

    // Chọn nhiều mục (bulk action)
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal Xem chi tiết & Phản hồi
    const [selectedContact, setSelectedContact] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyStatus, setReplyStatus] = useState("da_xu_ly");
    const [isReplying, setIsReplying] = useState(false);

    // Modal Xác nhận xóa
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Thông báo Toast / Alert
    const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

    const showAlert = (message, type = "success") => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: "", type: "success" });
        }, 5000);
    };

    // Debounce tìm kiếm
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Tải danh sách liên hệ từ Backend API
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await getContacts(currentPage, 10, debouncedSearch, statusFilter);
            const dataList = Array.isArray(res?.data) ? res.data : [];
            setContacts(dataList);

            if (res?.counts) {
                setCounts(res.counts);
            }
            if (res?.meta) {
                setMeta(res.meta);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách liên hệ:", error);
            showAlert("Không thể tải danh sách liên hệ từ máy chủ.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
        setSelectedIds([]);
    }, [currentPage, statusFilter, debouncedSearch]);

    // Mở modal xem chi tiết & phản hồi
    const handleOpenDetail = (contact) => {
        setSelectedContact(contact);
        setReplyText(contact.noi_dung_phan_hoi || "");
        setReplyStatus(contact.trang_thai === "chua_xu_ly" ? "da_xu_ly" : contact.trang_thai);
        setIsDetailModalOpen(true);
    };

    // Gửi phản hồi / ghi nhận xử lý
    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!selectedContact) return;

        try {
            setIsReplying(true);
            const payload = {
                trang_thai: replyStatus,
                noi_dung_phan_hoi: replyText.trim(),
            };

            await replyContact(selectedContact.id, payload);
            showAlert("Đã lưu phản hồi và ghi nhận xử lý liên hệ thành công!", "success");
            setIsDetailModalOpen(false);
            fetchContacts();
        } catch (error) {
            console.error("Lỗi khi lưu phản hồi:", error);
            const msg = error?.response?.data?.message || "Có lỗi xảy ra khi lưu phản hồi.";
            showAlert(msg, "error");
        } finally {
            setIsReplying(false);
        }
    };

    // Mở modal xác nhận xóa 1 liên hệ
    const handleOpenDelete = (contact) => {
        if (contact.trang_thai !== "da_xu_ly") {
            showAlert("Chỉ có thể xóa liên hệ đã xử lý! Vui lòng phản hồi hoặc chuyển sang trạng thái 'Đã xử lý' trước.", "warning");
            return;
        }
        setDeleteTarget(contact);
        setIsDeleteModalOpen(true);
    };

    // Thực hiện xóa 1 liên hệ đã xử lý
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setIsDeleting(true);
            await deleteContact(deleteTarget.id);
            showAlert("Đã xóa liên hệ đã xử lý thành công!", "success");
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
            fetchContacts();
        } catch (error) {
            console.error("Lỗi khi xóa liên hệ:", error);
            const msg = error?.response?.data?.message || "Không thể xóa liên hệ này.";
            showAlert(msg, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    // Thực hiện xóa hàng loạt liên hệ đã xử lý
    const handleConfirmBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            setIsDeleting(true);
            const res = await bulkDeleteContacts(selectedIds);
            showAlert(res?.message || "Đã xóa các liên hệ đã xử lý đã chọn thành công!", "success");
            setIsBulkDeleteModalOpen(false);
            setSelectedIds([]);
            fetchContacts();
        } catch (error) {
            console.error("Lỗi khi xóa hàng loạt:", error);
            const msg = error?.response?.data?.message || "Có lỗi khi xóa danh sách liên hệ.";
            showAlert(msg, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    // Xử lý chọn checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(contacts.map((c) => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Đếm số liên hệ đã xử lý trong nhóm được chọn (để cho phép xóa bulk)
    const selectedResolvedCount = useMemo(() => {
        return contacts.filter((c) => selectedIds.includes(c.id) && c.trang_thai === "da_xu_ly").length;
    }, [contacts, selectedIds]);

    // Định dạng ngày giờ
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const d = new Date(dateString);
            return d.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    // Badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case "chua_xu_ly":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Chưa xử lý
                    </span>
                );
            case "dang_xu_ly":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        Đang xử lý
                    </span>
                );
            case "da_xu_ly":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Đã xử lý
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700 text-slate-300">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* THÔNG BÁO ALERT NỔI */}
            {alert.show && (
                <div
                    className={`fixed top-20 right-8 z-50 max-w-md p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-sm border backdrop-blur-md transition-all ${
                        alert.type === "success"
                            ? "bg-emerald-950/90 text-emerald-200 border-emerald-700/50"
                            : alert.type === "warning"
                            ? "bg-amber-950/90 text-amber-200 border-amber-700/50"
                            : "bg-rose-950/90 text-rose-200 border-rose-700/50"
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">
                            {alert.type === "success" ? "✓" : alert.type === "warning" ? "⚠️" : "✕"}
                        </span>
                        <p>{alert.message}</p>
                    </div>
                    <button
                        onClick={() => setAlert({ show: false, message: "", type: "success" })}
                        className="text-xs opacity-60 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* TIÊU ĐỀ TRANG & MÔ TẢ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </span>
                        Quản Lý Liên Hệ &amp; Góp Ý
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Xem, tiếp nhận xử lý, phản hồi yêu cầu khách hàng và xóa các liên hệ đã xử lý hoàn tất.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchContacts()}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] transition-all cursor-pointer"
                        title="Tải lại danh sách"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                        <span>Làm mới</span>
                    </button>

                    {/* Nút Xóa hàng loạt liên hệ đã xử lý */}
                    {selectedResolvedCount > 0 && (
                        <button
                            onClick={() => setIsBulkDeleteModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer shadow-lg shadow-rose-900/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            <span>Xóa ({selectedResolvedCount}) liên hệ đã xử lý</span>
                        </button>
                    )}
                </div>
            </div>

            {/* CÁC THẺ THỐNG KÊ TỔNG QUAN */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                    onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "all"
                            ? "bg-violet-600/15 border-violet-500/40 shadow-lg shadow-violet-500/10"
                            : "bg-[#0f1126] border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                >
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Tất cả liên hệ
                    </div>
                    <div className="text-2xl font-black text-white mt-1">
                        {counts.all || 0}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Tổng số tiếp nhận
                    </div>
                </div>

                <div
                    onClick={() => { setStatusFilter("chua_xu_ly"); setCurrentPage(1); }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "chua_xu_ly"
                            ? "bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10"
                            : "bg-[#0f1126] border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                >
                    <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Chưa xử lý</span>
                        {counts.chua_xu_ly > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        )}
                    </div>
                    <div className="text-2xl font-black text-amber-400 mt-1">
                        {counts.chua_xu_ly || 0}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Cần xem &amp; phản hồi
                    </div>
                </div>

                <div
                    onClick={() => { setStatusFilter("dang_xu_ly"); setCurrentPage(1); }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "dang_xu_ly"
                            ? "bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10"
                            : "bg-[#0f1126] border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                >
                    <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                        Đang xử lý
                    </div>
                    <div className="text-2xl font-black text-sky-400 mt-1">
                        {counts.dang_xu_ly || 0}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Đang trao đổi hỗ trợ
                    </div>
                </div>

                <div
                    onClick={() => { setStatusFilter("da_xu_ly"); setCurrentPage(1); }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        statusFilter === "da_xu_ly"
                            ? "bg-emerald-500/15 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                            : "bg-[#0f1126] border-white/[0.06] hover:border-white/[0.15]"
                    }`}
                >
                    <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                        Đã xử lý
                    </div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                        {counts.da_xu_ly || 0}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                        Có thể xóa an toàn
                    </div>
                </div>
            </div>

            {/* BỘ LỌC TAB VÀ THANH TÌM KIẾM */}
            <div className="p-4 rounded-2xl bg-[#0f1126] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs trạng thái */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            statusFilter === "all"
                                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                    >
                        Tất cả ({counts.all || 0})
                    </button>
                    <button
                        onClick={() => { setStatusFilter("chua_xu_ly"); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            statusFilter === "chua_xu_ly"
                                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                                : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10"
                        }`}
                    >
                        Chưa xử lý ({counts.chua_xu_ly || 0})
                    </button>
                    <button
                        onClick={() => { setStatusFilter("dang_xu_ly"); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            statusFilter === "dang_xu_ly"
                                ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                                : "text-sky-400/80 hover:text-sky-300 hover:bg-sky-500/10"
                        }`}
                    >
                        Đang xử lý ({counts.dang_xu_ly || 0})
                    </button>
                    <button
                        onClick={() => { setStatusFilter("da_xu_ly"); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            statusFilter === "da_xu_ly"
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                : "text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-500/10"
                        }`}
                    >
                        Đã xử lý ({counts.da_xu_ly || 0})
                    </button>
                </div>

                {/* Ô tìm kiếm */}
                <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm tên, email, SĐT, tiêu đề..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* BẢNG DANH SÁCH LIÊN HỆ */}
            <div className="bg-[#0f1126] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                <th className="p-4 w-10 text-center">
                                    <input
                                        type="checkbox"
                                        checked={contacts.length > 0 && selectedIds.length === contacts.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4 w-16">Mã</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Tiêu đề &amp; Nội dung</th>
                                <th className="p-4 w-36">Thời gian gửi</th>
                                <th className="p-4 w-32">Trạng thái</th>
                                <th className="p-4 w-36 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <svg className="animate-spin h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            <span>Đang tải danh sách liên hệ...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-3xl">📬</span>
                                            <p className="font-semibold text-slate-300">Không tìm thấy liên hệ nào</p>
                                            <p className="text-[11px] text-slate-500 max-w-sm">
                                                {statusFilter !== "all" || searchTerm
                                                    ? "Thử đổi trạng thái lọc hoặc xóa từ khóa tìm kiếm."
                                                    : "Hiện tại chưa có khách hàng nào gửi góp ý hoặc yêu cầu hỗ trợ."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((item) => {
                                    const isResolved = item.trang_thai === "da_xu_ly";
                                    const isSelected = selectedIds.includes(item.id);

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`hover:bg-white/[0.02] transition-colors ${
                                                isSelected ? "bg-violet-950/20" : ""
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="p-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOne(item.id)}
                                                    className="rounded border-slate-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                                />
                                            </td>

                                            {/* ID */}
                                            <td className="p-4 font-mono font-bold text-slate-400">
                                                #{item.id}
                                            </td>

                                            {/* Khách hàng */}
                                            <td className="p-4">
                                                <div className="font-semibold text-white text-xs">
                                                    {item.ten}
                                                </div>
                                                <div className="text-slate-400 text-[11px] mt-0.5">
                                                    {item.email}
                                                </div>
                                                {item.so_dien_thoai && (
                                                    <div className="text-slate-500 text-[10px] mt-0.5 flex items-center gap-1">
                                                        <span>📞</span>
                                                        <span>{item.so_dien_thoai}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Tiêu đề & Nội dung */}
                                            <td className="p-4 max-w-xs md:max-w-md">
                                                <div className="font-semibold text-slate-200 truncate">
                                                    {item.tieu_de || "Yêu cầu hỗ trợ & góp ý"}
                                                </div>
                                                <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                                                    {item.noi_dung}
                                                </p>
                                                {item.noi_dung_phan_hoi && (
                                                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                                                        <span>✓ Đã phản hồi:</span>
                                                        <span className="truncate max-w-[200px]">
                                                            {item.noi_dung_phan_hoi}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Thời gian */}
                                            <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                                                {formatDate(item.created_at)}
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="p-4 whitespace-nowrap">
                                                {renderStatusBadge(item.trang_thai)}
                                            </td>

                                            {/* Thao tác */}
                                            <td className="p-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {/* Nút Xem chi tiết & Phản hồi */}
                                                    <button
                                                        onClick={() => handleOpenDetail(item)}
                                                        className="px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
                                                        title="Xem chi tiết & Phản hồi"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                        <span>Phản hồi</span>
                                                    </button>

                                                    {/* Nút Xóa (Chỉ cho phép xóa khi ĐÃ XỬ LÝ) */}
                                                    {isResolved ? (
                                                        <button
                                                            onClick={() => handleOpenDelete(item)}
                                                            className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
                                                            title="Xóa liên hệ đã xử lý này"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="p-1.5 rounded-lg bg-white/[0.02] text-slate-600 border border-white/[0.04] cursor-not-allowed opacity-50"
                                                            title="Chỉ có thể xóa liên hệ đã được xử lý"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
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

                {/* PHÂN TRANG */}
                {!loading && meta.total > 0 && (
                    <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <div>
                            Hiển thị{" "}
                            <span className="text-white font-semibold">
                                {contacts.length}
                            </span>{" "}
                            / <span className="text-white font-semibold">{meta.total}</span> liên hệ
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                ← Trang trước
                            </button>
                            <span className="px-3 py-1 text-slate-300 font-medium">
                                Trang {currentPage} / {meta.last_page || 1}
                            </span>
                            <button
                                disabled={currentPage >= meta.last_page}
                                onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                                className="px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Trang sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* MODAL XEM CHI TIẾT & PHẢN HỒI LIÊN HỆ */}
            {/* ========================================================================= */}
            {isDetailModalOpen && selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f1129] border border-white/[0.1] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </span>
                                <div>
                                    <h2 className="text-base font-bold text-white">
                                        Chi Tiết &amp; Phản Hồi Liên Hệ #{selectedContact.id}
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Gửi lúc {formatDate(selectedContact.created_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Nội dung Modal */}
                        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                            {/* Thông tin người gửi */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Họ và tên</span>
                                    <span className="font-bold text-white text-xs mt-0.5 block">{selectedContact.ten}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Email liên lạc</span>
                                    <a href={`mailto:${selectedContact.email}`} className="text-violet-400 hover:underline text-xs mt-0.5 block">
                                        {selectedContact.email}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Số điện thoại</span>
                                    <span className="text-slate-200 text-xs mt-0.5 block">
                                        {selectedContact.so_dien_thoai || "Chưa cung cấp"}
                                    </span>
                                </div>
                            </div>

                            {/* Tiêu đề & Nội dung người dùng gửi */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                                        Chủ đề / Tiêu đề
                                    </span>
                                    <div>{renderStatusBadge(selectedContact.trang_thai)}</div>
                                </div>
                                <h3 className="text-sm font-bold text-white">
                                    {selectedContact.tieu_de || "Yêu cầu hỗ trợ & góp ý"}
                                </h3>
                                <div className="pt-2 border-t border-white/[0.06]">
                                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                                        Nội dung khách gửi:
                                    </span>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-black/30 p-3.5 rounded-xl border border-white/[0.04]">
                                        {selectedContact.noi_dung}
                                    </p>
                                </div>
                            </div>

                            {/* Lịch sử phản hồi trước đó nếu có */}
                            {selectedContact.noi_dung_phan_hoi && (
                                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                                    <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
                                        <span>✓ Đã ghi nhận phản hồi trước đó:</span>
                                        <span className="text-[10px] text-emerald-400/80">
                                            {formatDate(selectedContact.ngay_phan_hoi || selectedContact.updated_at)}
                                        </span>
                                    </div>
                                    <p className="text-slate-200 whitespace-pre-line leading-relaxed pt-1">
                                        {selectedContact.noi_dung_phan_hoi}
                                    </p>
                                </div>
                            )}

                            {/* Form Phản hồi & Cập nhật trạng thái */}
                            <form onSubmit={handleSubmitReply} id="reply-form" className="space-y-4 pt-2">
                                <div className="border-t border-white/[0.08] pt-4">
                                    <label className="block font-semibold text-white mb-1.5 text-xs">
                                        Nội dung phản hồi / Ghi chú xử lý:
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Nhập nội dung giải đáp, kết quả xử lý hỗ trợ cho khách hàng..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-y"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <label className="block font-semibold text-white mb-1.5 text-xs">
                                            Cập nhật trạng thái xử lý:
                                        </label>
                                        <select
                                            value={replyStatus}
                                            onChange={(e) => setReplyStatus(e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                                        >
                                            <option value="chua_xu_ly" className="bg-[#0f1129]">
                                                Chưa xử lý (Chờ tiếp nhận)
                                            </option>
                                            <option value="dang_xu_ly" className="bg-[#0f1129]">
                                                Đang xử lý (Đang trao đổi hỗ trợ)
                                            </option>
                                            <option value="da_xu_ly" className="bg-[#0f1129]">
                                                Đã xử lý (Hoàn tất phản hồi)
                                            </option>
                                        </select>
                                    </div>

                                    <div className="text-[11px] text-slate-400 sm:pt-4">
                                        💡 Sau khi chuyển sang <strong className="text-emerald-400">"Đã xử lý"</strong>, bạn sẽ có quyền xóa bản ghi này nếu không còn nhu cầu lưu trữ.
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06] text-xs font-medium transition-all"
                            >
                                Đóng
                            </button>
                            <button
                                type="submit"
                                form="reply-form"
                                disabled={isReplying}
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                            >
                                {isReplying ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <span>Ghi nhận &amp; Cập nhật</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL XÁC NHẬN XÓA 1 LIÊN HỆ ĐÃ XỬ LÝ */}
            {/* ========================================================================= */}
            {isDeleteModalOpen && deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f1129] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-xl">
                            🗑️
                        </div>
                        <h3 className="text-base font-bold text-white text-center mb-1">
                            Xác nhận xóa liên hệ đã xử lý?
                        </h3>
                        <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
                            Bạn đang chuẩn bị xóa liên hệ <strong className="text-white">#{deleteTarget.id}</strong> của khách hàng{" "}
                            <strong className="text-white">{deleteTarget.ten}</strong>.
                            <br />
                            Thao tác này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống.
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => { setIsDeleteModalOpen(false); setDeleteTarget(null); }}
                                className="px-4 py-2 rounded-xl border border-white/[0.1] text-slate-300 hover:bg-white/[0.06] text-xs font-medium transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL XÁC NHẬN XÓA HÀNG LOẠT LIÊN HỆ ĐÃ XỬ LÝ */}
            {/* ========================================================================= */}
            {isBulkDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0f1129] border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-xl">
                            ⚠️
                        </div>
                        <h3 className="text-base font-bold text-white text-center mb-1">
                            Xóa {selectedResolvedCount} liên hệ đã xử lý?
                        </h3>
                        <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
                            Hệ thống sẽ chỉ xóa những liên hệ đang ở trạng thái <strong className="text-emerald-400">"Đã xử lý"</strong>. Các liên hệ chưa xử lý sẽ được giữ nguyên an toàn.
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsBulkDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-white/[0.1] text-slate-300 hover:bg-white/[0.06] text-xs font-medium transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmBulkDelete}
                                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isDeleting ? "Đang xóa..." : "Xác nhận xóa hàng loạt"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
