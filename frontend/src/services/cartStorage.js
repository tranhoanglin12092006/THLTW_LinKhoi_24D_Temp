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

// Lấy danh sách sản phẩm trong giỏ hàng hiện tại
export function getLocalCart() {
    if (typeof window === "undefined") return [];
    try {
        const key = getCartStorageKey();
        const data = localStorage.getItem(key);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
    }
    return [];
}

// Lưu danh sách sản phẩm vào giỏ hàng
export function saveLocalCart(cartItems) {
    if (typeof window === "undefined") return;
    try {
        const key = getCartStorageKey();
        localStorage.setItem(key, JSON.stringify(cartItems || []));
        // Phát sự kiện cập nhật để Header và các component cập nhật số lượng
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("cart:updated"));
    } catch (e) {
        console.error("Lỗi lưu giỏ hàng vào localStorage:", e);
    }
}

// Thêm sản phẩm vào giỏ hàng
export function addToLocalCart(product, quantity = 1) {
    if (!product) return [];
    const cart = getLocalCart();
    const productId = product.id;
    const existingIndex = cart.findIndex((item) => String(item.id || item.productId) === String(productId));

    const price = Number(product.price ?? product.gia ?? 0);
    const originalPrice = Number(product.originalPrice ?? product.price ?? product.gia ?? 0);
    const name = product.name || product.ten || product.product_name || "Sản phẩm";
    const slug = product.slug || product.duong_dan || String(productId);
    const imageUrl = product.imageUrl || product.image || product.hinh_anh_url || product.hinh_anh || "/images/no-image.png";

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (Number(cart[existingIndex].quantity) || 1) + Number(quantity);
    } else {
        cart.push({
            id: productId,
            productId: productId,
            name,
            slug,
            price,
            originalPrice,
            imageUrl,
            quantity: Number(quantity) || 1,
            selected: true,
        });
    }

    saveLocalCart(cart);
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
        saveLocalCart(cart);
    }
    return cart;
}

// Xóa 1 sản phẩm khỏi giỏ hàng
export function removeLocalCartItem(productId) {
    const cart = getLocalCart();
    const updated = cart.filter((item) => String(item.id || item.productId) !== String(productId));
    saveLocalCart(updated);
    return updated;
}

// Xóa toàn bộ giỏ hàng
export function clearLocalCart() {
    saveLocalCart([]);
    return [];
}

// Đếm tổng số lượng sản phẩm trong giỏ hàng
export function getLocalCartCount() {
    const cart = getLocalCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}
