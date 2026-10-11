"use client";

import { useEffect, useState } from "react";

import {
    getAllMenus,
    getDeletedMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    restoreMenu,
    forceDeleteMenu,
} from "@/services/menuServices";

import MenuTable from "@/components/dashboard/menus/MenuTable";
import MenuModal from "@/components/dashboard/menus/MenuModal";

export default function MenuPage() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTrash, setShowTrash] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [keyword, setKeyword] = useState("");

    // Tai danh sach menu
    const loadMenus = async () => {
        setLoading(true);

        try {
            const data = showTrash
                ? await getDeletedMenus()
                : await getAllMenus();

            // Ho tro API tra ve mang hoac object co data
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setMenus(list);
        } catch (error) {
            console.error("Loi tai danh sach Menu:", error);
            setMenus([]);
            alert("Không thể tải danh sách Menu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMenus();
    }, [showTrash]);

    // Mo form them menu
    const handleAdd = () => {
        setSelectedMenu(null);
        setShowModal(true);
    };

    // Mo form sua menu
    const handleEdit = (menu) => {
        setSelectedMenu(menu);
        setShowModal(true);
    };

    // Them hoac cap nhat menu
    const handleSubmit = async (data) => {
        try {
            if (selectedMenu) {
                await updateMenu(selectedMenu.id, data);
                alert("Cập nhật Menu thành công!");
            } else {
                await createMenu(data);
                alert("Thêm Menu thành công!");
            }

            setShowModal(false);
            setSelectedMenu(null);
            await loadMenus();
        } catch (error) {
            console.error("Loi luu Menu:", error);

            const message = error.response?.data?.message;
            alert(message || "Không thể lưu Menu. Vui lòng kiểm tra dữ liệu!");
        }
    };

    // Xoa mem menu
    const handleDelete = async (id) => {
        if (!window.confirm("Ông có chắc muốn xóa Menu này không?")) {
            return;
        }

        try {
            await deleteMenu(id);
            alert("Xóa Menu thành công!");
            await loadMenus();
        } catch (error) {
            console.error("Loi xoa Menu:", error);
            alert(error.response?.data?.message || "Xóa Menu thất bại!");
        }
    };

    // Khoi phuc menu
    const handleRestore = async (id) => {
        if (!window.confirm("Ông muốn khôi phục Menu này?")) {
            return;
        }

        try {
            await restoreMenu(id);
            alert("Khôi phục Menu thành công!");
            await loadMenus();
        } catch (error) {
            console.error("Loi khoi phuc Menu:", error);
            alert(error.response?.data?.message || "Khôi phục Menu thất bại!");
        }
    };

    // Xoa vinh vien menu
    const handleForceDelete = async (id) => {
        if (!window.confirm("Menu sẽ bị xóa vĩnh viễn. Ông có chắc không?")) {
            return;
        }

        try {
            await forceDeleteMenu(id);
            alert("Xóa vĩnh viễn Menu thành công!");
            await loadMenus();
        } catch (error) {
            console.error("Loi xoa vinh vien Menu:", error);
            alert(error.response?.data?.message || "Xóa vĩnh viễn Menu thất bại!");
        }
    };

    // Tim kiem theo ten va URL
    const filteredMenus = menus.filter((menu) => {
        const search = keyword.trim().toLowerCase();

        return (
            String(menu.ten || "").toLowerCase().includes(search) ||
            String(menu.url || "").toLowerCase().includes(search)
        );
    });

    return (
        <div className="min-h-screen space-y-6 bg-[#0b0d20] p-6 text-white">
            {/* Tieu de trang */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Menu</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Quản lý tên, đường dẫn và thứ tự hiển thị Menu.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setShowTrash(!showTrash)}
                        className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors ${
                            showTrash
                                ? "border-violet-500/30 bg-violet-500/15 text-violet-300"
                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                    >
                        {showTrash ? "Quay lại danh sách" : "Thùng rác"}
                    </button>

                    {!showTrash && (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-violet-500"
                        >
                            + Thêm Menu
                        </button>
                    )}
                </div>
            </div>

            {/* Thanh tim kiem */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên Menu hoặc URL..."
                    className="w-full rounded-xl border border-white/10 bg-[#111328] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500 sm:max-w-md"
                />

                <button
                    type="button"
                    onClick={loadMenus}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                    Làm mới
                </button>
            </div>

            {/* Thong ke */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 p-4">
                <p className="text-xs text-slate-400">
                    {showTrash ? "Menu trong thùng rác" : "Tổng số Menu"}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                    {filteredMenus.length}
                </p>
            </div>

            {/* Bang danh sach Menu */}
            <MenuTable
                menus={filteredMenus}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onForceDelete={handleForceDelete}
                showTrash={showTrash}
            />

            {/* Modal them va sua */}
            {showModal && (
                <MenuModal
                    menu={selectedMenu}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedMenu(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
