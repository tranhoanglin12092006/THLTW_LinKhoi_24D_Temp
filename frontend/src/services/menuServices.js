import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * MENU SERVICES (Dịch vụ gọi API Menu qua axiosClient)
 * Viết tương tự productServices.js
 * =========================================================================
 */


// 1. Lay danh sach menu
export async function getAllMenus() {
    try {
        console.log("===== BAT DAU GOI API MENU =====");
        console.log("API BASE URL:", axiosClient.defaults.baseURL);
        console.log("API ENDPOINT:", `${axiosClient.defaults.baseURL}/menus`);

        const res = await axiosClient.get("/menus");

        console.log("MENU API THANH CONG:", res);

        return res?.data ?? res ?? [];
    } catch (error) {
        console.error("===== LOI LAY DANH SACH MENU =====");
        console.error("URL:", error.config?.baseURL, error.config?.url);
        console.error("STATUS:", error.response?.status);
        console.error("PHAN HOI BACKEND:", error.response?.data);
        console.error("THONG BAO LOI:", error.message);

        return [];
    }
}


// 2. Lấy danh sách menu đã xóa mềm
export async function getDeletedMenus() {
    try {
        const res = await axiosClient.get("/menus/trash");
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy danh sách menu trong thùng rác:", error);
        return [];
    }
}

// 3. Lấy chi tiết menu theo ID
export async function getMenuDetail(id) {
    try {
        const res = await axiosClient.get(`/menus/${id}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết menu ID ${id}:`, error);
        return null;
    }
}

// 4. Thêm menu mới
export async function createMenu(data) {
    try {
        const res = await axiosClient.post("/menus", data);
        return res;
    } catch (error) {
        console.error("Lỗi thêm menu:", error);
        throw error;
    }
}

// 5. Cập nhật menu
export async function updateMenu(id, data) {
    try {
        const res = await axiosClient.put(`/menus/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật menu ID ${id}:`, error);
        throw error;
    }
}

// 6. Xóa mềm menu
export async function deleteMenu(id) {
    try {
        const res = await axiosClient.delete(`/menus/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa menu ID ${id}:`, error);
        throw error;
    }
}

// 7. Khôi phục menu đã xóa mềm
export async function restoreMenu(id) {
    try {
        const res = await axiosClient.post(`/menus/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục menu ID ${id}:`, error);
        throw error;
    }
}

// 8. Xóa vĩnh viễn menu đã xóa mềm
export async function forceDeleteMenu(id) {
    try {
        const res = await axiosClient.delete(`/menus/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn menu ID ${id}:`, error);
        throw error;
    }
}
