import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * AUTH SERVICES (Dịch vụ gọi API Xác thực & Tài khoản qua axiosClient)
 * Bám theo cấu trúc tranhoanglin-frontend
 * =========================================================================
 */

// 1. Đăng ký tài khoản người dùng mới (POST /api/register)
export async function registerUser(data) {
    try {
        // Gửi dữ liệu đăng ký gồm: ho_ten, email, so_dien_thoai, mat_khau, mat_khau_confirmation
        const res = await axiosClient.post("/register", data);
        return res;
    } catch (error) {
        console.error("Lỗi đăng ký tài khoản:", error);
        throw error;
    }
}

// 2. Đăng nhập tài khoản (POST /api/login)
export async function loginUser(data) {
    try {
        // Gửi thông tin đăng nhập: email, mat_khau
        const res = await axiosClient.post("/login", data);
        return res;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error;
    }
}

// 3. Lấy thông tin tài khoản đang đăng nhập (GET /api/me)
export async function getMe() {
    try {
        const res = await axiosClient.get("/me");
        return res;
    } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
        throw error;
    }
}

// 4. Đăng xuất tài khoản (POST /api/logout)
export async function logoutUser() {
    try {
        const res = await axiosClient.post("/logout");
        return res;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        throw error;
    }
}

// 5. Cập nhật thông tin cá nhân (PUT /api/profile)
export async function updateProfile(data) {
    try {
        const res = await axiosClient.put("/profile", data);
        return res;
    } catch (error) {
        console.error("Lỗi cập nhật thông tin cá nhân:", error);
        throw error;
    }
}

// 6. Đổi mật khẩu tài khoản (POST /api/change-password)
export async function changePassword(data) {
    try {
        const res = await axiosClient.post("/change-password", data);
        return res;
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        throw error;
    }
}
