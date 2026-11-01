/**
 * QUẢN LÝ GIỎ HÀNG BẰNG LOCALSTORAGE THEO TÀI KHOẢN NGƯỜI DÙNG
 * - Mỗi người dùng có một giỏ hàng riêng biệt theo user id/email.
 * - Khi chưa đăng nhập, dùng giỏ hàng guest.
 * - Khi đăng nhập/đăng xuất, giỏ hàng được bảo lưu an toàn trong localStorage và không bị mất.
 */

// Lấy key lưu trữ giỏ hàng hiện tại dựa trên trạng thái đăng nhập
export function getCartStorageKey() {
    if (typeof window === "undefined") return "technova_cart_guest";
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            const userKey = user.id || user.email || "user";
            return `technova_cart_user_${userKey}`;
        }
    } catch (e) {
        // Fallback
    }
    return "technova_cart_guest";
}

// Kiểm tra người dùng đã đăng nhập chưa
export function isUserLoggedIn() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    return Boolean(token && userStr);
}

import { resolveProductImage, isFallbackImage } from "@/utils/productImage";

// Lấy danh sách sản phẩm trong giỏ hàng hiện tại
export function getLocalCart() {
    if (typeof window === "undefined") return [];
    try {
        const key = getCartStorageKey();
        const data = localStorage.getItem(key);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                // Tự động chuẩn hóa đường dẫn ảnh cho mọi sản phẩm đã lưu
                return parsed.map((item) => {
                    const candidate = (!isFallbackImage(item.imageUrl) ? item.imageUrl : null) ||
                        item.image ||
                        item.hinh_anh_url ||
                        item.hinh_anh ||
                        item.imageUrl;

                    const finalImg = resolveProductImage(candidate);
                    return {
                        ...item,
                        imageUrl: finalImg,
                        image: finalImg,
                    };
                });
            }
        }
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
    }
    return [];
}

// Lưu danh sách sản phẩm vào giỏ hàng và phát sự kiện
export function saveLocalCart(cartItems, meta = null) {
    if (typeof window === "undefined") return;
    try {
        const key = getCartStorageKey();
        localStorage.setItem(key, JSON.stringify(cartItems || []));

        // Phát sự kiện cập nhật để Header và các component cập nhật số lượng và danh sách
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: cartItems, meta } }));
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: cartItems, meta } }));
    } catch (e) {
        console.error("Lỗi lưu giỏ hàng vào localStorage:", e);
    }
}

// Thêm sản phẩm vào giỏ hàng
export function addToLocalCart(product, quantity = 1) {
    if (!product) return [];
    const cart = getLocalCart();
    const productId = product.id ?? product.productId;
    const existingIndex = cart.findIndex((item) => String(item.id || item.productId) === String(productId));

    const price = Number(product.price ?? product.gia ?? 0);
    const originalPrice = Number(product.originalPrice ?? product.price ?? product.gia ?? 0);
    const name = product.name || product.ten || product.product_name || "Sản phẩm";
    const slug = product.slug || product.duong_dan || String(productId);
    const imageUrl = resolveProductImage(product.imageUrl || product.image || product.hinh_anh_url || product.hinh_anh);

    let affectedItem;
    if (existingIndex > -1) {
        const updatedQty = (Number(cart[existingIndex].quantity) || 1) + Number(quantity);
        cart[existingIndex].quantity = updatedQty;
        // Đảm bảo cập nhật lại thông tin mới nhất nếu có
        cart[existingIndex].price = price;
        cart[existingIndex].name = name;
        if (imageUrl && !isFallbackImage(imageUrl)) {
            cart[existingIndex].imageUrl = imageUrl;
            cart[existingIndex].image = imageUrl;
        } else if (!cart[existingIndex].imageUrl || isFallbackImage(cart[existingIndex].imageUrl)) {
            cart[existingIndex].imageUrl = imageUrl;
            cart[existingIndex].image = imageUrl;
        }
        affectedItem = cart[existingIndex];
    } else {
        affectedItem = {
            id: productId,
            productId: productId,
            name,
            slug,
            price,
            originalPrice,
            imageUrl,
            image: imageUrl,
            hinh_anh_url: imageUrl,
            quantity: Number(quantity) || 1,
            selected: true,
        };
        cart.push(affectedItem);
    }

    saveLocalCart(cart, { action: "add", item: affectedItem, quantity: Number(quantity) || 1 });

    // Phát sự kiện riêng khi thêm sản phẩm thành công để kích hoạt hiệu ứng Header
    try {
        window.dispatchEvent(new CustomEvent("cartItemAdded", {
            detail: { item: affectedItem, quantity: Number(quantity) || 1, totalCount: cart.reduce((s, i) => s + (Number(i.quantity) || 1), 0) }
        }));
    } catch (e) {
        // Fallback
    }

    return cart;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export function updateLocalCartQuantity(productId, delta) {
    const cart = getLocalCart();
    const itemIndex = cart.findIndex((item) => String(item.id || item.productId) === String(productId));
    if (itemIndex > -1) {
        const newQty = (Number(cart[itemIndex].quantity) || 1) + delta;
        if (newQty < 1) return cart;
        cart[itemIndex].quantity = newQty;
        saveLocalCart(cart, { action: "update", item: cart[itemIndex], delta });
    }
    return cart;
}

// Xóa 1 sản phẩm khỏi giỏ hàng
export function removeLocalCartItem(productId) {
    const cart = getLocalCart();
    const removedItem = cart.find((item) => String(item.id || item.productId) === String(productId));
    const updated = cart.filter((item) => String(item.id || item.productId) !== String(productId));
    saveLocalCart(updated, { action: "remove", item: removedItem });
    return updated;
}

// Xóa toàn bộ giỏ hàng
export function clearLocalCart() {
    saveLocalCart([], { action: "clear" });
    return [];
}

// Đếm tổng số lượng sản phẩm trong giỏ hàng
export function getLocalCartCount() {
    const cart = getLocalCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

// Tính tổng giá trị giỏ hàng
export function getLocalCartTotal() {
    const cart = getLocalCart();
    return cart.reduce((sum, item) => sum + (Number(item.price || 0) * (Number(item.quantity) || 1)), 0);
}
