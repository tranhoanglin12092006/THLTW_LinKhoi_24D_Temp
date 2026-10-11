"use client";

import MenuForm from "./MenuForm";

export default function MenuModal({
    menu,
    onClose,
    onSubmit,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#14162e] p-6 shadow-2xl">

                {/* Header modal */}
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div>
                        <h2 className="text-base font-bold text-white">
                            {menu ? "Chỉnh sửa Menu" : "Thêm Menu mới"}
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-500">
                            {menu
                                ? "Cập nhật thông tin Menu"
                                : "Nhập thông tin Menu mới"}
                        </p>
                    </div>

                    {/* Nut dong */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Menu */}
                <MenuForm
                    menu={menu}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}
