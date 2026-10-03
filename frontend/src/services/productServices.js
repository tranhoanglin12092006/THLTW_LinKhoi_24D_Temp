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
        const res = await axiosClient.get("/products");
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
