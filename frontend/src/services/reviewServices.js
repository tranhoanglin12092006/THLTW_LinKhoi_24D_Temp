import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * REVIEW SERVICES (Dịch vụ gọi API Đánh giá & Nhận xét sản phẩm)
 * Sử dụng instance axiosClient dùng chung của toàn bộ dự án
 * =========================================================================
 */

/**
 * 1. Lấy danh sách đánh giá của một sản phẩm
 * @param {number|string} productId - ID của sản phẩm cần lấy review
 */
export async function getProductReviews(productId) {
    try {
        const res = await axiosClient.get(`/products/${productId}/reviews`);
        return res;
    } catch (error) {
        console.error(`Lỗi khi lấy đánh giá của sản phẩm ID ${productId}:`, error);
        throw error;
    }
}

/**
 * 2. Gửi một đánh giá / nhận xét mới cho sản phẩm
 * @param {number|string} productId - ID của sản phẩm
 * @param {object} data - Dữ liệu gồm { ho_ten, so_sao, noi_dung }
 */
export async function addProductReview(productId, data) {
    try {
        const res = await axiosClient.post(`/products/${productId}/reviews`, data);
        return res;
    } catch (error) {
        console.error(`Lỗi khi gửi đánh giá cho sản phẩm ID ${productId}:`, error);
        throw error;
    }
}
