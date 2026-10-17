
"use client";


import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { getAllProducts } from "@/services/productServices";
import { getAllCategories } from "@/services/categoryServices";




// Chuyển đường dẫn ảnh từ Laravel thành URL đầy đủ
function getImageUrl(image) {
    if (!image || typeof image !== "string") return "";

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    const base = (
        process.env.NEXT_PUBLIC_IMAGE_URL ||
        (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api")
            .replace(/\/api\/?$/, "")
    )
        .trim()
        .replace(/\/storage\/?$/, "")
        .replace(/\/$/, "");

    return `${base}/storage/${image
        .replace(/^\/+/, "")
        .replace(/^storage\//, "")}`;
}

// Chuan hoa chu de so sanh
function normalizeText(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .toLowerCase()
        .trim();
}





function matchesCategoryFilter(product, filterKey) {
    const text = normalizeText(
        `${product.name} ${product.categoryName} ${product.categorySlug}`
    );

    const categoryId = Number(product.categoryId);

    const isLaptop =
        categoryId === 16 ||
        /laptop|may tinh xach tay|notebook|macbook/.test(text);

    const isHeadphone =
        categoryId === 17 ||
        /tai nghe|headphone|earphone|earbuds/.test(text);

    const isTablet =
        /may tinh bang|tablet|ipad|galaxy tab/.test(text);

    const isPhone =
        /iphone|dien thoai|smartphone|samsung galaxy|redmi|oppo|vivo|realme/.test(text) &&
        !isTablet &&
        !isHeadphone;

    const isGaming =
        /gaming gear|gaming|choi game|ban phim co|chuot gaming/.test(text) &&
        !isHeadphone;

    const isAccessories =
        /phu kien|accessories/.test(text) &&
        !isPhone &&
        !isTablet &&
        !isHeadphone &&
        !isLaptop &&
        !isGaming;

    switch (filterKey) {
        case "phone":
            return categoryId === 4 || isPhone;
        case "laptop":
            return isLaptop;
        case "tablet":
            return isTablet;
        case "headphone":
            return isHeadphone;
        case "gaming":
            return isGaming;
        case "accessories":
            return isAccessories;
        default:
            return false;
    }
}





export default function Products() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPrice, setSelectedPrice] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

  
    const productsPerPage = 9;


    useEffect(() => {
        const keyword = searchParams.get("search") || "";
        setSearchTerm(keyword);
        setCurrentPage(1);
    }, [searchParams]);


    // Lay san pham truc tiep tu API Laravel
    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            try {
                setLoading(true);
                setError("");

                const response = await getAllProducts();
                const body = response?.data ?? response;

                // Ho tro API tra ve mang truc tiep hoac { data: [...] }
                const list = Array.isArray(body)
                    ? body
                    : Array.isArray(body?.data)
                        ? body.data
                        : [];

                if (cancelled) return;

                const activeProducts = list
                    .filter((p) => Number(p.trang_thai ?? 1) === 1)
                    .map((p) => {
                        const originalPrice = Number(p.gia ?? 0);
                        const salePrice = Number(p.gia_khuyen_mai ?? 0);
                        const hasSale =
                            salePrice > 0 && salePrice < originalPrice;

                        return {
                            id: p.id,
                            name: p.ten ?? "Chưa có tên",
                            brand: p.thuong_hieu?.ten ?? "",
                            categoryId: p.danh_muc_id ?? p.danh_muc?.id,
                            categoryName: p.danh_muc?.ten ?? "",
                            categorySlug: p.danh_muc?.duong_dan ?? "",
                            price: hasSale ? salePrice : originalPrice,
                            oldPrice: hasSale ? originalPrice : 0,
                            image: getImageUrl(p.hinh_anh_url || p.hinh_anh),
                            stock: Number(p.so_luong_ton ?? 0),
                            description: p.mo_ta ?? "",
                            rating: Number(
                                p.rating ??
                                p.danh_gia_trung_binh ??
                                p.average_rating ??
                                0
                            ),
                            reviews: Number(p.reviews ?? 0),
                            sold: Number(p.sold ?? 0),
                        };
                    });

                setProducts(activeProducts);
            } catch (err) {
                console.error("Loi lay san pham:", err);
                if (!cancelled) {
                    setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const response = await getAllCategories();

                const body = response?.data ?? response;
                const list = Array.isArray(body)
                    ? body
                    : Array.isArray(body?.data)
                        ? body.data
                        : [];

                if (!cancelled) {
                    setCategories(
                        list.filter(
                            (category) =>
                                Number(category.trang_thai ?? 1) === 1
                        )
                    );
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);

                if (!cancelled) {
                    setCategories([]);
                }
            }
        }

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    // Tao danh sach danh muc va so luong tu du lieu san pham


    
    // Loc va sap xep san pham
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Loc san pham theo tu khoa tim kiem
        const keyword = normalizeText(searchTerm);

        if (keyword) {
            result = result.filter((product) => {
                const searchableText = normalizeText(
                    [
                        product.name,
                        product.brand,
                        product.categoryName,
                        product.categorySlug,
                    ]
                        .filter(Boolean)
                        .join(" ")
                );

                return searchableText.includes(keyword);
            });
        }

        // Loc san pham theo danh muc
        if (selectedCategory !== "all") {
            result = result.filter((product) =>
                matchesCategoryFilter(product, selectedCategory)
            );
        }

        // Loc san pham theo gia
        if (selectedPrice === "0-5") {
            result = result.filter((p) => p.price < 5_000_000);
        } else if (selectedPrice === "5-15") {
            result = result.filter(
                (p) => p.price >= 5_000_000 && p.price <= 15_000_000
            );
        } else if (selectedPrice === "15-30") {
            result = result.filter(
                (p) => p.price > 15_000_000 && p.price <= 30_000_000
            );
        } else if (selectedPrice === "30+") {
            result = result.filter((p) => p.price > 30_000_000);
        }

        // Loc san pham theo thuong hieu
        if (selectedBrand !== "all") {
            result = result.filter(
                (p) =>
                    normalizeText(p.brand) === normalizeText(selectedBrand)
            );
        }

        // Loc san pham theo danh gia
        if (selectedRating > 0) {
            result = result.filter((p) => p.rating >= selectedRating);
        }

        // Sap xep san pham
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;

            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;

            case "rating-desc":
                result.sort((a, b) => b.rating - a.rating);
                break;

            case "sales-desc":
                result.sort((a, b) => b.sold - a.sold);
                break;

            default:
                result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [
        products,
        searchTerm,
        selectedCategory,
        selectedPrice,
        selectedBrand,
        selectedRating,
        sortBy,
    ]);


    

    // Tinh phan trang tu danh sach da loc
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const safePage = Math.min(currentPage, Math.max(totalPages, 1));

    const paginatedProducts = filteredProducts.slice(
        (safePage - 1) * productsPerPage,
        safePage * productsPerPage
    );


    // Dat lai tat ca bo loc
    const resetFilters = () => {
        setSelectedCategory("all");
        setSelectedPrice("all");
        setSelectedBrand("all");
        setSelectedRating(0);
        setSortBy("default");
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        resetFilters();
    };

    // Chon danh muc
    const handleSetCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    // Chon khoang gia
    const handleSetPrice = (price) => {
        setSelectedPrice(price);
        setCurrentPage(1);
    };

    // Chon thuong hieu
    const handleSetBrand = (brand) => {
        setSelectedBrand(brand);
        setCurrentPage(1);
    };

    // Chon muc danh gia
    const handleSetRating = (rating) => {
        setSelectedRating(Number(rating));
        setCurrentPage(1);
    };

    // Sap xep san pham
    const handleSorting = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };


    // Dinh dang gia tien VND
    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN").format(price) + " đ";

    // Phan JSX giao dien hien tai se duoc cap nhat o buoc tiep theo


    return (
        <>
            {/* MAIN CONTENT */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                    <Link
                        href="/"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Trang chủ
                    </Link>

                    <span>/</span>

                    <span className="text-slate-900 dark:text-white font-medium">
                        Cửa hàng
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* ========================================== */}
                    {/* SIDEBAR FILTERS */}
                    {/* ========================================== */}

                    <aside className="lg:col-span-1 space-y-6">

                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">

                            {/* Filter Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">

                                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <i
                                        data-lucide="sliders-horizontal"
                                        className="w-4 h-4 text-blue-600"
                                    />

                                    Bộ lọc sản phẩm
                                </h3>

                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Xóa lọc
                                </button>

                            </div>

                            {/* ========================================== */}
                            {/* CATEGORY FILTER */}
                            {/* ========================================== */}

                            <div>

                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Danh mục
                                </h4>

                                <div
                                    className="space-y-1.5 text-xs"
                                    id="category-filter-list"
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("all")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                                        data-cat="all"
                                    >
                                        <span>Tất cả danh mục</span>
                                        <span className="text-[11px] opacity-75">
                                            24
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("phone")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="phone"
                                    >
                                        <span>📱 Điện thoại</span>
                                        <span className="text-[11px] opacity-75">
                                            4
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("laptop")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="laptop"
                                    >
                                        <span>💻 Laptop</span>
                                        <span className="text-[11px] opacity-75">
                                            4
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("tablet")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="tablet"
                                    >
                                        <span>📲 Máy tính bảng</span>
                                        <span className="text-[11px] opacity-75">
                                            2
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => handleSetCategory("headphone")}
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="headphone"
                                    >
                                        <span>🎧 Tai nghe</span>
                                        <span className="text-[11px] opacity-75">
                                            {products.filter(
                                                (product) =>
                                                    normalizeText(product.categoryName).includes("tai nghe") ||
                                                    normalizeText(product.categorySlug).includes("tai-nghe")
                                            ).length}
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("watch")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="watch"
                                    >
                                        <span>⌚ Đồng hồ</span>
                                        <span className="text-[11px] opacity-75">
                                            2
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("gaming")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="gaming"
                                    >
                                        <span>🎮 Gaming Gear</span>
                                        <span className="text-[11px] opacity-75">
                                            3
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("camera")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="camera"
                                    >
                                        <span>📷 Camera &amp; Lens</span>
                                        <span className="text-[11px] opacity-75">
                                            3
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCategory("accessories")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="accessories"
                                    >
                                        <span>🔌 Phụ kiện</span>
                                        <span className="text-[11px] opacity-75">
                                            3
                                        </span>
                                    </button>

                                </div>
                            </div>

                            {/* ========================================== */}
                            {/* PRICE FILTER */}
                            {/* ========================================== */}

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">

                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Khoảng giá
                                </h4>

                                <div className="space-y-2 text-xs">

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            value="all"
                                            defaultChecked
                                            onChange={() =>
                                                handleSetPrice("all")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />

                                        <span>Tất cả mức giá</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            value="0-5"
                                            onChange={() =>
                                                handleSetPrice("0-5")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />

                                        <span>Dưới 5 triệu</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            value="5-15"
                                            onChange={() =>
                                                handleSetPrice("5-15")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />

                                        <span>Từ 5 - 15 triệu</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            value="15-30"
                                            onChange={() =>
                                                handleSetPrice("15-30")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />

                                        <span>Từ 15 - 30 triệu</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price_range"
                                            value="30+"
                                            onChange={() =>
                                                handleSetPrice("30+")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />

                                        <span>Trên 30 triệu</span>
                                    </label>

                                </div>
                            </div>

                            {/* ========================================== */}
                            {/* BRAND FILTER */}
                            {/* ========================================== */}

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">

                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Thương hiệu
                                </h4>

                                <div className="grid grid-cols-2 gap-2 text-xs">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("all")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                                        data-brand="all"
                                    >
                                        Tất cả
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Apple")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Apple"
                                    >
                                        Apple
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Samsung")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Samsung"
                                    >
                                        Samsung
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Sony")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Sony"
                                    >
                                        Sony
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Asus")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Asus"
                                    >
                                        ASUS
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Dell")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Dell"
                                    >
                                        Dell
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Lenovo")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Lenovo"
                                    >
                                        Lenovo
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetBrand("Xiaomi")
                                        }
                                        className="brand-btn px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-left font-medium hover:border-blue-500 text-slate-700 dark:text-slate-300"
                                        data-brand="Xiaomi"
                                    >
                                        Xiaomi
                                    </button>

                                </div>
                            </div>

                            {/* ========================================== */}
                            {/* RATING FILTER */}
                            {/* ========================================== */}

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">

                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Đánh giá
                                </h4>

                                <div className="space-y-1.5 text-xs">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetRating(5)
                                        }
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★★★{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                5 sao
                                            </span>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetRating(4)
                                        }
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★★☆{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                Từ 4 sao
                                            </span>
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetRating(3)
                                        }
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <span className="text-amber-400 font-bold">
                                            ★★★☆☆{" "}
                                            <span className="text-slate-600 dark:text-slate-300 font-normal">
                                                Từ 3 sao
                                            </span>
                                        </span>
                                    </button>

                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* ========================================== */}
                    {/* PRODUCT GRID */}
                    {/* ========================================== */}

                    <section className="lg:col-span-3 space-y-6">

                        {/* Toolbar */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">

                            <div>

                                <h1
                                    className="text-lg font-bold text-slate-900 dark:text-white"
                                    id="shop-title"
                                >
                                    Tất cả sản phẩm
                                </h1>

                                {loading
                                    ? "Đang tải sản phẩm..."
                                    : `Hiển thị ${filteredProducts.length} sản phẩm`}

                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">

                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    Sắp xếp theo:
                                </span>

                                <select
                                    id="sort-select"
                                    onChange={(event) =>
                                        handleSorting(event.target.value)
                                    }
                                    className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="default">
                                        Mới nhất (Mặc định)
                                    </option>

                                    <option value="price-asc">
                                        Giá: Thấp → Cao
                                    </option>

                                    <option value="price-desc">
                                        Giá: Cao → Thấp
                                    </option>

                                    <option value="rating-desc">
                                        Đánh giá cao nhất
                                    </option>

                                    <option value="sales-desc">
                                        Bán chạy nhất
                                    </option>
                                </select>

                            </div>
                        </div>


                        {/* Products Grid */}
                        <div
                            id="shop-product-grid"
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[400px]"
                        >
                            {loading ? (
                                <p className="col-span-full text-center py-16 text-slate-500">
                                    Đang tải sản phẩm...
                                </p>
                            ) : error ? (
                                <div className="col-span-full text-center py-16">
                                    <p className="text-red-500 text-sm">{error}</p>
                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()}
                                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <article
                                        key={product.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Link href={`products/${product.id}`}>
                                            <div className="aspect-square bg-slate-50 dark:bg-slate-800 p-4 flex items-center justify-center">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        Chưa có hình ảnh
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-4 space-y-2">
                                            {product.brand && (
                                                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                                    {product.brand}
                                                </p>
                                            )}

                                            <Link href={`products/${product.id}`}>
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                    {formatPrice(product.price)}
                                                </span>

                                                {product.oldPrice > 0 && (
                                                    <span className="text-xs text-slate-400 line-through">
                                                        {formatPrice(product.oldPrice)}
                                                    </span>
                                                )}
                                            </div>


                                            <p className="text-xs text-slate-500">
                                                {product.stock > 0
                                                    ? `Còn ${product.stock} sản phẩm`
                                                    : "Hết hàng"}
                                            </p>

                                            <button
                                                type="button"
                                                disabled={product.stock <= 0}
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full mt-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                                            >
                                                {product.stock > 0 ? (
                                                    <>
                                                        <span className="mr-1">🛒</span>
                                                        Thêm vào giỏ hàng
                                                    </>
                                                ) : (
                                                    "Hết hàng"
                                                )}
                                            </button>

                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="col-span-full text-center py-16 text-slate-500 text-sm">
                                    Không tìm thấy sản phẩm phù hợp.
                                </p>
                            )}
                        </div>


                        {/* Empty State */}
                        <div
                            id="shop-empty-state"
                            className="hidden text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8"
                        >

                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">

                                <i
                                    data-lucide="package-search"
                                    className="w-8 h-8"
                                />

                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Không tìm thấy sản phẩm phù hợp
                            </h3>

                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                Vui lòng thử điều chỉnh lại bộ lọc hoặc tìm kiếm
                                với từ khóa khác.
                            </p>

                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                            >
                                Xóa tất cả bộ lọc
                            </button>

                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div
                                className="flex items-center justify-center gap-2 pt-6 pb-2"
                                id="shop-pagination"
                            >
                                <button
                                    type="button"
                                    disabled={safePage === 1}
                                    onClick={() =>
                                        setCurrentPage((page) => Math.max(1, page - 1))
                                    }
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                                >
                                    ← Trước
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-xl font-bold text-xs ${safePage === page
                                                ? "bg-blue-600 text-white"
                                                : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                                    }
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}

                    </section>
                </div>
            </main>
        </>
    );
}

