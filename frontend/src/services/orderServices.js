import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * ORDER SERVICES (Dịch vụ gọi API Đơn hàng qua axiosClient)
 * =========================================================================
 */

// 1. Lấy tất cả đơn hàng
export async function getAllOrders() {
    try {
        const res = await axiosClient.get("/orders");

        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
        return [];
    }
}

// 2. Lấy thông tin chi tiết một đơn hàng
export async function getOrderDetail(id) {
    try {
        const res = await axiosClient.get(`/orders/${id}`);

        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết đơn hàng ID ${id}:`, error);
        return null;
    }
}

// 3. Thêm đơn hàng mới
export async function createOrder(data) {
    try {
        const res = await axiosClient.post("/orders", data);

        return res;
    } catch (error) {
        console.error("Lỗi thêm đơn hàng:", error);
        throw error;
    }
}

// 4. Cập nhật đơn hàng
export async function updateOrder(id, data) {
    try {
        const res = await axiosClient.put(`/orders/${id}`, data);

        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật đơn hàng ID ${id}:`, error);
        throw error;
    }
}

// 5. Xóa đơn hàng
export async function deleteOrder(id) {
    try {
        const res = await axiosClient.delete(`/orders/${id}`);

        return res;
    } catch (error) {
        console.error(`Lỗi xóa đơn hàng ID ${id}:`, error);
        throw error;
    }
}

// 6. Cập nhật trạng thái đơn hàng
export async function updateOrderStatus(id, trangThai) {
    try {
        const res = await axiosClient.patch(
            `/orders/${id}/status`,
            {
                trang_thai: trangThai,
            }
        );

        return res;
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
        throw error;
    }
}
