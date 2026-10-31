
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    getOrCreateGuestCart,
    updateCartItem,
    deleteCartItem,
} from "@/services/cartServices";
import { formatCurrency } from "@/utils/formatCurrency";
import {
    getLocalCart,
    saveLocalCart,
    updateLocalCartQuantity,
    removeLocalCartItem,
    clearLocalCart,
    isUserLoggedIn,
} from "@/services/cartStorage";
import { showToast } from "@/components/common/Toast";
import { getMe } from "@/services/authServices";

// Tao ma phien rieng cho gio hang khach
function getSessionId() {
    let sessionId = localStorage.getItem("cart_session_id");

    if (!sessionId) {
        sessionId = typeof crypto.randomUUID === "function"
            ? crypto.randomUUID().replaceAll("-", "")
            : Array.from(
                { length: 4 },
                () => Math.random().toString(36).slice(2)
            ).join("");

        localStorage.setItem("cart_session_id", sessionId);
    }

    return sessionId;
}

// Chuyen du lieu API thanh du lieu hien thi tren giao dien
function mapCartItems(cart) {
    return (cart?.chi_tiet_gio_hang || []).map((item) => {
        const product = item.san_pham || {};

        const originalPrice = Number(product.gia || product.price || 0);
        const salePrice = Number(
            product.gia_khuyen_mai || product.sale_price || 0
        );

        return {
            id: item.id,
            productId: item.san_pham_id,
            name: product.ten || product.product_name || "San pham",
            category: product.danh_muc?.ten || "San pham",
            slug: product.duong_dan || product.slug || "",
            price:
                salePrice > 0 && salePrice < originalPrice
                    ? salePrice
                    : originalPrice,
            originalPrice,
            imageUrl:
                product.hinh_anh_url ||
                product.hinh_anh ||
                product.image ||
                "/images/no-image.png",
            quantity: Number(item.so_luong || 1),
            selected: true,
        };
    });
}

// Dieu huong trinh duyet sang cong thanh toan ben ngoai (VNPAY)
function navigateToExternalUrl(targetUrl) {
    if (typeof window !== "undefined" && targetUrl) {
        window.location.assign(targetUrl);
    }
}

export default function Cart() {
    const router = useRouter();

    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Dieu khien cac buoc thanh toan
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderCode, setOrderCode] = useState("");
    const [createdOrder, setCreatedOrder] = useState(null);
    const [createdPaymentUrl, setCreatedPaymentUrl] = useState("");
    const [openingVNPay, setOpeningVNPay] = useState(false);
    // Luu thong tin nguoi nhan hang
    const [currentUser, setCurrentUser] = useState(null);
    const [customer, setCustomer] = useState({
        ten_nguoi_nhan: "",
        so_dien_thoai: "",
        email: "",
        dia_chi: "",
        phuong_thuc_thanh_toan: "vnpay", // Mặc định ưu tiên VNPAY / VNPAY-QR
    });

    // Tu dong dien thong tin nguoi nhan tu tai khoan dang dang nhap
    useEffect(() => {
        const applyUserData = (user) => {
            if (!user) return;
            setCurrentUser(user);
            setCustomer((prev) => ({
                ...prev,
                ten_nguoi_nhan: prev.ten_nguoi_nhan || user.ho_ten || user.name || "",
                so_dien_thoai: prev.so_dien_thoai || user.so_dien_thoai || user.phone || user.dien_thoai || "",
                email: prev.email || user.email || "",
                dia_chi: prev.dia_chi || user.dia_chi || user.address || "",
            }));
        };

        // 1. Doc ngay tu localStorage de dien lap tuc
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const parsed = JSON.parse(userStr);
                applyUserData(parsed);
            }
        } catch (err) {
            console.error("Loi doc user tu localStorage:", err);
        }

        // 2. Goi them getMe() tu backend de lay du lieu moi nhat (sdt, dia chi)
        getMe()
            .then((res) => {
                const user = res?.user || res?.data || res;
                if (user) {
                    applyUserData(user);
                    try {
                        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
                        localStorage.setItem("user", JSON.stringify({ ...localUser, ...user }));
                    } catch (e) {}
                }
            })
            .catch(() => {});
    }, []);


    // Kiểm tra đăng nhập: Chưa đăng nhập thì không được xem giỏ hàng
    useEffect(() => {
        if (!isUserLoggedIn()) {
            showToast.warning("Vui lòng đăng nhập tài khoản để xem giỏ hàng của bạn!");
            router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
        }
    }, [router]);

    // Lay gio hang tu database & localStorage khi mo trang
    useEffect(() => {
        let cancelled = false;

        async function loadCart() {
            try {
                setLoading(true);
                setErrorMessage("");

                // 1. Đọc giỏ hàng đã lưu trong localStorage trước
                const localItems = getLocalCart();

                const currentSessionId = getSessionId();
                if (cancelled) return;

                setSessionId(currentSessionId);

                // 2. Tải thêm từ database (nếu có)
                let mapped = [];
                try {
                    const response = await getOrCreateGuestCart(currentSessionId);
                    if (!cancelled) {
                        const cart = response?.data;
                        mapped = mapCartItems(cart);
                        setCartId(cart?.id || null);
                    }
                } catch (apiErr) {
                    // Nếu lỗi API vẫn dùng giỏ hàng localStorage
                }

                if (cancelled) return;

                // 3. Hợp nhất giữa localItems và mapped từ database
                let merged = [...localItems];
                for (const dbItem of mapped) {
                    const exists = merged.find((item) => String(item.id || item.productId) === String(dbItem.productId || dbItem.id));
                    if (!exists) {
                        merged.push(dbItem);
                    }
                }

                // Đảm bảo các thuộc tính id, productId, selected đầy đủ
                merged = merged.map((item) => ({
                    ...item,
                    id: item.id || item.productId,
                    productId: item.productId || item.id,
                    selected: item.selected !== undefined ? item.selected : true,
                }));

                setCartItems(merged);
                saveLocalCart(merged);

                // Tu dong vao thanh toan khi den tu nut "Mua ngay"
                const wantCheckout =
                    new URLSearchParams(window.location.search).get("checkout") === "1";

                if (wantCheckout) {
                    const token =
                        localStorage.getItem("token") ||
                        localStorage.getItem("access_token");

                    if (!token) {
                        router.push(
                            `/login?redirect=${encodeURIComponent("/cart?checkout=1")}`
                        );
                        return;
                    }

                    if (merged.length > 0) setShowCheckout(true);
                }
            } catch (error) {
                if (!cancelled) {
                    const localItems = getLocalCart();
                    setCartItems(localItems);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCart();

        return () => {
            cancelled = true;
        };
    }, []);

    // Cap nhat so luong trong database & localStorage
    const handleUpdateQuantity = async (id, delta) => {
        const item = cartItems.find((product) => product.id === id);
        if (!item || processing) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        // Cập nhật ngay trên state và localStorage
        const updatedItems = cartItems.map((product) =>
            product.id === id
                ? { ...product, quantity: newQuantity }
                : product
        );
        setCartItems(updatedItems);
        saveLocalCart(updatedItems);

        try {
            setErrorMessage("");
            if (cartId && item.productId) {
                await updateCartItem(id, {
                    gio_hang_id: cartId,
                    san_pham_id: item.productId,
                    so_luong: newQuantity,
                });
            }
        } catch (error) {
            // Đã lưu thành công vào localStorage
        }
    };

    // Xoa mot san pham khoi database & localStorage
    const handleRemoveItem = async (id) => {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedItems);
        saveLocalCart(updatedItems);
        showToast.success("Đã xóa sản phẩm khỏi giỏ hàng");

        try {
            setErrorMessage("");
            await deleteCartItem(id);
        } catch (error) {
            // Đã xóa trên localStorage
        }
    };

    // Chon hoac bo chon san pham tren giao dien
    const handleToggleSelect = (id) => {
        setCartItems((prev) => {
            const next = prev.map((item) =>
                item.id === id
                    ? { ...item, selected: !item.selected }
                    : item
            );
            saveLocalCart(next);
            return next;
        });
    };

    const isAllSelected =
        cartItems.length > 0 &&
        cartItems.every((item) => item.selected);

    const handleToggleSelectAll = () => {
        const nextState = !isAllSelected;

        setCartItems((prev) => {
            const next = prev.map((item) => ({ ...item, selected: nextState }));
            saveLocalCart(next);
            return next;
        });
    };

    // Xoa toan bo san pham trong gio hang
    const handleClearCart = async () => {
        if (processing) return;

        setCartItems([]);
        clearLocalCart();
        showToast.info("Đã làm trống giỏ hàng");

        try {
            setErrorMessage("");
            await Promise.all(
                cartItems.map((item) => deleteCartItem(item.id))
            );
        } catch (error) {
            // Đã xóa trên localStorage
        }
    };

    // Tinh tong tien tu cac san pham da chon
    const selectedItems = cartItems.filter((item) => item.selected);

    const totalSelectedQty = selectedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Chua ap dung ma giam gia khi backend chua xac thuc voucher
    const discount = 0;
    const shippingFee = 0;
    const grandTotal = subtotal - discount + shippingFee;

    // Tao don hang tu gio hang database
    const handleCheckout = async (event) => {
        event.preventDefault();

        if (!selectedItems.length) {
            setErrorMessage("Vui long chon san pham muon dat hang.");
            return;
        }

        if (!sessionId) {
            setErrorMessage("Khong tim thay phien gio hang. Hay tai lai trang.");
            return;
        }

        try {
            setProcessing(true);
            setErrorMessage("");
            setSuccessMessage("");

            // Chi cho phep dat hang voi toan bo gio hang da chon
            // Backend hien tai xoa tat ca item trong gio sau khi dat hang.
            if (selectedItems.length !== cartItems.length) {
                setErrorMessage(
                    "Backend hien xoa toan bo gio hang sau khi dat hang. " +
                    "Vui long chon tat ca san pham hoac bo chon cac san pham khong muon mua."
                );
                return;
            }

            const axiosClient = (
                await import("@/lib/axiosClient")
            ).default;

            // Chuẩn bị danh sách sản phẩm đặt hàng từ giỏ hàng hiện tại (localStorage)
            const orderItems = (selectedItems.length > 0 ? selectedItems : cartItems).map((item) => ({
                san_pham_id: item.productId || item.id,
                so_luong: Number(item.quantity || 1),
            }));

            // Gửi dữ liệu đặt hàng lên backend: họ tên, số điện thoại, địa chỉ, phương thức, email và danh sách sản phẩm
            const response = await axiosClient.post("/orders", {
                ...customer,
                email: customer.email || currentUser?.email || "", // Gửi email để backend gửi xác nhận qua PHPMailer
                session_id: sessionId,
                items: orderItems,
            });

            // axiosClient interceptor đã trích xuất sẵn response.data
            // Cấu trúc server trả về: { message, data: { ...order }, payment_url }
            const resData = response?.data || response;
            const order = response?.data?.data || response?.data || response;
            const paymentUrl = response?.payment_url || resData?.payment_url || response?.data?.payment_url;

            const finalOrderCode = order?.ma_don_hang || "DH_PENDING";
            setOrderCode(finalOrderCode);
            setCreatedOrder(order);
            if (paymentUrl) {
                setCreatedPaymentUrl(paymentUrl);
            }
            setCartItems([]);
            clearLocalCart();

            // Nếu khách chọn thanh toán qua VNPAY -> lập tức chuyển hướng sang Cổng thanh toán VNPAY (nơi có mã QR và thẻ ngân hàng)
            if (customer.phuong_thuc_thanh_toan === "vnpay") {
                if (paymentUrl) {
                    showToast.info("Đang chuyển hướng sang Cổng VNPAY để quét mã QR...", 5000);
                    navigateToExternalUrl(paymentUrl);
                    return;
                }

                // Nếu chưa có payment_url ngay, gọi API tạo link thanh toán VNPAY
                try {
                    showToast.info("Đang kết nối Cổng VNPAY...", 4000);
                    const targetId = order?.id || finalOrderCode;
                    const payRes = await axiosClient.post("/vnpay/create-payment", {
                        order_id: targetId,
                    });
                    const fallbackUrl = payRes?.payment_url || payRes?.data?.payment_url;
                    if (fallbackUrl) {
                        setCreatedPaymentUrl(fallbackUrl);
                        navigateToExternalUrl(fallbackUrl);
                        return;
                    }
                } catch (payErr) {
                    console.error("Lỗi tạo payment URL dự phòng:", payErr);
                }
            }

            // Với phương thức COD hoặc chuyển khoản thường: Hiển thị màn hình đặt hàng thành công
            setShowCheckout(false);
            setOrderSuccess(true);


        } catch (error) {
            // In chi tiet loi API de kiem tra
            console.error("Loi tao don hang:", error.response?.status);
            console.error(
                "Du lieu loi tu Laravel:",
                JSON.stringify(error.response?.data, null, 2)
            );
            console.error("Du lieu gui len:", {
                ...customer,
                session_id: sessionId,
            });

            const errors = error.response?.data?.errors;

            const validationMessage = errors
                ? Object.values(errors).flat().join(" ")
                : "";

            setErrorMessage(
                validationMessage ||
                error.response?.data?.message ||
                "Dat hang that bai. Vui long kiem tra log Laravel."
            );
        } finally {
            setProcessing(false);
        }
    };

    // Hàm mở Cổng thanh toán VNPAY / Quét mã QR khi người dùng nhấn nút
    const handleOpenVNPay = async () => {
        try {
            setOpeningVNPay(true);
            if (createdPaymentUrl) {
                showToast.info("Đang mở Cổng thanh toán VNPAY...", 3000);
                navigateToExternalUrl(createdPaymentUrl);
                return;
            }

            showToast.info("Đang kết nối Cổng thanh toán VNPAY...", 3000);
            const axiosClient = (await import("@/lib/axiosClient")).default;
            const targetId = createdOrder?.id || createdOrder?.ma_don_hang || orderCode;
            const payRes = await axiosClient.post("/vnpay/create-payment", {
                order_id: targetId,
            });

            const url = payRes?.payment_url || payRes?.data?.payment_url;
            if (url) {
                setCreatedPaymentUrl(url);
                showToast.success("Chuyển hướng đến Cổng VNPAY thành công!");
                navigateToExternalUrl(url);
            } else {
                showToast.error("Không nhận được liên kết thanh toán từ VNPAY. Vui lòng thử lại!");
            }
        } catch (err) {
            console.error("Lỗi mở VNPAY:", err);
            showToast.error("Không thể mở Cổng VNPAY. Vui lòng thử lại!");
        } finally {
            setOpeningVNPay(false);
        }
    };

    // Man hinh xac nhan dat hang thanh cong
    if (orderSuccess) {
        return (
            <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center shadow-sm">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                        <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-emerald-600 dark:text-emerald-400"
                        >
                            <path d="m5 12 4 4L19 6" />
                        </svg>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        Đặt hàng thành công!
                    </h1>

                    {orderCode && (
                        <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Mã đơn hàng: #{orderCode}
                        </p>
                    )}

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        Cảm ơn bạn đã mua sắm tại TECHNOVA.
                        Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
                    </p>

                    {/* Nếu đơn hàng chọn thanh toán VNPAY nhưng chưa thanh toán xong, cho nút quét QR ngay */}
                    {(customer.phuong_thuc_thanh_toan === "vnpay" || createdPaymentUrl || orderCode) && (
                        <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-left">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    Thanh toán VNPAY / VNPAY-QR
                                </p>
                                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                                    Chờ quét mã
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                Nhấn nút bên dưới để mở ngay màn hình quét mã QR bằng App Ngân hàng hoặc thanh toán thẻ ATM test:
                            </p>
                            <button
                                type="button"
                                disabled={openingVNPay}
                                onClick={handleOpenVNPay}
                                className="mt-3 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 px-4 py-3.5 font-bold text-white text-sm shadow-md transition cursor-pointer"
                            >
                                {openingVNPay ? (
                                    <span>Đang mở Cổng VNPAY...</span>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                                        <span>Mở Cổng Quét Mã QR VNPAY Ngay ➔</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    <div className="mt-4 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs sm:text-sm flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span>Email xác nhận đơn hàng chi tiết đã được gửi tự động đến hộp thư của bạn!</span>
                    </div>



                    <div className="mt-7 flex flex-col gap-3">
                        <Link
                            href="/"
                            className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                        >
                            Tiếp tục mua sắm
                        </Link>

                        <button
                            type="button"
                            onClick={() => router.push("/profile?tab=orders")}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Xem chi tiết đơn hàng của tôi
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Man hinh thanh toan rieng
    if (showCheckout) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-6xl">
                    <button
                        type="button"
                        onClick={() => {
                            setShowCheckout(false);
                            setErrorMessage("");
                        }}
                        className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        ← Quay lại giỏ hàng
                    </button>

                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            Thanh toán
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Kiểm tra thông tin và xác nhận đơn hàng của bạn.
                        </p>
                    </div>

                    <form
                        onSubmit={handleCheckout}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                    >
                        {/* Thong tin nhan hang va phuong thuc thanh toan */}
                        <div className="lg:col-span-8 space-y-6">
                            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                                <circle cx="12" cy="10" r="3"/>
                                            </svg>
                                            Địa chỉ nhận hàng
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                            Thông tin được tự động điền từ tài khoản, bạn có thể chỉnh sửa nếu gửi đến người nhận khác.
                                        </p>
                                    </div>
                                    {currentUser && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                            Đã tự động điền từ tài khoản
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                                            <span>Họ và tên người nhận <span className="text-rose-500">*</span></span>
                                            {currentUser?.ho_ten && (
                                                <span className="text-xs font-normal text-slate-400">Tài khoản: {currentUser.ho_ten}</span>
                                            )}
                                        </label>

                                        <input
                                            type="text"
                                            value={customer.ten_nguoi_nhan}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    ten_nguoi_nhan: e.target.value,
                                                })
                                            }
                                            placeholder="Nhập họ và tên người nhận"
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                                            <span>Số điện thoại <span className="text-rose-500">*</span></span>
                                            {currentUser?.so_dien_thoai ? (
                                                <span className="text-xs font-normal text-slate-400">Mặc định: {currentUser.so_dien_thoai}</span>
                                            ) : (
                                                <span className="text-xs font-normal text-amber-500">Chưa lưu SĐT trong hồ sơ</span>
                                            )}
                                        </label>

                                        <input
                                            type="tel"
                                            value={customer.so_dien_thoai}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    so_dien_thoai: e.target.value,
                                                })
                                            }
                                            placeholder="Nhập số điện thoại nhận hàng"
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Trường nhập Email nhận thông báo xác nhận đơn hàng */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                                            <span>Email nhận thông báo đơn hàng <span className="text-xs font-normal text-slate-400">(nhận hóa đơn qua email)</span></span>
                                            {currentUser?.email && (
                                                <span className="text-xs font-normal text-slate-400">Mặc định: {currentUser.email}</span>
                                            )}
                                        </label>

                                        <input
                                            type="email"
                                            value={customer.email}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    email: e.target.value,
                                                })
                                            }
                                            placeholder="Nhập email của bạn (vd: nguoiyahoo@gmail.com)"
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                                            <span>Địa chỉ giao hàng <span className="text-rose-500">*</span></span>
                                            {currentUser?.dia_chi ? (
                                                <span className="text-xs font-normal text-slate-400">Địa chỉ đã lưu</span>
                                            ) : (
                                                <span className="text-xs font-normal text-amber-500">Chưa lưu địa chỉ trong hồ sơ</span>
                                            )}
                                        </label>

                                        <textarea
                                            value={customer.dia_chi}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    dia_chi: e.target.value,
                                                })
                                            }
                                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                                            rows={3}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Phương thức thanh toán</span>
                                    <span className="text-xs font-normal text-blue-600 dark:text-blue-400">Chọn 1 phương thức</span>
                                </h2>

                                <div className="mt-5 space-y-3">
                                    {/* 1. Thanh toán Cổng VNPAY / VNPAY-QR (Đưa lên đầu và ưu tiên) */}
                                    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${customer.phuong_thuc_thanh_toan === "vnpay"
                                        ? "border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 ring-2 ring-blue-500/40 shadow-sm"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="vnpay"
                                            checked={customer.phuong_thuc_thanh_toan === "vnpay"}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    phuong_thuc_thanh_toan: e.target.value,
                                                })
                                            }
                                            className="mt-1 accent-blue-600 cursor-pointer h-4 w-4"
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-[10px]">
                                                        VN
                                                    </div>
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        Chuyển khoản qua VNPAY / Quét mã QR
                                                    </p>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-rose-500 to-red-600 text-white uppercase tracking-wider shadow-xs">
                                                    Khuyên dùng
                                                </span>
                                            </div>

                                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                                                    VNPAY-QR
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                    App Ngân hàng (VCB, BIDV, Agribank, MB...)
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                    Thẻ ATM / NCB Test
                                                </span>
                                            </div>

                                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                Quét mã QR bằng ứng dụng ngân hàng hoặc thanh toán thẻ ATM nội địa / thẻ quốc tế. Chuyển hướng bảo mật sang Cổng VNPAY.
                                            </p>

                                            {customer.phuong_thuc_thanh_toan === "vnpay" && (
                                                <div className="mt-3 p-2.5 rounded-xl bg-blue-100/70 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
                                                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                                                    <span>Bấm <strong>&quot;Thanh toán ngay qua VNPAY-QR&quot;</strong> để mở màn hình quét mã QR.</span>
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    {/* 2. Thanh toán COD */}
                                    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${customer.phuong_thuc_thanh_toan === "cod"
                                        ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={customer.phuong_thuc_thanh_toan === "cod"}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    phuong_thuc_thanh_toan: e.target.value,
                                                })
                                            }
                                            className="mt-1 accent-blue-600 cursor-pointer h-4 w-4"
                                        />

                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span>Thanh toán khi nhận hàng (COD)</span>
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm.
                                            </p>
                                        </div>
                                    </label>

                                    {/* 3. Chuyển khoản ngân hàng thường */}
                                    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${customer.phuong_thuc_thanh_toan === "bank_transfer"
                                        ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="bank_transfer"
                                            checked={customer.phuong_thuc_thanh_toan === "bank_transfer"}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    phuong_thuc_thanh_toan: e.target.value,
                                                })
                                            }
                                            className="mt-1 accent-blue-600 cursor-pointer h-4 w-4"
                                        />

                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                Chuyển khoản ngân hàng thủ công
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Chuyển khoản thủ công qua số tài khoản ngân hàng và chờ nhân viên xác nhận.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {errorMessage && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                                    {errorMessage}
                                </div>
                            )}
                        </div>

                        {/* Tom tat don hang */}
                        <aside className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:sticky lg:top-8">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Đơn hàng của bạn
                            </h2>

                            <div className="mt-5 space-y-4">
                                {selectedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="relative h-16 w-16 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-full w-full object-contain"
                                            />

                                            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-700 px-1 text-xs font-bold text-white">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-5 text-sm">
                                <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
                                    <span>Tạm tính</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>

                                <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                                </div>

                                <div className="flex justify-between gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        Tổng thanh toán
                                    </span>
                                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                                        {formatCurrency(grandTotal)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !selectedItems.length}
                                className={`mt-6 w-full rounded-xl px-5 py-4 font-bold text-white transition flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${
                                    customer.phuong_thuc_thanh_toan === "vnpay"
                                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                }`}
                            >
                                {processing ? (
                                    <span>Đang xử lý đơn hàng...</span>
                                ) : customer.phuong_thuc_thanh_toan === "vnpay" ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                                        <span>Thanh toán ngay bằng VNPAY-QR ➔</span>
                                    </>
                                ) : customer.phuong_thuc_thanh_toan === "cod" ? (
                                    <span>Xác nhận đặt hàng (COD)</span>
                                ) : (
                                    <span>Xác nhận đặt hàng (Chuyển khoản)</span>
                                )}
                            </button>

                            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                {customer.phuong_thuc_thanh_toan === "vnpay"
                                    ? "⚡ Nhấn để mở Cổng VNPAY và quét mã QR bằng App Ngân hàng."
                                    : "Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng."}
                            </p>
                        </aside>
                    </form>
                </div>
            </main>
        );
    }


    return (

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* =========================================================
                1. BREADCRUMBS
            ========================================================= */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">

                {/* Thong bao trang thai */}
                {loading && (
                    <p className="py-4 text-center text-sm text-slate-500">
                        Đang tải giỏ hàng...
                    </p>
                )}

                {errorMessage && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                )}

                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Trang chủ
                </Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                    Giỏ hàng
                </span>
            </nav>

            {/* =========================================================
                2. TIÊU ĐỀ TRANG
            ========================================================= */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <span>Giỏ hàng</span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                            {cartItems.length} sản phẩm
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kiểm tra danh sách sản phẩm, số lượng và tổng thanh toán của bạn
                    </p>
                </div>

                {cartItems.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                        Xóa toàn bộ giỏ hàng
                    </button>
                )}

            </div>

            {/* =========================================================
                3. NỘI DUNG TĨNH CỦA GIỎ HÀNG
            ========================================================= */}
            {loading ? (
                <p className="py-10 text-center text-slate-500">
                    Đang tải dữ liệu...
                </p>
            ) : cartItems.length === 0 ? (
                /* Giao diện khi giỏ hàng trống */
                <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Giỏ hàng của bạn đang trống!
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Hãy tiếp tục khám phá các thiết bị công nghệ chính hãng với giá ưu đãi hôm nay!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
                        >
                            Khám phá sản phẩm
                        </Link>

                    </div>
                </div>
            ) : (
                /* Bảng giỏ hàng tĩnh hiển thị ngay lập tức */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Cột trái: Danh sách sản phẩm (8 cột) */}
                    <div className="lg:col-span-8 space-y-5">

                        {/* Banner Miễn phí vận chuyển */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                <span className="text-base">🚀</span>
                                <span>
                                    Đơn hàng của bạn đã đủ điều kiện <strong>Miễn phí vận chuyển toàn quốc</strong>!
                                </span>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Đạt 100%
                            </span>
                        </div>

                        {/* Thẻ bảng sản phẩm */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">

                            {/* Tiêu đề bảng */}
                            <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 items-center">
                                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={handleToggleSelectAll}
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        title="Chọn tất cả"
                                    />
                                    <span>Sản phẩm ({cartItems.length})</span>
                                </div>
                                <div className="hidden sm:block sm:col-span-2 text-center">Đơn giá</div>
                                <div className="hidden sm:block sm:col-span-2 text-center">Số lượng</div>
                                <div className="hidden sm:block sm:col-span-2 text-right">Tổng phụ</div>
                            </div>

                            {/* Danh sách từng món */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {cartItems.map((item) => {
                                    const itemTotal = item.price * item.quantity;

                                    return (
                                        <div
                                            key={item.id}
                                            className={`py-4 transition-colors rounded-2xl ${item.selected ? "bg-transparent" : "opacity-50"
                                                }`}
                                        >
                                            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">

                                                {/* Cột sản phẩm */}
                                                <div className="col-span-12 sm:col-span-6 flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!item.selected}
                                                        onChange={() => handleToggleSelect(item.id)}
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    />

                                                    {/* Ảnh sản phẩm */}
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 p-1.5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                    {/* Tên & danh mục */}
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                            {item.category}
                                                        </span>
                                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                                                            {item.name}
                                                        </h3>

                                                        {/* Đơn giá mobile */}
                                                        <div className="sm:hidden flex items-center gap-2 pt-0.5">
                                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                                {formatCurrency(item.price)}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 line-through">
                                                                {formatCurrency(item.originalPrice)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Đơn giá desktop */}
                                                <div className="hidden sm:block sm:col-span-2 text-center">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(item.price)}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 line-through">
                                                        {formatCurrency(item.originalPrice)}
                                                    </div>
                                                </div>

                                                {/* Bộ số lượng */}
                                                <div className="col-span-6 sm:col-span-2 flex items-center justify-start sm:justify-center gap-1.5">
                                                    <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-xs font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(item.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tổng tiền món */}
                                                <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-3 text-right">
                                                    <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(itemTotal)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Thanh điều hướng */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:gap-3 transition-all"
                            >
                                ← Tiếp tục mua sắm các thiết bị khác
                            </Link>

                            <span className="text-xs text-slate-400">
                                Đã chọn: <strong className="text-slate-900 dark:text-white">{totalSelectedQty}</strong> sản phẩm
                            </span>
                        </div>

                        {/* Huy hiệu chính sách */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-emerald-500 text-lg">🛡️</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Chính Hãng 100%</h4>
                                    <p className="text-[11px] text-slate-400">Bảo hành 12 tháng</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-blue-500 text-lg">⚡</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Giao Hàng Siêu Tốc</h4>
                                    <p className="text-[11px] text-slate-400">Nhận trong 24h - 48h</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
                                <span className="text-purple-500 text-lg">↺</span>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Đổi Trả 15 Ngày</h4>
                                    <p className="text-[11px] text-slate-400">Miễn phí đổi mới</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng tĩnh (4 cột) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 sticky top-28">

                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span>Tóm tắt đơn hàng</span>
                                <span className="text-xs font-normal text-slate-400">
                                    {selectedItems.length} mục chọn
                                </span>
                            </h3>

                            {/* Bảng chi tiết giá tiền */}
                            <div className="space-y-3 text-xs sm:text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Tạm tính ({totalSelectedQty} món)</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>



                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-emerald-500 font-bold uppercase text-xs">
                                        Miễn phí
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                        Tổng thanh toán
                                    </span>
                                    <div className="text-right">
                                        <div className="font-black text-xl sm:text-2xl text-blue-600 dark:text-blue-400">
                                            {formatCurrency(grandTotal)}
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            (Đã bao gồm VAT)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ô Voucher tĩnh */}


                            {/* Nút Thanh toán tĩnh */}

                            <button
                                type="button"
                                disabled={processing || selectedItems.length === 0}
                                onClick={() => {
                                    setErrorMessage("");

                                    // Kiem tra dang nhap truoc khi thanh toan
                                    const token =
                                        localStorage.getItem("token") ||
                                        localStorage.getItem("access_token");

                                    if (!token) {
                                        router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
                                        return;
                                    }

                                    setShowCheckout(true);
                                }}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-center shadow-xl shadow-blue-500/25 transition-all text-sm"
                            >
                                Tiến hành thanh toán ({formatCurrency(grandTotal)}) →
                            </button>


                            {showCheckout && (
                                <form
                                    onSubmit={handleCheckout}
                                    className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6"
                                >
                                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                                        Thông tin nhận hàng
                                    </h3>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Họ và tên người nhận"
                                            value={customer.ten_nguoi_nhan}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    ten_nguoi_nhan: e.target.value,
                                                })
                                            }
                                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            required
                                        />

                                        <input
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            value={customer.so_dien_thoai}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    so_dien_thoai: e.target.value,
                                                })
                                            }
                                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            required
                                        />

                                        <textarea
                                            placeholder="Địa chỉ nhận hàng"
                                            value={customer.dia_chi}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    dia_chi: e.target.value,
                                                })
                                            }
                                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            rows={3}
                                            required
                                        />

                                        <select
                                            value={customer.phuong_thuc_thanh_toan}
                                            onChange={(e) =>
                                                setCustomer({
                                                    ...customer,
                                                    phuong_thuc_thanh_toan: e.target.value,
                                                })
                                            }
                                            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        >
                                            <option value="vnpay">
                                                ★ Chuyển khoản qua VNPAY / Quét mã QR
                                            </option>
                                            <option value="cod">
                                                Thanh toán khi nhận hàng (COD)
                                            </option>
                                            <option value="bank_transfer">
                                                Chuyển khoản ngân hàng thủ công
                                            </option>
                                        </select>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full rounded-xl disabled:opacity-50 text-white font-bold py-3 transition ${
                                                customer.phuong_thuc_thanh_toan === "vnpay"
                                                    ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30"
                                                    : "bg-emerald-600 hover:bg-emerald-700"
                                            }`}
                                        >
                                            {processing
                                                ? "Đang xử lý..."
                                                : customer.phuong_thuc_thanh_toan === "vnpay"
                                                ? "Thanh toán ngay bằng VNPAY-QR ➔"
                                                : "Xác nhận đặt hàng"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => setShowCheckout(false)}
                                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300"
                                        >
                                            Quay lại giỏ hàng
                                        </button>
                                    </div>
                                </form>
                            )}


                            {/* Bảo mật */}
                            <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    Bảo mật giao dịch chuẩn mã hóa SSL 256-bit
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </main>
    );
}