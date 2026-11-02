import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * CONTACT SERVICES (Dịch vụ gọi API Quản lý Liên hệ & Góp ý qua axiosClient)
 * Hỗ trợ: Gửi liên hệ từ client, xem danh sách, lọc trạng thái, xem chi tiết,
 * phản hồi/ghi nhận xử lý, xóa liên hệ đã xử lý.
 * =========================================================================
 */

// 1. Lấy danh sách liên hệ (dành cho Admin: lọc theo trạng thái, tìm kiếm, phân trang)
export async function getContacts(page = 1, perPage = 10, search = "", status = "") {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (status && status !== "all") params.status = status;

        const res = await axiosClient.get("/contacts", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách liên hệ:", error);
        throw error;
    }
}

// 2. Lấy chi tiết liên hệ theo ID
export async function getContactById(id) {
    try {
        const res = await axiosClient.get(`/contacts/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết liên hệ ID ${id}:`, error);
        throw error;
    }
}

// 3. Khách hàng gửi góp ý / yêu cầu hỗ trợ mới (Client)
export async function sendContact(data) {
    try {
        const res = await axiosClient.post("/contacts", data);
        return res;
    } catch (error) {
        console.error("Lỗi gửi yêu cầu liên hệ:", error);
        throw error;
    }
}

// 4. Phản hồi và ghi nhận xử lý liên hệ (Admin)
export async function replyContact(id, data) {
    try {
        const res = await axiosClient.put(`/contacts/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi phản hồi liên hệ ID ${id}:`, error);
        throw error;
    }
}

// 5. Xóa liên hệ (chỉ được xóa khi trạng thái đã xử lý)
export async function deleteContact(id) {
    try {
        const res = await axiosClient.delete(`/contacts/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa liên hệ ID ${id}:`, error);
        throw error;
    }
}

// 6. Xóa hàng loạt liên hệ đã xử lý (Admin)
export async function bulkDeleteContacts(ids) {
    try {
        const res = await axiosClient.post("/contacts/bulk-delete", { ids });
        return res;
    } catch (error) {
        console.error("Lỗi xóa hàng loạt liên hệ:", error);
        throw error;
    }
}
