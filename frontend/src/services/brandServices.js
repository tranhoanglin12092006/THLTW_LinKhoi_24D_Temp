import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * BRAND SERVICES (Dịch vụ gọi API Thương hiệu qua axiosClient)
 * Bám theo cấu trúc tranhoanglin-frontend
 * =========================================================================
 */

// 1. Lấy danh sách thương hiệu có phân trang (mặc định 10 thương hiệu / trang, hỗ trợ lọc thùng rác)
export async function getBrands(page = 1, perPage = 10, search = "", trashed = false) {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (trashed) params.trashed = 1;

        // Gọi API: GET /api/brands?page=1&per_page=10
        const res = await axiosClient.get("/brands", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách thương hiệu:", error);
        throw error;
    }
}

// 2. Lấy tất cả thương hiệu
export async function getAllBrands() {
    try {
        const res = await axiosClient.get("/brands", {
            params: { per_page: 100 }
        });
        return res.data ? res.data : (Array.isArray(res) ? res : []);
    } catch (error) {
        console.error("Lỗi lấy tất cả thương hiệu:", error);
        return [];
    }
}

// 3. Lấy thông tin chi tiết một thương hiệu theo ID
export async function getBrandById(id) {
    try {
        const res = await axiosClient.get(`/brands/${id}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy thương hiệu ID ${id}:`, error);
        throw error;
    }
}

// 4. Thêm thương hiệu mới (POST /api/brands)
export async function createBrand(data) {
    try {
        const res = await axiosClient.post("/brands", data);
        return res;
    } catch (error) {
        console.error("Lỗi thêm thương hiệu:", error);
        throw error;
    }
}

// 5. Cập nhật thương hiệu (PUT /api/brands/{id})
export async function updateBrand(id, data) {
    try {
        const res = await axiosClient.put(`/brands/${id}`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật thương hiệu ID ${id}:`, error);
        throw error;
    }
}

// 6. Xóa mềm thương hiệu (DELETE /api/brands/{id})
export async function deleteBrand(id) {
    try {
        const res = await axiosClient.delete(`/brands/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa thương hiệu ID ${id}:`, error);
        throw error;
    }
}

// 7. Khôi phục thương hiệu đã xóa mềm (PUT /api/brands/{id}/restore)
export async function restoreBrand(id) {
    try {
        const res = await axiosClient.put(`/brands/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục thương hiệu ID ${id}:`, error);
        throw error;
    }
}

// 8. Xóa vĩnh viễn thương hiệu (DELETE /api/brands/{id}/force)
export async function forceDeleteBrand(id) {
    try {
        const res = await axiosClient.delete(`/brands/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn thương hiệu ID ${id}:`, error);
        throw error;
    }
}
