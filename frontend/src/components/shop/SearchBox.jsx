"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/services/productServices";

// Chuyển đường dẫn ảnh từ Laravel thành URL đầy đủ
function getImageUrl(image) {
    if (!image || typeof image !== "string") return "";
    if (/^https?:\/\//i.test(image)) return image;

    const base = (
        process.env.NEXT_PUBLIC_IMAGE_URL ||
        (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(
            /\/api\/?$/,
            ""
        )
    )
        .trim()
        .replace(/\/storage\/?$/, "")
        .replace(/\/$/, "");

    return `${base}/storage/${image.replace(/^\/+/, "").replace(/^storage\//, "")}`;
}

// Bỏ dấu tiếng Việt để gõ "tai nghe", "iphone"... đều khớp
function normalizeText(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .toLowerCase()
        .trim();
}

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " đ";

export default function SearchBox({ placeholder, variant = "desktop" }) {
    const [term, setTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const router = useRouter();

    // 1. Tải sản phẩm 1 lần khi component mount
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const response = await getAllProducts();
                const body = response?.data ?? response;
                const list = Array.isArray(body)
                    ? body
                    : Array.isArray(body?.data)
                        ? body.data
                        : [];

                if (cancelled) return;

                const mapped = list
                    .filter((p) => Number(p.trang_thai ?? 1) === 1)
                    .map((p) => {
                        const originalPrice = Number(p.gia ?? 0);
                        const salePrice = Number(p.gia_khuyen_mai ?? 0);
                        const hasSale = salePrice > 0 && salePrice < originalPrice;

                        return {
                            id: p.id,
                            name: p.ten ?? "Chưa có tên",
                            brand: p.thuong_hieu?.ten ?? "",
                            categoryName: p.danh_muc?.ten ?? "",
                            price: hasSale ? salePrice : originalPrice,
                            oldPrice: hasSale ? originalPrice : 0,
                            image: getImageUrl(p.hinh_anh_url || p.hinh_anh),
                        };
                    });

                setProducts(mapped);
            } catch (err) {
                console.error("SearchBox lỗi tải sản phẩm:", err);
                if (!cancelled) setError("Không tải được dữ liệu tìm kiếm");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // 2. Lọc ngay trên client theo từ khóa
    const results = useMemo(() => {
        const keyword = normalizeText(term);
        if (!keyword) return [];

        return products
            .filter((p) =>
                normalizeText(
                    [p.name, p.brand, p.categoryName].filter(Boolean).join(" ")
                ).includes(keyword)
            )
            .slice(0, 6);
    }, [term, products]);

    // 3. Click ra ngoài thì đóng dropdown
    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const closeAndReset = () => {
        setOpen(false);
        setTerm("");
    };

    // 4. Enter hoặc bấm nút "Tìm kiếm" -> sang trang /products?search=...
    const handleSubmit = (e) => {
        e.preventDefault();

        const keyword = term.trim();
        if (!keyword) return;

        setOpen(false);
        router.push(`/products?search=${encodeURIComponent(keyword)}`);
    };

    const isDesktop = variant === "desktop";
    const hasKeyword = term.trim().length > 0;

    return (
        <div ref={wrapperRef} className="relative w-full">
            <form className="relative flex items-center" onSubmit={handleSubmit}>
                <input
                    value={term}
                    onChange={(e) => {
                        setTerm(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => {
                        if (hasKeyword) setOpen(true);
                    }}
                    type="text"
                    placeholder={placeholder}
                    className={
                        isDesktop
                            ? "w-full pl-4 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:text-white placeholder-slate-400 transition-all"
                            : "w-full pl-3 pr-20 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                    }
                />
                <button
                    type="submit"
                    className={
                        isDesktop
                            ? "absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95"
                            : "absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    }
                >
                    {isDesktop ? "Tìm kiếm" : "Tìm"}
                </button>
            </form>

            {open && hasKeyword && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {loading ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                            Đang tải dữ liệu...
                        </div>
                    ) : error ? (
                        <div className="px-4 py-6 text-center text-xs text-red-500">
                            {error}
                        </div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                            Không tìm thấy sản phẩm cho &quot;{term.trim()}&quot;
                        </div>
                    ) : (
                        <>
                            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {results.map((p) => (
                                    <li key={p.id}>
                                        <Link
                                            href={`/products/${p.id}`}
                                            onClick={closeAndReset}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center overflow-hidden">
                                                {p.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-[9px] text-slate-400">
                                                        No img
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                    {p.name}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {formatPrice(p.price)}
                                                    </span>
                                                    {p.oldPrice > 0 && (
                                                        <span className="text-[11px] text-slate-400 line-through">
                                                            {formatPrice(p.oldPrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={`/products?search=${encodeURIComponent(term.trim())}`}
                                onClick={() => setOpen(false)}
                                className="block px-4 py-2.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Xem tất cả kết quả
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}