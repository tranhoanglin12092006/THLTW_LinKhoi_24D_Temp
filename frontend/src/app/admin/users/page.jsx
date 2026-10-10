"use client";

import { useState, useEffect } from "react";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleLockUser,
    changeUserRole,
    restoreUser,
    forceDeleteUser,
} from "@/services/userServices";
import Pagination from "@/components/common/Pagination";

// Hàm định dạng ngày giờ hiển thị
function formatDate(dateString) {
    if (!dateString) return "—"; // nếu không có ngày thì hiển thị dấu gạch ngang.
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { //định dạng theo quy ước tiếng Việt.
        day: "2-digit", //hiển thị ngày, tháng hoặc giờ bằng hai chữ số khi cần.
        month: "2-digit", //hiển thị năm bằng số.
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AdminUsersPage() {
    // 1. Quản lý tab danh sách: "active" (Đang hoạt động) hoặc "trash" (Thùng rác)
    const [tab, setTab] = useState("active");
    const [trashCount, setTrashCount] = useState(0);

    // 2. Danh sách người dùng
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Phân trang 10 mục / trang
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // 4. Tìm kiếm & Lọc
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // 5. Quản lý Modal Thêm / Sửa
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null = Thêm mới, object = Sửa

    // Dữ liệu Form Thêm / Sửa
    const [formData, setFormData] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: "",
        mat_khau: "",
        vai_tro: "member",
        trang_thai: 1,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    // 6. Quản lý Modal Xem Chi Tiết
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    // Tải danh sách người dùng
    const loadUsers = async () => {
        try {
            setLoading(true);
            const isTrashTab = tab === "trash";
            const res = await getUsers(
                page,
                10,
                search,
                filterRole,
                filterStatus,
                isTrashTab
            );

            const items = res.data || res;
            setUsers(Array.isArray(items) ? items : []);

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
            if (res.trash_count !== undefined) { //Chỉ cập nhật trashCount khi API có trả về trường trash_count.
                setTrashCount(res.trash_count);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, search, filterRole, filterStatus, tab]);

    // Mở Modal Thêm mới
    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setFormData({
            ho_ten: "",
            email: "",
            so_dien_thoai: "",
            dia_chi: "",
            mat_khau: "",
            vai_tro: "member",
            trang_thai: 1,
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Sửa người dùng
    const handleOpenEditModal = (u) => {
        setEditingUser(u);
        setFormData({
            ho_ten: u.ho_ten || "",
            email: u.email || "",
            so_dien_thoai: u.so_dien_thoai || "",
            dia_chi: u.dia_chi || "",
            mat_khau: "", // Để trống nếu không muốn đổi mật khẩu
            vai_tro: u.vai_tro || "member",
            trang_thai: u.trang_thai !== undefined ? Number(u.trang_thai) : 1,
        });
        setFormError("");
        setIsFormModalOpen(true);
    };

    // Mở Modal Xem chi tiết
    const handleOpenViewModal = (u) => {
        setViewingUser(u); //lấy thông tin người dùng để hiển thị trong modal.
        setIsViewModalOpen(true);
    };

    // Lưu Form (Thêm hoặc Sửa)
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.ho_ten.trim()) {
            setFormError("Vui lòng nhập họ và tên người dùng.");
            return;
        }

        if (!formData.email.trim()) {
            setFormError("Vui lòng nhập địa chỉ email.");
            return;
        }

        if (!editingUser && !formData.mat_khau) {
            setFormError("Vui lòng nhập mật khẩu cho tài khoản mới.");
            return;
        }

        const payload = {
            ho_ten: formData.ho_ten.trim(),
            email: formData.email.trim(),
            so_dien_thoai: formData.so_dien_thoai.trim() || null,
            dia_chi: formData.dia_chi.trim() || null,
            vai_tro: formData.vai_tro,
            trang_thai: Number(formData.trang_thai),
        };

        if (formData.mat_khau) {
            payload.mat_khau = formData.mat_khau;
        }

        try {
            setFormLoading(true);
            if (editingUser) {
                await updateUser(editingUser.id, payload);
                alert("✓ Cập nhật thông tin người dùng thành công!");
            } else {
                await createUser(payload);
                alert("✓ Thêm tài khoản người dùng mới thành công!");
            }

            setIsFormModalOpen(false);
            loadUsers();
        } catch (error) {
            const msg =
                error.response?.data?.message || //?. tránh lõi nếu thuộc tính không tồn tại
                error.response?.data?.error ||
                "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin!";
            setFormError(msg);
        } finally {
            setFormLoading(false);
        }
    };

    // Khóa / Mở khóa tài khoản (Quản lý quyền đăng nhập)
    const handleToggleLock = async (u) => {
        const actionText = u.trang_thai ? "KHÓA" : "MỞ KHÓA";
        const confirmToggle = window.confirm(
            `Bạn có chắc chắn muốn ${actionText} tài khoản của "${u.ho_ten}" (ID: #${u.id})?\n${u.trang_thai
                ? "Tài khoản bị khóa sẽ không thể đăng nhập vào hệ thống."
                : "Tài khoản sẽ được cấp lại quyền đăng nhập bình thường."
            }`
        );
        if (!confirmToggle) return;

        try {
            await toggleLockUser(u.id);
            alert(`✓ Đã ${actionText.toLowerCase()} tài khoản thành công!`);
            loadUsers();
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi khi thay đổi trạng thái tài khoản.";
            alert(`${msg}`);
        }
    };

    // Phân quyền nhanh: Admin <-> Member
    const handleChangeRole = async (u) => {
        const targetRole = u.vai_tro === "admin" ? "member" : "admin";
        const roleText = targetRole === "admin" ? "QUẢN TRỊ VIÊN (Admin)" : "NGƯỜI DÙNG (Member)";
        const confirmRole = window.confirm(
            `Bạn có chắc muốn đổi vai trò của "${u.ho_ten}" thành ${roleText}?`
        );
        if (!confirmRole) return;

        try {
            await changeUserRole(u.id, targetRole);
            alert(`Đã thay đổi vai trò thành ${roleText}!`);
            loadUsers();
        } catch (error) {
            const msg = error.response?.data?.message || "Lỗi khi thay đổi vai trò.";
            alert(`${msg}`);
        }
    };

    // Xóa mềm người dùng (chuyển vào thùng rác)
    const handleSoftDelete = async (u) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc chắn muốn chuyển tài khoản "${u.ho_ten}" (Email: ${u.email}) vào thùng rác?\n(Bạn vẫn có thể khôi phục lại tài khoản bất kỳ lúc nào)`
        );
        if (!confirmDelete) return;

        try {
            await deleteUser(u.id);
            alert("Đã chuyển người dùng vào thùng rác!");
            loadUsers();
        } catch (error) {
            const msg = error.response?.data?.message || "Không thể xóa người dùng này.";
            alert(`${msg}`);
        }
    };

    // Khôi phục người dùng từ thùng rác
    const handleRestore = async (u) => {
        try {
            await restoreUser(u.id);
            alert(`Đã khôi phục thành công tài khoản "${u.ho_ten}"!`);
            loadUsers();
        } catch (error) {
            const msg = error.response?.data?.message || "Khôi phục thất bại.";
            alert(`${msg}`);
        }
    };

    // Xóa vĩnh viễn người dùng khỏi CSDL
    const handleForceDelete = async (u) => {
        const confirmDelete = window.confirm(
            `CẢNH BÁO NGUY HIỂM:\nBạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${u.ho_ten}" (ID: #${u.id}) khỏi cơ sở dữ liệu?\nHành động này KHÔNG THỂ HOÀN TÁC!`
        );
        if (!confirmDelete) return;

        try {
            await forceDeleteUser(u.id);
            alert("Đã xóa vĩnh viễn tài khoản người dùng!");
            loadUsers();
        } catch (error) {
            const msg = error.response?.data?.message || "Xóa vĩnh viễn thất bại.";
            alert(`${msg}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* =========================================================
                1. TIÊU ĐỀ TRANG VÀ NÚT THÊM USER
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>Quản lý Người dùng</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            {totalItems} tài khoản
                        </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Quản lý danh sách người dùng, phân quyền Admin/User, khóa/mở khóa tài khoản (10 mục / trang)
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Nút Thêm User mới */}
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Thêm tài khoản
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "active"
                        ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                >
                    <span>👥 Danh sách người dùng</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "trash"
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
                3. THANH TÌM KIẾM & BỘ LỌC
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc số điện thoại..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full px-3.5 py-2 pl-9 rounded-xl border border-white/[0.08] bg-[#151728] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Các bộ lọc: Vai trò & Trạng thái */}
                <div className="flex items-center gap-3">
                    {/* Lọc theo Vai trò */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Vai trò:</span>
                        <select
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#151728] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                        >
                            <option value="all">Tất cả</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                            <option value="member">Thành viên (Member)</option>
                        </select>
                    </div>

                    {/* Lọc theo Trạng thái (chỉ hiện khi ở tab Hoạt động) */}
                    {tab === "active" && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span>Trạng thái:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="px-3 py-1.5 rounded-xl border border-white/[0.08] bg-[#151728] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                            >
                                <option value="all">Tất cả</option>
                                <option value="1">🟢 Hoạt động</option>
                                <option value="0">🔴 Bị khóa</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* =========================================================
                4. BẢNG DANH SÁCH NGƯỜI DÙNG
            ========================================================= */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                <th className="py-3.5 px-4 w-16">ID</th>
                                <th className="py-3.5 px-4">Tài khoản & Email</th>
                                <th className="py-3.5 px-4">Số điện thoại</th>
                                <th className="py-3.5 px-4">Vai trò (Phân quyền)</th>
                                {tab === "active" ? (
                                    <th className="py-3.5 px-4">Quyền đăng nhập</th>
                                ) : (
                                    <th className="py-3.5 px-4">Thời gian xóa</th>
                                )}
                                <th className="py-3.5 px-4 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.04] text-xs text-slate-300">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                                            Đang tải danh sách người dùng...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        {tab === "trash"
                                            ? "Thùng rác trống. Không có tài khoản nào bị xóa."
                                            : "Không tìm thấy người dùng phù hợp với điều kiện tìm kiếm."}
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const isAdmin = u.vai_tro === "admin";
                                    const isLocked = !u.trang_thai;

                                    return (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* ID */}
                                            <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                                                #{u.id}
                                            </td>

                                            {/* Họ tên & Email */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar ký tự đầu */}
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-inner ${isAdmin
                                                        ? "bg-gradient-to-tr from-amber-500 to-violet-600 text-white"
                                                        : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white"
                                                        }`}>
                                                        {(u.ho_ten || "U").charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white flex items-center gap-1.5">
                                                            <span>{u.ho_ten}</span>
                                                            {isAdmin && (
                                                                <span className="text-[10px] text-amber-400" title="Quản trị viên">
                                                                    ★
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-mono">
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Số điện thoại & Địa chỉ */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-mono text-slate-300">
                                                    {u.so_dien_thoai || "—"}
                                                </div>
                                                {u.dia_chi && (
                                                    <div className="text-[10px] text-slate-500 line-clamp-1 max-w-[200px]" title={u.dia_chi}>
                                                        {u.dia_chi}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Phân quyền (Admin / Member) với nút đổi nhanh */}
                                            <td className="py-3.5 px-4">
                                                <div className="inline-flex items-center gap-2">
                                                    {isAdmin ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                            <span>🛡️</span>
                                                            Quản trị viên
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                                            <span>👤</span>
                                                            Thành viên
                                                        </span>
                                                    )}

                                                    {/* Nút đổi vai trò trực tiếp */}
                                                    {tab === "active" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleChangeRole(u)}
                                                            className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                                                            title={`Chuyển sang ${isAdmin ? "Thành viên" : "Quản trị viên"}`}
                                                        >
                                                            ⇄ Đổi
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Quyền đăng nhập: Khóa / Mở khóa hoặc Ngày xóa */}
                                            {tab === "active" ? (
                                                <td className="py-3.5 px-4">
                                                    <div className="inline-flex items-center gap-2">
                                                        {u.trang_thai ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                                Hoạt động
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                                Bị khóa
                                                            </span>
                                                        )}

                                                        {/* Nút bấm Khóa / Mở khóa nhanh */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleLock(u)}
                                                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${u.trang_thai
                                                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                                                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                                                                }`}
                                                            title={u.trang_thai ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                        >
                                                            {u.trang_thai ? "Khóa" : "Mở khóa"}
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="py-3.5 px-4 text-rose-300 font-mono text-[11px]">
                                                    {formatDate(u.deleted_at)}
                                                </td>
                                            )}

                                            {/* Cột Thao tác */}
                                            <td className="py-3.5 px-4 text-right">
                                                {tab === "active" ? (
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {/* Nút Xem chi tiết */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenViewModal(u)}
                                                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            Xem
                                                        </button>

                                                        {/* Nút Sửa */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(u)}
                                                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-medium transition-colors"
                                                            title="Chỉnh sửa thông tin"
                                                        >
                                                            Sửa
                                                        </button>

                                                        {/* Nút Xóa mềm (chuyển vào thùng rác) */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSoftDelete(u)}
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
                                                            onClick={() => handleRestore(u)}
                                                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-medium transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                                            Khôi phục
                                                        </button>

                                                        {/* Nút Xóa vĩnh viễn */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleForceDelete(u)}
                                                            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500 text-xs font-medium transition-colors shadow-sm shadow-rose-600/30 inline-flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                            Xóa vĩnh viễn
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
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
                5. MODAL XEM CHI TIẾT USER
            ========================================================= */}
            {isViewModalOpen && viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#14162e] p-6 shadow-2xl relative space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <span>Thông tin chi tiết người dùng</span>
                                <span className="font-mono text-xs text-slate-400">#{viewingUser.id}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Nội dung chi tiết */}
                        <div className="space-y-4 text-xs">
                            {/* Avatar & Header */}
                            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-lg">
                                    {(viewingUser.ho_ten || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{viewingUser.ho_ten}</h4>
                                    <p className="text-slate-400 font-mono mt-0.5">{viewingUser.email}</p>
                                </div>
                            </div>

                            {/* Bảng thuộc tính */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="block text-slate-500 text-[11px] mb-1">Số điện thoại:</span>
                                    <span className="font-mono text-white font-semibold">{viewingUser.so_dien_thoai || "Chưa cập nhật"}</span>
                                </div>

                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="block text-slate-500 text-[11px] mb-1">Vai trò hệ thống:</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${viewingUser.vai_tro === "admin"
                                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                        : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                                        }`}>
                                        {viewingUser.vai_tro === "admin" ? "🛡️ Quản trị viên" : "👤 Thành viên"}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="block text-slate-500 text-[11px] mb-1">Quyền đăng nhập:</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${viewingUser.trang_thai
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                        : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                                        }`}>
                                        {viewingUser.trang_thai ? "🟢 Đang hoạt động" : "🔴 Đang bị khóa"}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="block text-slate-500 text-[11px] mb-1">Ngày đăng ký:</span>
                                    <span className="font-mono text-slate-300">{formatDate(viewingUser.created_at)}</span>
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                <span className="block text-slate-500 text-[11px] mb-1">Địa chỉ liên hệ / giao hàng:</span>
                                <span className="text-white">{viewingUser.dia_chi || "Chưa cập nhật địa chỉ"}</span>
                            </div>
                        </div>

                        {/* Nút đóng */}
                        <div className="flex justify-end pt-3 border-t border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                6. MODAL THÊM / SỬA USER
            ========================================================= */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#14162e] p-6 shadow-2xl relative space-y-5">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <h3 className="text-base font-bold text-white">
                                {editingUser ? `Chỉnh sửa Người dùng #${editingUser.id}` : "Thêm Tài khoản Người dùng Mới"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 text-sm"
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

                        {/* Form nhập liệu */}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Họ và tên */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Họ và tên <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        value={formData.ho_ten}
                                        onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Địa chỉ Email <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Số điện thoại */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="0987654321"
                                        value={formData.so_dien_thoai}
                                        onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>

                                {/* Mật khẩu */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        {editingUser ? "Mật khẩu mới (Bỏ trống nếu không đổi)" : <span>Mật khẩu <span className="text-red-400">*</span></span>}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        placeholder={editingUser ? "••••••••" : "Ít nhất 6 ký tự"}
                                        value={formData.mat_khau}
                                        onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Địa chỉ liên hệ
                                </label>
                                <input
                                    type="text"
                                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                                    value={formData.dia_chi}
                                    onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Phân quyền (Vai trò) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Vai trò (Phân quyền)
                                    </label>
                                    <select
                                        value={formData.vai_tro}
                                        onChange={(e) => setFormData({ ...formData, vai_tro: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                                    >
                                        <option value="member">👤 Thành viên (Member / User)</option>
                                        <option value="admin">🛡️ Quản trị viên (Admin)</option>
                                    </select>
                                </div>

                                {/* Trạng thái khóa / mở khóa */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Quyền đăng nhập
                                    </label>
                                    <select
                                        value={formData.trang_thai}
                                        onChange={(e) => setFormData({ ...formData, trang_thai: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-[#1a1d3b] text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                                    >
                                        <option value={1}>🟢 Cho phép đăng nhập (Hoạt động)</option>
                                        <option value={0}>🔴 Khóa tài khoản (Chặn đăng nhập)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition-all disabled:opacity-50"
                                >
                                    {formLoading ? "Đang lưu..." : editingUser ? "Lưu thay đổi" : "Tạo tài khoản"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
