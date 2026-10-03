import axios from "axios";
import API_CONFIG from "@/config/api";

/**
 * Tạo một instance axios dùng chung cho toàn bộ dự án
 * Cấu hình sẵn baseURL, headers mặc định và timeout
 */
const axiosClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    timeout: 30000, // Chờ tối đa 30 giây
});

/**
 * 1. REQUEST INTERCEPTOR
 * Chạy trước khi yêu cầu được gửi đi
 * Tự động gắn token xác thực (nếu đã đăng nhập)
 */
axiosClient.interceptors.request.use(
    (config) => {
        // Chỉ chạy trên môi trường trình duyệt (client-side)
        if (typeof window !== "undefined") {
            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("access_token") ||
                localStorage.getItem("admin_token");

            // Nếu có token thì tự động gắn vào Header Authorization
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 2. RESPONSE INTERCEPTOR
 * Chạy sau khi nhận được phản hồi từ server
 * Tự động trích xuất dữ liệu trả về để code ngắn gọn, dễ dùng
 */
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về data trực tiếp (ví dụ: res.data)
        return response.data;
    },
    (error) => {
        // Log lỗi chi tiết để lập trình viên dễ gỡ rối
        if (error.response) {
            console.error(`[API Error ${error.response.status}]:`, error.response.data);
        } else {
            console.error("[API Network Error]:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
