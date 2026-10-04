import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * PRODUCT SERVICES (Dịch vụ gọi API Sản phẩm qua axiosClient)
 * Bám theo cấu trúc của tranhoanglin-frontend, viết ngắn gọn, dễ hiểu
 * =========================================================================
 */

// 1. Lấy tất cả sản phẩm
export async function getAllProducts() {
    try {
        // Lấy tối đa 1000 sản phẩm thay vì chỉ 10
        const res = await axiosClient.get("/products", {
            params: { per_page: 1000 },
        });
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        return [];
    }
}

// 2. Lấy danh sách sản phẩm mới nhất (New Products)
export async function getNewProducts(limit = 4) {
    try {
        const res = await axiosClient.get(`/newProducts/${limit}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy sản phẩm mới:", error);
        return [];
    }
}

// 3. Lấy danh sách sản phẩm đang giảm giá (Sale Products)
export async function getSaleProducts(limit = 4) {
    try {
        const res = await axiosClient.get(`/saleProducts/${limit}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy sản phẩm khuyến mãi:", error);
        return [];
    }
}

// 4. Lấy danh sách sản phẩm nổi bật / bán chạy (Hot Products)
export async function getHotProducts(limit = 4) {
    try {
        const res = await axiosClient.get(`/hotProducts/${limit}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy sản phẩm hot:", error);
        return [];
    }
}

// 5. Lấy thông tin chi tiết một sản phẩm theo ID hoặc Slug
export async function getProductDetail(idOrSlug) {
    try {
        const res = await axiosClient.get(`/products/${idOrSlug}`);
        return res.data ? res.data : res;
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        return null;
    }
}

// 6. Thêm sản phẩm mới
export async function createProduct(data) {
    try {
        const res = await axiosClient.post("/products", data);
        return res;
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        throw error;
    }
}

// 7. Cập nhật sản phẩm
export async function updateProduct(id, data) {
    try {
        const res = await axiosClient.post(`/products/${id}?_method=PUT`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật sản phẩm ID ${id}:`, error);
        throw error;
    }
}

// 8. Xóa sản phẩm
export async function deleteProduct(id) {
    try {
        const res = await axiosClient.delete(`/products/${id}`);
        return res;
    } catch (error) {
        console.error(`Lỗi xóa sản phẩm ID ${id}:`, error);
        throw error;
    }
}
