import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * CATEGORY SERVICES (Dịch vụ gọi API Danh mục qua axiosClient)
 * Bám theo cấu trúc tranhoanglin-frontend
 * =========================================================================
 */

// 1. Lấy danh sách danh mục có phân trang (mặc định 10 danh mục / trang, hỗ trợ lọc thùng rác)
export async function getCategories(page = 1, perPage = 10, search = "", trashed = false) {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (trashed) params.trashed = 1;

        // Gọi API: GET /api/categories?page=1&per_page=10
        const res = await axiosClient.get("/categories", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách danh mục:", error);
        throw error;
    }
}

// 2. Lấy tất cả danh mục (dùng cho dropdown chọn danh mục cha)
export async function getAllCategories() {
    try {
        const res = await axiosClient.get("/categories", {
            params: { per_page: 100 }
        });
        return res.data ? res.data : (Array.isArray(res) ? res : []);
    } catch (error) {
        console.error("Lỗi lấy tất cả danh mục:", error);
        return [];
    }
}

// 3. Lấy thông tin chi tiết một danh mục theo ID
export async function getCategoryById(id) {
    try {
        const res = await axiosClient.get(`/categories/${id}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy danh mục ID ${id}:`, error);
        throw error;
    }
}

// 4. Thêm danh mục mới (POST /api/categories)
export async function createCategory(data) {
    try {
        const res = await axiosClient.post("/categories", data);
        return res;
    } catch (error) {
        console.error("Lỗi thêm danh mục:", error);
        throw error;
    }
}

// 5. Cập nhật danh mục (PUT /api/categories/{id})
export async function updateCategory(id, data) {
    try {
        const res = await axiosClient.put(`/categories/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật danh mục ID ${id}:`, error);
        throw error;
    }
}

// 6. Xóa mềm danh mục (DELETE /api/categories/{id})
export async function deleteCategory(id) {
    try {
        const res = await axiosClient.delete(`/categories/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa danh mục ID ${id}:`, error);
        throw error;
    }
}

// 7. Khôi phục danh mục đã xóa mềm (PUT /api/categories/{id}/restore)
export async function restoreCategory(id) {
    try {
        const res = await axiosClient.put(`/categories/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục danh mục ID ${id}:`, error);
        throw error;
    }
}

// 8. Xóa vĩnh viễn danh mục (DELETE /api/categories/{id}/force)
export async function forceDeleteCategory(id) {
    try {
        const res = await axiosClient.delete(`/categories/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn danh mục ID ${id}:`, error);
        throw error;
    }
}
