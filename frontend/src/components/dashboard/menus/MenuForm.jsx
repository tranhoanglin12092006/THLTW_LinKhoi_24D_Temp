"use client";

import { useEffect, useState } from "react";

export default function MenuForm({
    menu,
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState({
        ten: "",
        url: "",
        thu_tu: 1,
        trang_thai: 1,
    });

    const [saving, setSaving] = useState(false);

    // Cap nhat form khi chon menu can sua
    useEffect(() => {
        if (menu) {
            setFormData({
                ten: menu.ten || "",
                url: menu.url || "",
                thu_tu: menu.thu_tu ?? 1,
                trang_thai: menu.trang_thai ?? 1,
            });
        } else {
            setFormData({
                ten: "",
                url: "",
                thu_tu: 1,
                trang_thai: 1,
            });
        }
    }, [menu]);

    // Cap nhat gia tri input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "thu_tu" || name === "trang_thai"
                ? Number(value)
                : value,
        }));
    };

    // Gui du lieu len component cha
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await onSubmit(formData);
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "mt-1 w-full rounded-xl border border-white/10 bg-[#0f1125] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ten Menu */}
            <div>
                <label className="text-xs font-medium text-slate-300">
                    Tên Menu
                </label>
                <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ví dụ: Trang chủ"
                    required
                />
            </div>

            {/* Duong dan */}
            <div>
                <label className="text-xs font-medium text-slate-300">
                    Đường dẫn URL
                </label>
                <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ví dụ: / hoặc /shop"
                    required
                />
            </div>

            {/* Thu tu hien thi */}
            <div>
                <label className="text-xs font-medium text-slate-300">
                    Thứ tự hiển thị
                </label>
                <input
                    type="number"
                    name="thu_tu"
                    min="0"
                    value={formData.thu_tu}
                    onChange={handleChange}
                    className={inputClass}
                    required
                />
            </div>

            {/* Trang thai */}
            <div>
                <label className="text-xs font-medium text-slate-300">
                    Trạng thái
                </label>
                <select
                    name="trang_thai"
                    value={formData.trang_thai}
                    onChange={handleChange}
                    className={inputClass}
                >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Ngừng hoạt động</option>
                </select>
            </div>

            {/* Nut thao tac */}
            <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                >
                    {saving
                        ? "Đang lưu..."
                        : menu
                            ? "Lưu thay đổi"
                            : "Thêm Menu"}
                </button>
            </div>
        </form>
    );
}
