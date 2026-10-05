"use client";

import { formatCurrency } from "@/utils/formatCurrency";

export default function ProductTable({
    products,
    categories,
    brands,
    loading,
    onEdit,
    onDelete,
    onRestore,
    onForceDelete,
    showTrash,
}) {
    // Lấy tên danh mục
    const getCategoryName = (id) => {
        return (
            categories.find((item) => item.id == id)?.ten ||
            "Không có"
        );
    };

    // Lấy tên thương hiệu
    const getBrandName = (id) => {
        return (
            brands.find((item) => item.id == id)?.ten ||
            "Không có"
        );
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse text-left">
                    {/* Tiêu đề bảng */}
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="w-16 px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                ID
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Hình ảnh
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Tên sản phẩm
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Danh mục
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thương hiệu
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Giá
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Giá KM
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Tồn kho
                            </th>

                            <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Trạng thái
                            </th>

                            <th className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Thao tác
                            </th>
                        </tr>
                    </thead>

                    {/* Dữ liệu */}
                    <tbody className="divide-y divide-white/[0.04]">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <span className="h-2 w-2 animate-ping rounded-full bg-violet-500" />
                                        Đang tải danh sách sản phẩm...
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-14 text-center text-xs text-slate-500"
                                >
                                    Không tìm thấy sản phẩm nào.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="text-xs text-slate-300 transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* ID */}
                                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                                        #{product.id}
                                    </td>

                                    {/* Hình ảnh */}
                                    <td className="px-4 py-3.5">
                                        {product.hinh_anh ? (
                                            <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/[0.08] bg-[#151728]">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.hinh_anh}`}
                                                    alt={product.ten}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-[#151728] text-[10px] text-slate-600">
                                                Không có
                                            </div>
                                        )}
                                    </td>

                                    {/* Tên sản phẩm */}
                                    <td className="max-w-[220px] px-4 py-3.5">
                                        <div className="truncate font-semibold text-white">
                                            {product.ten}
                                        </div>
                                    </td>

                                    {/* Danh mục */}
                                    <td className="px-4 py-3.5 text-slate-400">
                                        {getCategoryName(
                                            product.danh_muc_id
                                        )}
                                    </td>

                                    {/* Thương hiệu */}
                                    <td className="px-4 py-3.5 text-slate-400">
                                        {getBrandName(
                                            product.thuong_hieu_id
                                        )}
                                    </td>

                                    {/* Giá */}
                                    <td className="px-4 py-3.5 font-medium text-slate-300">
                                        {formatCurrency(product.gia)}
                                    </td>

                                    {/* Giá khuyến mãi */}
                                    <td className="px-4 py-3.5 font-medium text-violet-400">
                                        {formatCurrency(
                                            product.gia_khuyen_mai
                                        )}
                                    </td>

                                    {/* Tồn kho */}
                                    <td className="px-4 py-3.5 text-slate-400">
                                        {product.so_luong_ton}
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="px-4 py-3.5">
                                        {product.trang_thai == 1 ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                Đang bán
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/15 px-2.5 py-1 text-[10px] font-semibold text-rose-400">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                                Ngừng bán
                                            </span>
                                        )}
                                    </td>

                                    {/* Thao tác */}
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            {!showTrash && (
                                                <>
                                                    {/* Nút sửa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(product)}
                                                        className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                                                    >
                                                        Sửa
                                                    </button>

                                                    {/* Nút xóa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(product.id)}
                                                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}

                                            {showTrash && (
                                                <>
                                                    {/* Nút khôi phục sản phẩm */}
                                                    <button
                                                        type="button"
                                                        onClick={() => onRestore(product.id)}
                                                        className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20 hover:text-emerald-300"
                                                    >
                                                        Khôi phục
                                                    </button>

                                                    {/* Nút xóa vĩnh viễn sản phẩm */}
                                                    <button
                                                        type="button"
                                                        onClick={() => onForceDelete(product.id)}
                                                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
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