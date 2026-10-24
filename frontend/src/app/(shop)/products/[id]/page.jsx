
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    getProductDetail,
    getAllProducts,
} from "@/services/productServices";
import {
    getOrCreateGuestCart,
    addCartItem,
} from "@/services/cartServices";

// Dinh dang gia tien
function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
}

// Lay ma phien gio hang cua khach vang lai
function getSessionId() {
    let sessionId = localStorage.getItem("cart_session_id");

    if (!sessionId) {
        sessionId =
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
                ? crypto.randomUUID().replaceAll("-", "")
                : `${Date.now()}${Math.random().toString(36).slice(2)}`;

        localStorage.setItem("cart_session_id", sessionId);
    }

    return sessionId;
}
// Lay danh sach san pham tu response API
function getProductArray(response) {
    const data = response?.data ?? response;

    // API co the tra ve mang truc tiep
    if (Array.isArray(data)) {
        return data;
    }

    // API co the tra ve danh sach trong data hoac products
    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
    }

    // Laravel Resource Collection co the tra ve data
    return [];
}

// Lay URL hinh anh tu Laravel
// Lấy URL hình ảnh an toàn
function getImageUrl(image) {
    if (!image || typeof image !== "string") return "";

    // Nếu đã là link đầy đủ http:// hoặc https://
    if (/^https?:\/\//i.test(image)) return image;

    // Lấy domain gốc, loại bỏ /storage thừa và khoảng trắng
    let base = (
        process.env.NEXT_PUBLIC_IMAGE_URL ||
        (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/api\/?$/, "")
    ).trim();

    base = base.replace(/\/storage\/?$/, "").replace(/\/$/, "");

    const path = image
        .replace(/^\/+/, "")
        .replace(/^storage\//, "");

    return `${base}/storage/${path}`;
}

// Lấy danh sách ảnh sản phẩm (1 ảnh chính + các ảnh phụ)
function getProductImages(product) {
    if (!product) return [];

    // 1. Chỉ lấy đúng 1 ảnh chính (ưu tiên theo thứ tự)
    const mainImageRaw =
        product.hinh_anh_url ||
        product.hinh_anh ||
        product.image_url ||
        product.image ||
        "";

    const mainImage = getImageUrl(mainImageRaw);

    // 2. Danh sách ảnh phụ
    const extraList = [
        ...(Array.isArray(product.hinh_anh_phu) ? product.hinh_anh_phu : []),
        ...(Array.isArray(product.images) ? product.images : []),
    ];

    const extraImages = extraList
        .map((img) => {
            if (typeof img === "string") return getImageUrl(img);
            return getImageUrl(img?.image_url || img?.url || img?.image_path || "");
        })
        .filter(Boolean);

    // Gộp ảnh chính đầu tiên, sau đó là các ảnh phụ và lọc trùng
    const allImages = [mainImage, ...extraImages].filter(Boolean);
    return [...new Set(allImages)];
}


// The hien the san pham lien quan
function RelatedProductCard({ product }) {
    const image = getProductImages(product)[0];
    const price = Number(product.gia ?? product.price ?? 0);
    const salePrice = Number(
        product.gia_khuyen_mai ?? product.sale_price ?? 0
    );
    const hasSale = salePrice > 0 && salePrice < price;

    return (
        <Link
            href={`/products/${product.id}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex h-44 items-center justify-center bg-slate-50 p-4 dark:bg-slate-800">
                {image ? (
                    <img
                        src={image}
                        alt={product.ten || product.product_name}
                        loading="lazy"
                        className="h-full w-full object-contain transition group-hover:scale-105"
                    />
                ) : (
                    <span className="text-sm text-slate-400">
                        Chưa có hình ảnh
                    </span>
                )}
            </div>

            <div className="p-4">
                <p className="mb-2 text-xs font-semibold text-blue-600">
                    {product.thuong_hieu?.ten || "Thiết bị công nghệ"}
                </p>

                <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-800 group-hover:text-blue-600 dark:text-white">
                    {product.ten || product.product_name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-rose-600">
                        {formatPrice(hasSale ? salePrice : price)}
                    </span>

                    {hasSale && (
                        <span className="text-xs text-slate-400 line-through">
                            {formatPrice(price)}
                        </span>
                    )}
                </div>

                <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600 dark:border-slate-800">
                    Xem chi tiết →
                </p>
            </div>
        </Link>
    );
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState("success");
    const [addingToCart, setAddingToCart] = useState(false);

    // Tai chi tiet san pham va danh sach san pham
    useEffect(() => {
        if (!id) return;

        let cancelled = false;

        async function loadData() {
            setLoading(true);
            setErrorMessage("");

            try {
                const [detailResponse, listResponse] = await Promise.all([
                    getProductDetail(id),
                    getAllProducts(),
                ]);

                const detail = detailResponse?.data ?? detailResponse;
                const list = getProductArray(listResponse);

                if (!detail?.id) {
                    throw new Error("Không tìm thấy sản phẩm.");
                }

                if (cancelled) return;

                setProduct(detail);
                setProducts(list);
                setSelectedImage(getProductImages(detail)[0] || "");
                setQuantity(1);
            } catch (error) {
                if (!cancelled) {
                    setErrorMessage(
                        error?.message || "Không thể tải sản phẩm."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // Anh cua san pham hien tai
    const images = useMemo(
        () => getProductImages(product),
        [product]
    );

    // Tim san pham cung danh muc hoac thuong hieu
    // Tim san pham lien quan: bat buoc cung danh muc, uu tien cung thuong hieu
    const relatedProducts = useMemo(() => {
        if (!product) return [];

        return products
            .filter(
                (item) =>
                    String(item.id) !== String(product.id) &&
                    Number(item.trang_thai ?? item.status ?? 1) === 1 &&
                    // Chi lay san pham cung danh muc
                    String(item.danh_muc_id) === String(product.danh_muc_id)
            )
            .map((item) => {
                const sameBrand =
                    product.thuong_hieu_id &&
                    String(item.thuong_hieu_id) === String(product.thuong_hieu_id);

                return { item, score: sameBrand ? 1 : 0 };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(({ item }) => item);
    }, [product, products]);

    // Hien thong bao ket qua thao tac
    function showNotice(message, type = "success") {
        setNotice(message);
        setNoticeType(type);
    }

    // Them san pham vao gio hang bang localStorage
    // function addToCart(buyNow = false) {
    //     if (!product) return;

    //     const stock = Number(
    //         product.so_luong_ton ?? product.qty ?? 0
    //     );

    //     if (stock <= 0) {
    //         showNotice("Sản phẩm hiện đã hết hàng.", "error");
    //         return;
    //     }

    //     if (quantity < 1 || quantity > stock) {
    //         showNotice("Số lượng mua không hợp lệ.", "error");
    //         return;
    //     }

    //     setAddingToCart(true);

    //     try {
    //         const savedCart = localStorage.getItem("cartItems");
    //         const cart = savedCart ? JSON.parse(savedCart) : [];

    //         if (!Array.isArray(cart)) {
    //             throw new Error("Dữ liệu giỏ hàng không hợp lệ.");
    //         }

    //         const existingIndex = cart.findIndex(
    //             (item) => String(item.id) === String(product.id)
    //         );

    //         if (existingIndex >= 0) {
    //             const newQuantity =
    //                 Number(cart[existingIndex].quantity || 0) + quantity;

    //             if (newQuantity > stock) {
    //                 showNotice(
    //                     `Số lượng trong giỏ không thể vượt quá ${stock}.`,
    //                     "error"
    //                 );
    //                 return;
    //             }

    //             cart[existingIndex] = {
    //                 ...cart[existingIndex],
    //                 quantity: newQuantity,
    //             };
    //         } else {
    //             cart.push({
    //                 id: product.id,
    //                 ten: product.ten || product.product_name,
    //                 name: product.ten || product.product_name,
    //                 gia: product.gia ?? product.price ?? 0,
    //                 gia_khuyen_mai:
    //                     product.gia_khuyen_mai ??
    //                     product.sale_price ??
    //                     0,
    //                 hinh_anh_url:
    //                     product.hinh_anh_url ||
    //                     product.hinh_anh ||
    //                     product.image ||
    //                     "",
    //                 image:
    //                     product.hinh_anh_url ||
    //                     product.hinh_anh ||
    //                     product.image ||
    //                     "",
    //                 quantity,
    //             });
    //         }

    //         localStorage.setItem("cartItems", JSON.stringify(cart));

    //         // Bao cho cac component cung trang biet gio hang da thay doi
    //         window.dispatchEvent(new Event("cartUpdated"));

    //         if (buyNow) {
    //             router.push("/cart");
    //             return;
    //         }

    //         showNotice("Đã thêm sản phẩm vào giỏ hàng!");
    //     } catch (error) {
    //         console.error("Lỗi cập nhật giỏ hàng:", error);
    //         showNotice(
    //             "Không thể cập nhật giỏ hàng. Vui lòng thử lại.",
    //             "error"
    //         );
    //     } finally {
    //         setAddingToCart(false);
    //     }
    // }

    
    // Them san pham vao gio hang bang API Laravel
    async function addToCart(buyNow = false) {
        if (!product || addingToCart) return;

        const stock = Number(
            product.so_luong_ton ?? product.qty ?? 0
        );

        if (stock <= 0) {
            showNotice("Sản phẩm hiện đã hết hàng.", "error");
            return;
        }

        if (
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) < 1 ||
            Number(quantity) > stock
        ) {
            showNotice("Số lượng mua không hợp lệ.", "error");
            return;
        }

        setAddingToCart(true);

        try {
            // Lay ma phien khach hang
            const sessionId = getSessionId();

            // Lay hoac tao gio hang trong database
            const response = await getOrCreateGuestCart(sessionId);
            const cart = response?.data;

            if (!cart?.id) {
                console.error("Du lieu gio hang:", response);
                throw new Error("Khong lay duoc ID gio hang.");
            }

            // Them san pham vao gio hang trong database
            const result = await addCartItem({
                gio_hang_id: cart.id,
                san_pham_id: product.id,
                so_luong: Number(quantity),
            });

            console.log("Ket qua them gio hang:", result);

            // Cap nhat so luong gio hang tren giao dien
            window.dispatchEvent(new Event("cartUpdated"));

            if (buyNow) {
                router.push("/cart");
                return;
            }

            showNotice("Đã thêm sản phẩm vào giỏ hàng!");
        } catch (error) {
            console.error("Loi them gio hang:", error);
            console.error(
                "Phan hoi tu Laravel:",
                error?.response?.data
            );

            showNotice(
                error?.response?.data?.message ||
                    error?.message ||
                    "Không thể thêm sản phẩm vào giỏ hàng.",
                "error"
            );
        } finally {
            setAddingToCart(false);
        }
    }


    if (loading) {
        return (
            <main className="min-h-screen bg-slate-100 px-4 py-20 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="h-[420px] rounded-3xl bg-slate-200 dark:bg-slate-800" />
                        <div className="h-[420px] rounded-3xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Đang tải thông tin sản phẩm...
                    </p>
                </div>
            </main>
        );
    }

    if (errorMessage || !product) {
        return (
            <main className="min-h-[60vh] bg-slate-100 px-4 py-20 text-center dark:bg-slate-950">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    Không tìm thấy sản phẩm
                </h1>
                <p className="mt-3 text-slate-500">
                    {errorMessage || "Sản phẩm không tồn tại."}
                </p>
                <Link
                    href="/products"
                    className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                >
                    Quay lại cửa hàng
                </Link>
            </main>
        );
    }

    const originalPrice = Number(product.gia ?? product.price ?? 0);
    const salePrice = Number(
        product.gia_khuyen_mai ?? product.sale_price ?? 0
    );

    const hasSale =
        salePrice > 0 &&
        originalPrice > 0 &&
        salePrice < originalPrice;

    const displayPrice = hasSale ? salePrice : originalPrice;
    const stock = Number(product.so_luong_ton ?? product.qty ?? 0);

    const discount = hasSale
        ? Math.round((1 - salePrice / originalPrice) * 100)
        : 0;

    const productName = product.ten || product.product_name;
    const brandName = product.thuong_hieu?.ten || "Chưa cập nhật";
    const categoryName = product.danh_muc?.ten || "Chưa phân loại";

    return (
        <main className="min-h-screen bg-slate-100 pb-16 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Duong dan dieu huong */}
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-blue-600">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600">
                        Cửa hàng
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-slate-800 dark:text-white">
                        {productName}
                    </span>
                </nav>

                {/* Khu vuc thong tin san pham */}
                <section className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Hinh anh */}
                    <div className="min-w-0">
                        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:min-h-[490px] sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                            {hasSale && (
                                <span className="absolute left-5 top-5 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-bold text-white">
                                    -{discount}%
                                </span>
                            )}

                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={productName}
                                    className="max-h-[440px] w-full object-contain"
                                />
                            ) : (
                                <p className="text-sm text-slate-400">
                                    Chưa có hình ảnh sản phẩm
                                </p>
                            )}
                        </div>

                        {images.length > 0 && (
                            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 bg-white p-2 dark:bg-slate-900 ${selectedImage === image
                                            ? "border-blue-600"
                                            : "border-transparent hover:border-slate-300"
                                            }`}
                                        aria-label={`Xem ảnh ${index + 1}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${productName} ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thong tin va thao tac mua hang */}
                    <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {brandName}
                            </span>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${stock > 0
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                    }`}
                            >
                                {stock > 0 ? "Còn hàng" : "Hết hàng"}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {categoryName}
                            </span>
                        </div>

                        <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl dark:text-white">
                            {productName}
                        </h1>

                        <div className="mt-4 text-sm text-slate-500">
                            Mã sản phẩm: {product.id}
                        </div>

                        {/* Gia ban */}
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-black text-rose-600 sm:text-4xl">
                                    {formatPrice(displayPrice)}
                                </span>

                                {hasSale && (
                                    <span className="text-sm text-slate-400 line-through">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>

                            {hasSale && (
                                <p className="mt-2 text-sm font-semibold text-emerald-600">
                                    Tiết kiệm{" "}
                                    {formatPrice(originalPrice - salePrice)}
                                </p>
                            )}
                        </div>

                        {/* Chon so luong */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Số lượng
                                </p>

                                <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) =>
                                                Math.max(1, current - 1)
                                            )
                                        }
                                        disabled={quantity <= 1 || stock <= 0}
                                        className="h-11 w-11 text-lg font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-slate-800"
                                        aria-label="Giảm số lượng"
                                    >
                                        −
                                    </button>

                                    <input
                                        type="number"
                                        min="1"
                                        max={stock}
                                        value={quantity}
                                        disabled={stock <= 0}
                                        onChange={(event) => {
                                            const value = Number(event.target.value);

                                            if (event.target.value === "") {
                                                setQuantity("");
                                                return;
                                            }

                                            setQuantity(
                                                Math.min(
                                                    stock || 1,
                                                    Math.max(1, value)
                                                )
                                            );
                                        }}
                                        onBlur={() => {
                                            setQuantity(
                                                Math.min(
                                                    stock || 1,
                                                    Math.max(1, Number(quantity) || 1)
                                                )
                                            );
                                        }}
                                        className="h-11 w-14 border-x border-slate-300 bg-white text-center text-sm font-bold text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) =>
                                                Math.min(
                                                    stock,
                                                    Number(current || 1) + 1
                                                )
                                            )
                                        }
                                        disabled={quantity >= stock || stock <= 0}
                                        className="h-11 w-11 text-lg font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-slate-800"
                                        aria-label="Tăng số lượng"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500">
                                {stock > 0
                                    ? `Còn ${stock} sản phẩm`
                                    : "Tạm hết hàng"}
                            </p>
                        </div>

                        {/* Tong tien theo so luong */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                            <span className="text-sm text-slate-500">
                                Tạm tính
                            </span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                                {formatPrice(displayPrice * (Number(quantity) || 0))}
                            </span>
                        </div>

                        {/* Nut mua ngay va them gio hang */}
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => addToCart(true)}
                                disabled={stock <= 0 || addingToCart}
                                className="rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {addingToCart ? "Đang xử lý..." : "⚡ Mua ngay"}
                            </button>

                            <button
                                type="button"
                                onClick={() => addToCart(false)}
                                disabled={stock <= 0 || addingToCart}
                                className="rounded-xl border border-blue-600 bg-white px-4 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
                            >
                                🛒 Thêm vào giỏ hàng
                            </button>
                        </div>

                        {/* Thong bao thao tac */}
                        {notice && (
                            <div
                                role="status"
                                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${noticeType === "error"
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    }`}
                            >
                                {notice}
                                {noticeType !== "error" && (
                                    <Link
                                        href="/cart"
                                        className="ml-2 font-bold underline"
                                    >
                                        Xem giỏ hàng
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Cam ket dich vu */}
                        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                            <div className="text-center">
                                <div className="text-xl">🛡️</div>
                                <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Nguồn gốc rõ ràng
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-xl">📦</div>
                                <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Đóng gói cẩn thận
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-xl">💬</div>
                                <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Hỗ trợ khách hàng
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mo ta san pham */}
                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="border-b border-slate-100 pb-4 text-xl font-black text-slate-900 dark:border-slate-800 dark:text-white">
                        Mô tả sản phẩm
                    </h2>

                    <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {product.mo_ta || "Sản phẩm chưa có mô tả chi tiết."}
                    </div>
                </section>

                {/* San pham lien quan */}
                <section className="mt-10">
                    <div className="mb-5">
                        <p className="text-sm font-bold text-blue-600">
                            GỢI Ý DÀNH CHO BẠN
                        </p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                            Sản phẩm liên quan
                        </h2>
                    </div>

                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.map((item) => (
                                <RelatedProductCard
                                    key={item.id}
                                    product={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                            Chưa có sản phẩm liên quan để hiển thị.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
