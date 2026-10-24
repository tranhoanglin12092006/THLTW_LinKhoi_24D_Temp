
import axiosClient from "@/lib/axiosClient";

// Lay danh sach gio hang
export async function getAllCarts() {
    return axiosClient.get("/carts");
}

// Lay thong tin mot gio hang
export async function getCartById(id) {
    return axiosClient.get(`/carts/${id}`);
}

// Lay hoac tao gio hang cho khach vang lai
export async function getOrCreateGuestCart(sessionId) {
    return axiosClient.post("/carts/guest", {
        session_id: sessionId,
    });
}

// Tao gio hang moi
export async function createCart(data) {
    return axiosClient.post("/carts", data);
}

// Cap nhat gio hang
export async function updateCart(id, data) {
    return axiosClient.put(`/carts/${id}`, data);
}

// Xoa gio hang
export async function deleteCart(id) {
    return axiosClient.delete(`/carts/${id}`);
}

// Them san pham vao gio hang
export async function addCartItem(data) {
    return axiosClient.post("/cart-items", data);
}

// Cap nhat so luong san pham trong gio hang
export async function updateCartItem(id, data) {
    return axiosClient.put(`/cart-items/${id}`, data);
}

// Xoa san pham khoi gio hang
export async function deleteCartItem(id) {
    return axiosClient.delete(`/cart-items/${id}`);
}
