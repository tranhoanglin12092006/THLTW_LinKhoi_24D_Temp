
"use client";

import { useEffect } from "react";
import Link from "next/link";
export default function Products() {

    useEffect(() => {
        // Biến dùng để đánh dấu component đã bị unmount hay chưa.
        // false = component vẫn còn tồn tại.
        // true = component đã bị hủy/rời khỏi trang.
        let cancelled = false;

        // Hàm thực hiện việc lấy dữ liệu và render sản phẩm
        const renderProducts = () => {

            // Nếu component đã bị hủy thì dừng hàm,
            // không tiếp tục thao tác với DOM nữa.
            if (cancelled) return;

            // Lấy danh sách sản phẩm từ biến toàn cục
            // được khai báo trong file data.js.
            //
            // window.TECHNOVA_DATA?.products
            // dấu ?. giúp tránh lỗi nếu TECHNOVA_DATA chưa tồn tại.
            const products = window.TECHNOVA_DATA?.products;

            // Lấy hàm renderProductCard từ JavaScript toàn cục.
            // Hàm này có nhiệm vụ tạo HTML cho từng sản phẩm.
            const renderProductCard = window.renderProductCard;

            // Tìm phần tử HTML có id="shop-product-grid".
            // Đây là nơi các sản phẩm sẽ được đưa vào.
            const productGrid =
                document.getElementById("shop-product-grid");


            // Kiểm tra xem dữ liệu và các thành phần cần thiết
            // đã sẵn sàng hay chưa.
            if (
                // Chưa có danh sách sản phẩm
                !products ||

                // Chưa có hàm renderProductCard
                typeof renderProductCard !== "function" ||

                // Chưa tìm thấy khu vực hiển thị sản phẩm
                !productGrid
            ) {

                // Nếu chưa sẵn sàng thì chờ 150ms
                // rồi thử lại hàm renderProducts().
                //
                // Điều này hữu ích vì data.js / main.js có thể
                // chưa load xong khi React vừa render trang.
                window.setTimeout(renderProducts, 150);

                // Dừng lần chạy hiện tại.
                return;
            }


            // Khi dữ liệu đã sẵn sàng:
            //
            // products.map(renderProductCard)
            //
            // sẽ chạy renderProductCard() cho từng sản phẩm.
            //
            // Ví dụ:
            // products = [product1, product2, product3]
            //
            // sẽ trở thành:
            // [
            //     "<div>Product 1...</div>",
            //     "<div>Product 2...</div>",
            //     "<div>Product 3...</div>"
            // ]
            //
            // .join("") sẽ nối tất cả HTML thành một chuỗi.
            productGrid.innerHTML = products
                .map(renderProductCard)
                .join("");


            // Tìm phần tử hiển thị số lượng sản phẩm.
            //
            // Ví dụ HTML:
            // <p id="product-count-label">
            //     Hiển thị 24 sản phẩm chính hãng
            // </p>
            const productCount =
                document.getElementById("product-count-label");


            // Nếu tìm thấy phần tử product-count-label
            // thì cập nhật nội dung của nó.
            if (productCount) {

                // products.length = tổng số sản phẩm
                //
                // Ví dụ có 24 sản phẩm:
                // "Hiển thị 24 sản phẩm chính hãng"
                productCount.textContent =
                    `Hiển thị ${products.length} sản phẩm chính hãng`;
            }


            // Khởi tạo lại các icon Lucide
            // sau khi HTML sản phẩm vừa được thêm vào DOM.
            //
            // Dấu ?. giúp không bị lỗi nếu lucide chưa tồn tại.
            window.lucide?.createIcons();


            // Cập nhật trạng thái wishlist / sản phẩm yêu thích.
            //
            // Nếu hàm updateWishlistUI tồn tại thì gọi nó.
            // Nếu chưa tồn tại thì bỏ qua, không báo lỗi.
            window.updateWishlistUI?.();
        };


        // Gọi hàm renderProducts() lần đầu tiên.
        // Đây là lúc bắt đầu lấy và hiển thị sản phẩm.
        renderProducts();


        // Cleanup function của useEffect.
        //
        // Hàm này chạy khi component bị unmount
        // hoặc trước khi effect được chạy lại.
        return () => {

            // Đánh dấu component đã bị hủy.
            //
            // Những lần renderProducts() được gọi sau đó
            // sẽ gặp:
            //
            // if (cancelled) return;
            //
            // và dừng lại.
            cancelled = true;
        };


        // [] nghĩa là useEffect chỉ chạy một lần
        // sau khi component được render lần đầu.
    }, []);



    // ==========================================
    // CÁC HÀM GỌI JAVASCRIPT CŨ TRONG main.js
    // ==========================================

    const handleResetFilters = () => {
        window.resetFilters?.();
    };

    const handleSetCategory = (category) => {
        window.setFilter?.("category", category);
    };

    const handleSetPrice = (price) => {
        window.setPriceFilter?.(price);
    };

    const handleSetBrand = (brand) => {
        window.setBrandFilter?.(brand);
    };

    const handleSetRating = (rating) => {
        window.setRatingFilter?.(rating);
    };

    const handleSorting = (value) => {
        window.applySorting?.(value);
    };

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
                                        onClick={() =>
                                            handleSetCategory("headphone")
                                        }
                                        className="cat-filter-btn w-full text-left px-3 py-2 rounded-xl font-medium flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        data-cat="headphone"
                                    >
                                        <span>🎧 Tai nghe</span>
                                        <span className="text-[11px] opacity-75">
                                            3
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

                                <p
                                    className="text-xs text-slate-500 mt-0.5"
                                    id="product-count-label"
                                >
                                    Hiển thị 24 sản phẩm chính hãng
                                </p>

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
                            {/* Products được render bằng main.js */}
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
                        <div
                            className="flex items-center justify-center gap-2 pt-6 pb-2"
                            id="shop-pagination"
                        >

                            <button
                                type="button"
                                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                ← Trước
                            </button>

                            <button
                                type="button"
                                className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs"
                            >
                                1
                            </button>

                            <button
                                type="button"
                                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                2
                            </button>

                            <button
                                type="button"
                                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Sau →
                            </button>

                        </div>

                    </section>
                </div>
            </main>
        </>
    );
}

