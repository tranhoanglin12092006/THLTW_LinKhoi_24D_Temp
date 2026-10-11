"use client";

export default function MenuTable({
    menus,
    loading,
    onEdit,
    onDelete,
    onRestore,
    onForceDelete,
    showTrash,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                    {/* Tieu de bang */}
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="w-16 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                ID
                            </th>
                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Tên Menu
                            </th>
                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Đường dẫn
                            </th>
                            <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thứ tự
                            </th>
                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Trạng thái
                            </th>
                            <th className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    {/* Du lieu menu */}
                    <tbody className="divide-y divide-white/[0.04]">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 animate-ping rounded-full bg-violet-500" />
                                        Đang tải danh sách Menu...
                                    </div>
                                </td>
                            </tr>
                        ) : menus.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    Không tìm thấy Menu nào.
                                </td>
                            </tr>
                        ) : (
                            menus.map((menu) => (
                                <tr
                                    key={menu.id}
                                    className="text-xs text-slate-300 transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* ID */}
                                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                                        #{menu.id}
                                    </td>

                                    {/* Ten menu */}
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-white">
                                            {menu.ten}
                                        </div>
                                    </td>

                                    {/* Duong dan */}
                                    <td className="max-w-[250px] px-4 py-3.5 text-slate-400">
                                        <span className="break-all">
                                            {menu.url}
                                        </span>
                                    </td>

                                    {/* Thu tu */}
                                    <td className="px-4 py-3.5 text-center text-slate-300">
                                        {menu.thu_tu}
                                    </td>

                                    {/* Trang thai */}
                                    <td className="px-4 py-3.5">
                                        {Number(menu.trang_thai) === 1 ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/15 px-2.5 py-1 text-[10px] font-semibold text-rose-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                                Ngừng hoạt động
                                            </span>
                                        )}
                                    </td>

                                    {/* Thao tac */}
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="inline-flex flex-wrap justify-end gap-2">
                                            {!showTrash && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(menu)}
                                                        className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
                                                    >
                                                        Sửa
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(menu.id)}
                                                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}

                                            {showTrash && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => onRestore(menu.id)}
                                                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                                                    >
                                                        Khôi phục
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onForceDelete(menu.id)}
                                                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
                                                    >
                                                        Xóa vĩnh viễn
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
        </div>
    );
}
