import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import API_CONFIG from "@/config/api";
import { addToLocalCart } from "@/services/cartStorage";
import { showToast } from "@/components/common/Toast";

/**
 * Component hiển thị thẻ sản phẩm (ProductCard)
 * Bám theo cấu trúc tranhoanglin-frontend, thiết kế đẹp mắt với Tailwind CSS
 */
export default function ProductCard({ product, type }) {
    if (!product) return null;

    // Chuẩn hóa dữ liệu từ Laravel API (hỗ trợ cả tiếng Việt và tiếng Anh)
    const id = product.id;
    const name = product.product_name || product.ten || "Sản phẩm";
    const slug = product.slug || product.duong_dan || String(id);
    const price = Number(product.price || product.gia || 0);
    const salePrice = product.sale_price !== null && product.sale_price !== undefined
        ? Number(product.sale_price)
        : (product.gia_khuyen_mai ? Number(product.gia_khuyen_mai) : null);

    // Xác định trạng thái khuyến mãi
    const hasDiscount = salePrice !== null && salePrice > 0 && salePrice < price;
    const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

    // Xử lý link hình ảnh
    let imageUrl = product.hinh_anh_url || product.image || product.hinh_anh;
    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
        imageUrl = `${API_CONFIG.IMAGE_URL}${imageUrl}`;
    }

    // Kiểm tra số lượng tồn kho
    const stock = Number(
        product.so_luong_ton !== undefined && product.so_luong_ton !== null
            ? product.so_luong_ton
            : (product.qty !== undefined && product.qty !== null ? product.qty : 99)
    );
    const isOutOfStock = stock <= 0;

    return (
        <div className={`group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${isOutOfStock ? "opacity-90" : "hover:-translate-y-1.5"}`}>
            
            {/* Vùng hình ảnh sản phẩm */}
            <div className="relative w-full pt-[90%] bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
                <Link href={`/products/${slug}`} className="absolute inset-0 flex items-center justify-center p-4">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className={`w-full h-full object-contain transition-transform duration-500 ${isOutOfStock ? "grayscale contrast-75 brightness-90" : "group-hover:scale-105"}`}
                            onError={(e) => {
                                // Fallback nếu ảnh không tồn tại
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/400x400/f1f5f9/475569?text=TECHNOVA";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            <span className="text-xs mt-2 font-medium">Chưa có ảnh</span>
                        </div>
                    )}

                    {/* Lớp phủ & Badge nổi bật "HẾT HÀNG" khi tồn kho = 0 */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] flex items-center justify-center p-4 z-20">
                            <div className="px-4 py-2 rounded-2xl bg-rose-600/90 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-rose-600/40 border border-white/20 flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                <span>ĐÃ HẾT HÀNG</span>
                            </div>
                        </div>
                    )}
                </Link>

                {/* Badges hiển thị góc trên bên trái: SALE / HOT / NEW / HẾT HÀNG */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {/* Badge HẾT HÀNG nhỏ trên góc */}
                    {isOutOfStock && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-slate-900 text-rose-400 border border-rose-500/40 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            TẠM HẾT
                        </span>
                    )}

                    {/* Badge SALE */}
                    {(hasDiscount || type === "sale") && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-red-500 text-white shadow-md shadow-red-500/20">
                            {discountPercent > 0 ? `-${discountPercent}%` : "SALE"}
                        </span>
                    )}

                    {/* Badge HOT */}
                    {(product.is_hot || type === "hot") && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-500 text-white shadow-md shadow-amber-500/20 animate-pulse">
                            🔥 HOT
                        </span>
                    )}

                    {/* Badge NEW */}
                    {(product.is_new || type === "new") && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                            ✨ NEW
                        </span>
                    )}
                </div>

                {/* Nút yêu thích ở góc phải */}
                <button
                    aria-label="Thêm vào yêu thích"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-red-500 flex items-center justify-center shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-2">
                    {/* Đánh giá sao & Tình trạng kho */}
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ))}
                            <span className="text-slate-400 text-xs ml-1 font-medium">(5.0)</span>
                        </div>

                        {/* Nhãn tình trạng kho hàng */}
                        {isOutOfStock ? (
                            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Hết hàng
                            </span>
                        ) : (
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Còn hàng
                            </span>
                        )}
                    </div>

                    {/* Tên sản phẩm */}
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Link href={`/products/${slug}`} title={name}>
                            {name}
                        </Link>
                    </h3>
                </div>

                {/* Giá tiền và Nút thêm vào giỏ */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-2 mb-3">
                        {hasDiscount ? (
                            <>
                                <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(salePrice)}
                                </span>
                                <span className="text-xs text-slate-400 line-through">
                                    {formatCurrency(price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(price)}
                            </span>
                        )}
                    </div>

                    {/* Nút thêm vào giỏ hàng hoặc Nút Báo hết hàng */}
                    {isOutOfStock ? (
                        <button
                            type="button"
                            disabled
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700 select-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            <span>Đã hết hàng</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                try {
                                    const itemPrice = hasDiscount ? salePrice : price;
                                    addToLocalCart({
                                        id,
                                        productId: id,
                                        name,
                                        slug,
                                        price: itemPrice,
                                        originalPrice: price,
                                        imageUrl,
                                        selected: true,
                                    }, 1);
                                    showToast.success(`Đã thêm "${name}" vào giỏ hàng!`);
                                } catch (err) {
                                    console.error("Lỗi thêm vào giỏ hàng:", err);
                                    showToast.error("Không thể thêm vào giỏ hàng!");
                                }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <span>Thêm vào giỏ</span>
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
