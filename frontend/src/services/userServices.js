import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * USER SERVICES (Dịch vụ gọi API Quản lý Người dùng qua axiosClient)
 * Bám theo cấu trúc tranhoanglin-frontend
 * =========================================================================
 */

// 1. Lấy danh sách người dùng (hỗ trợ phân trang, tìm kiếm, lọc theo vai trò & trạng thái, thùng rác)
export async function getUsers(page = 1, perPage = 10, search = "", role = "", status = "", trashed = false) {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (role && role !== "all") params.role = role;
        if (status !== "" && status !== "all") params.status = status;
        if (trashed) params.trashed = 1;

        // Gọi API: GET /api/users
        const res = await axiosClient.get("/users", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng:", error);
        throw error;
    }
}

// 1.1 Lấy danh sách người dùng trong thùng rác
export async function getTrashUsers(page = 1, perPage = 10, search = "") {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;

        // Gọi API: GET /api/users/trash
        const res = await axiosClient.get("/users/trash", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng trong thùng rác:", error);
        throw error;
    }
}

// 2. Lấy thông tin chi tiết một người dùng theo ID
export async function getUserById(id) {
    try {
        const res = await axiosClient.get(`/users/${id}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy thông tin người dùng ID ${id}:`, error);
        throw error;
    }
}

// 3. Thêm tài khoản người dùng mới (POST /api/users)
export async function createUser(data) {
    try {
        const res = await axiosClient.post("/users", data);
        return res;
    } catch (error) {
        console.error("Lỗi thêm người dùng mới:", error);
        throw error;
    }
}

// 4. Cập nhật thông tin người dùng (PUT /api/users/{id})
export async function updateUser(id, data) {
    try {
        const res = await axiosClient.put(`/users/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật người dùng ID ${id}:`, error);
        throw error;
    }
}

// 5. Khóa hoặc mở khóa tài khoản (PUT /api/users/{id}/toggle-lock)
export async function toggleLockUser(id) {
    try {
        const res = await axiosClient.put(`/users/${id}/toggle-lock`);
        return res;
    } catch (error) {
        console.error(`Lỗi chuyển đổi trạng thái khóa ID ${id}:`, error);
        throw error;
    }
}

// 6. Thay đổi vai trò người dùng (PUT /api/users/{id}/change-role)
export async function changeUserRole(id, role) {
    try {
        const res = await axiosClient.put(`/users/${id}/change-role`, { vai_tro: role });
        return res;
    } catch (error) {
        console.error(`Lỗi thay đổi vai trò ID ${id}:`, error);
        throw error;
    }
}

// 7. Xóa mềm người dùng (DELETE /api/users/{id})
export async function deleteUser(id) {
    try {
        const res = await axiosClient.delete(`/users/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa mềm người dùng ID ${id}:`, error);
        throw error;
    }
}

// 8. Khôi phục người dùng từ thùng rác (PUT /api/users/{id}/restore)
export async function restoreUser(id) {
    try {
        const res = await axiosClient.put(`/users/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục người dùng ID ${id}:`, error);
        throw error;
    }
}

// 9. Xóa vĩnh viễn người dùng khỏi CSDL (DELETE /api/users/{id}/force)
export async function forceDeleteUser(id) {
    try {
        const res = await axiosClient.delete(`/users/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn người dùng ID ${id}:`, error);
        throw error;
    }
}

// 10. Đăng ký tài khoản người dùng mới (POST /api/register)
export async function registerUser(data) {
    try {
        const res = await axiosClient.post("/register", data);
        return res;
    } catch (error) {
        console.error("Lỗi đăng ký tài khoản:", error);
        throw error;
    }
}

// 11. Đăng nhập tài khoản (POST /api/login)
export async function loginUser(data) {
    try {
        const res = await axiosClient.post("/login", data);
        return res;
    } catch (error) {
        console.error("Lỗi đăng nhập tài khoản:", error);
        throw error;
    }
}
