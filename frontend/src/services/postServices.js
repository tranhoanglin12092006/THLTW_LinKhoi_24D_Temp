import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * POST SERVICES (Dịch vụ gọi API Quản lý Bài viết qua axiosClient)
 * Bám theo chuẩn hệ thống: phân trang 10/trang, lọc, tìm kiếm, CRUD, xóa mềm & khôi phục
 * =========================================================================
 */

// 1. Lấy danh sách bài viết (phân trang, tìm kiếm, lọc theo danh mục & trạng thái, thùng rác)
export async function getPosts(page = 1, perPage = 10, search = "", categoryId = "", status = "", trashed = false) {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;
        if (categoryId && categoryId !== "all") params.category_id = categoryId;
        if (status !== "" && status !== "all") params.status = status;
        if (trashed) params.trashed = 1;

        const res = await axiosClient.get("/posts", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách bài viết:", error);
        throw error;
    }
}

// 1.1 Lấy danh sách bài viết trong thùng rác
export async function getTrashPosts(page = 1, perPage = 10, search = "") {
    try {
        const params = { page, per_page: perPage };
        if (search) params.search = search;

        const res = await axiosClient.get("/posts/trash", { params });
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách bài viết trong thùng rác:", error);
        throw error;
    }
}

// 2. Lấy danh mục bài viết cho dropdown
export async function getPostCategories() {
    try {
        const res = await axiosClient.get("/post-categories");
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy danh mục bài viết:", error);
        throw error;
    }
}

// 3. Lấy chi tiết bài viết theo ID
export async function getPostById(id) {
    try {
        const res = await axiosClient.get(`/posts/${id}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error(`Lỗi lấy chi tiết bài viết ID ${id}:`, error);
        throw error;
    }
}

// 4. Thêm bài viết mới
export async function createPost(data) {
    try {
        const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
        const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
        const res = await axiosClient.post("/posts", data, config);
        return res;
    } catch (error) {
        console.error("Lỗi thêm bài viết mới:", error);
        throw error;
    }
}

// 5. Cập nhật bài viết
export async function updatePost(id, data) {
    try {
        const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
        if (isFormData) {
            // Khi gửi FormData có file ảnh, gửi bằng POST để Laravel parse multipart đầy đủ
            const res = await axiosClient.post(`/posts/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res;
        } else {
            const res = await axiosClient.put(`/posts/${id}`, data);
            return res;
        }
    } catch (error) {
        console.error(`Lỗi cập nhật bài viết ID ${id}:`, error);
        throw error;
    }
}

// 6. Xóa mềm bài viết
export async function deletePost(id) {
    try {
        const res = await axiosClient.delete(`/posts/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa mềm bài viết ID ${id}:`, error);
        throw error;
    }
}

// 7. Khôi phục bài viết từ thùng rác
export async function restorePost(id) {
    try {
        const res = await axiosClient.put(`/posts/${id}/restore`);
        return res;
    } catch (error) {
        console.error(`Lỗi khôi phục bài viết ID ${id}:`, error);
        throw error;
    }
}

// 8. Xóa vĩnh viễn bài viết
export async function forceDeletePost(id) {
    try {
        const res = await axiosClient.delete(`/posts/${id}/force`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa vĩnh viễn bài viết ID ${id}:`, error);
        throw error;
    }
}
