import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * SETTING SERVICES (Dịch vụ gọi API Quản lý Cấu hình hệ thống qua axiosClient)
 * =========================================================================
 */

// 1. Lấy toàn bộ danh sách cấu hình hệ thống
export async function getSettings() {
    try {
        const res = await axiosClient.get("/settings");
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách cấu hình hệ thống:", error);
        throw error;
    }
}

// 2. Lấy một cấu hình cụ thể theo khóa (key)
export async function getSettingByKey(key) {
    try {
        const res = await axiosClient.get(`/settings/${key}`);
        return res;
    } catch (error) {
        console.error(`Lỗi lấy cấu hình khóa ${key}:`, error);
        throw error;
    }
}

// 3. Cập nhật nhiều cấu hình cùng lúc (Bulk update)
export async function saveSettingsBulk(settings) {
    try {
        const res = await axiosClient.post("/settings", { settings });
        return res;
    } catch (error) {
        console.error("Lỗi cập nhật cấu hình hàng loạt:", error);
        throw error;
    }
}

// 4. Cập nhật cấu hình đơn lẻ
export async function updateSingleSetting(key, value) {
    try {
        const res = await axiosClient.put(`/settings/${key}`, { gia_tri: value });
        return res;
    } catch (error) {
        console.error(`Lỗi cập nhật cấu hình ${key}:`, error);
        throw error;
    }
}
