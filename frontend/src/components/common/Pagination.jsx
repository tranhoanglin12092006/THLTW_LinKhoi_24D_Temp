/**
 * Component Pagination (Phân trang dùng chung)
 * Thiết kế gọn gàng, đẹp mắt bằng Tailwind CSS
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    // Tạo danh sách các số trang cần hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200/80 dark:border-slate-800">
            {/* Thống kê bản ghi */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị <span className="font-semibold text-slate-800 dark:text-slate-200">{startItem}</span> -{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{endItem}</span> trên tổng số{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> mục (10 mục/trang)
            </div>

            {/* Các nút bấm chuyển trang */}
            <div className="flex items-center gap-1.5">
                {/* Nút Về trang trước */}
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    ← Trước
                </button>

                {/* Các nút số trang */}
                {pages.map((p) => {
                    const isActive = p === currentPage;
                    return (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                isActive
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                                    : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            {p}
                        </button>
                    );
                })}

                {/* Nút Sang trang sau */}
                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}
