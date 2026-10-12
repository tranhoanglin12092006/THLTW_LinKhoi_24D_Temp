import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * PAGE SERVICES (Dịch vụ gọi API Quản lý Trang đơn qua axiosClient)
 * Bám theo chuẩn hệ thống: phân trang, tìm kiếm, lọc, CRUD, xóa mềm & khôi phục
 * =========================================================================
 */

// 1. Lấy danh sách trang đơn (hỗ trợ phân trang, tìm kiếm, lọc trạng thái, thùng rác)
export async function getPages(page = 1, perPage = 10, search = "", status = "", trashed = false) {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (status !== "" && status !== "all") params.status = status;
        if (trashed) params.trashed = 1;

        const res = await axiosClient.get("/pages", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách trang đơn:", error);
        throw error;
    }
}

// 1.1 Lấy danh sách trang đơn trong thùng rác
export async function getTrashPages(page = 1, perPage = 10, search = "") {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;

        const res = await axiosClient.get("/pages/trash", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách trang đơn trong thùng rác:", error);
        throw error;
    }
}

// 2. Lấy chi tiết trang đơn theo ID hoặc Slug
export async function getPageById(idOrSlug) {
    try {
        const res = await axiosClient.get(`/pages/${idOrSlug}`);
        return res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết trang đơn ${idOrSlug}:`, error);
        throw error;
    }
}

// 3. Tạo mới trang đơn
export async function createPage(data) {
    try {
        const res = await axiosClient.post("/pages", data);
        return res;
    } catch (error) {
        console.error("Lỗi tạo mới trang đơn:", error);
        throw error;
    }
}

// 4. Cập nhật trang đơn
export async function updatePage(id, data) {
    try {
        const res = await axiosClient.put(`/pages/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật trang đơn ID ${id}:`, error);
        throw error;
    }
}

// 5. Xóa mềm trang đơn (chuyển vào thùng rác)
export async function deletePage(id) {
    try {
        const res = await axiosClient.delete(`/pages/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi chuyển trang đơn ID ${id} vào thùng rác:`, error);
        throw error;
    }
}

// 6. Khôi phục trang đơn từ thùng rác
export async function restorePage(id) {
    try {
        const res = await axiosClient.post(`/pages/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục trang đơn ID ${id}:`, error);
        throw error;
    }
}

// 7. Xóa vĩnh viễn trang đơn
export async function forceDeletePage(id) {
    try {
        const res = await axiosClient.delete(`/pages/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn trang đơn ID ${id}:`, error);
        throw error;
    }
}
