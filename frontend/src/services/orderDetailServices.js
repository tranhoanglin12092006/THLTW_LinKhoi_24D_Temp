import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * ORDER DETAIL SERVICES (Dịch vụ gọi API Chi tiết đơn hàng)
 * =========================================================================
 */

// 1. Lấy tất cả chi tiết đơn hàng
export async function getAllOrderDetails() {
    try {
        const res = await axiosClient.get("/order-details");

        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy danh sách chi tiết đơn hàng:", error);
        return [];
    }
}

// 2. Lấy chi tiết một sản phẩm trong đơn hàng
export async function getOrderDetailById(id) {
    try {
        const res = await axiosClient.get(`/order-details/${id}`);

        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết đơn hàng ID ${id}:`, error);
        return null;
    }
}

// 3. Thêm sản phẩm vào đơn hàng
export async function createOrderDetail(data) {
    try {
        const res = await axiosClient.post("/order-details", data);

        return res;
    } catch (error) {
        console.error("Lỗi thêm sản phẩm vào đơn hàng:", error);
        throw error;
    }
}

// 4. Cập nhật số lượng sản phẩm trong đơn hàng
export async function updateOrderDetail(id, data) {
    try {
        const res = await axiosClient.put(`/order-details/${id}`, data);

        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật chi tiết đơn hàng ID ${id}:`, error);
        throw error;
    }
}

// 5. Xóa sản phẩm khỏi đơn hàng
export async function deleteOrderDetail(id) {
    try {
        const res = await axiosClient.delete(`/order-details/${id}`);

        return res;
    } catch (error) {
        console.error(`Lỗi xóa chi tiết đơn hàng ID ${id}:`, error);
        throw error;
    }
}