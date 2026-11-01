import API_CONFIG from "@/config/api";

// Ảnh placeholder SVG sắc nét, chuẩn thương hiệu TECHNOVA, tự hiển thị độc lập không cần Internet
export const FALLBACK_PRODUCT_IMAGE =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%20fill%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2270%22%20y%3D%2270%22%20width%3D%22260%22%20height%3D%22260%22%20rx%3D%2224%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Cpath%20d%3D%22M155%20185a25%2025%200%201%200%200-50%2025%2025%200%200%200%200%2050zm90%2030l-45-45-80%2080h160l-35-35z%22%20fill%3D%22%2394a3b8%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2286%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22700%22%3ETECHNOVA%3C%2Ftext%3E%3C%2Fsvg%3E";

/**
 * Kiểm tra xem URL có phải là ảnh rỗng, placeholder lỗi hoặc fallback không
 */
export function isFallbackImage(url) {
    if (!url || typeof url !== "string") return true;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "undefined" || trimmed === "null") return true;
    if (trimmed.includes("no-image.png")) return true;
    if (trimmed.includes("placehold.co")) return true;
    if (trimmed.startsWith("data:image/svg+xml")) return true;
    return false;
}

/**
 * Chuẩn hóa URL hình ảnh sản phẩm từ Laravel Backend
 * Xử lý mọi trường hợp:
 * - Hỗ trợ truyền vào string hoặc object ({ url, image_path, ... })
 * - URL bị nối sai do env thiếu dấu slash: "storageproducts/..." -> "storage/products/..."
 * - Xóa lặp "/storage/storage/"
 * - Đổi localhost:8000 thành 127.0.0.1:8000 (tránh lỗi IPv6 trên Windows)
 * - Xử lý đường dẫn tương đối (products/..., storage/products/...)
 */
export function resolveProductImage(raw) {
    if (!raw) {
        return FALLBACK_PRODUCT_IMAGE;
    }

    let input = raw;
    if (typeof raw === "object") {
        input = raw.url || raw.image_url || raw.image_path || raw.hinh_anh || raw.image || "";
    }

    if (typeof input !== "string") {
        return FALLBACK_PRODUCT_IMAGE;
    }

    let trimmed = input.trim();

    if (!trimmed || trimmed === "undefined" || trimmed === "null") {
        return FALLBACK_PRODUCT_IMAGE;
    }

    // Nếu chứa placeholder no-image lỗi từ Laravel, thay bằng fallback SVG
    if (trimmed.includes("no-image.png")) {
        return FALLBACK_PRODUCT_IMAGE;
    }

    // Sửa lỗi nối chuỗi phổ biến: "storageproducts" -> "storage/products"
    if (trimmed.includes("storageproducts/")) {
        trimmed = trimmed.replace(/storageproducts\//g, "storage/products/");
    }

    // Xóa lặp /storage/storage/
    if (trimmed.includes("/storage/storage/")) {
        trimmed = trimmed.replace(/\/storage\/storage\//g, "/storage/");
    }

    // Đồng bộ localhost sang 127.0.0.1 để tránh lỗi phân giải IPv6 ::1 của Node/Chrome trên Windows
    if (trimmed.includes("localhost:8000")) {
        trimmed = trimmed.replace(/localhost:8000/g, "127.0.0.1:8000");
    }

    // Nếu đã là link đầy đủ http://, https:// hoặc data:
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
        return trimmed;
    }

    // Lấy domain backend storage (luôn chuẩn hóa kết thúc bằng http://127.0.0.1:8000/storage/)
    let baseStorage = (
        process.env.NEXT_PUBLIC_IMAGE_URL ||
        API_CONFIG?.IMAGE_URL ||
        "http://127.0.0.1:8000/storage/"
    ).trim();

    // Đồng bộ localhost sang 127.0.0.1 trong baseStorage
    baseStorage = baseStorage.replace(/localhost:8000/g, "127.0.0.1:8000");

    if (baseStorage.endsWith("/api") || baseStorage.endsWith("/api/")) {
        baseStorage = baseStorage.replace(/\/api\/?$/, "/storage/");
    }
    if (!baseStorage.includes("/storage")) {
        baseStorage = baseStorage.replace(/\/+$/, "") + "/storage/";
    }
    if (!baseStorage.endsWith("/")) {
        baseStorage += "/";
    }

    // Làm sạch path tương đối: loại bỏ leading slash và tiền tố storage/
    const cleanPath = trimmed
        .replace(/^\/+/, "")
        .replace(/^storage\/+/i, "");

    return `${baseStorage}${cleanPath}`;
}
