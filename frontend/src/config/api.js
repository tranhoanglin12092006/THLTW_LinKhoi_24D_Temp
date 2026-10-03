// Cấu hình URL gọi API Backend Laravel
const API_CONFIG = {
    // Địa chỉ Backend Laravel API
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",

    // Địa chỉ thư mục chứa hình ảnh upload
    IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/",

    // Headers mặc định
    HEADERS: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },

    // Thời gian chờ tối đa (ms)
    TIMEOUT: 15000,
};

export default API_CONFIG;
