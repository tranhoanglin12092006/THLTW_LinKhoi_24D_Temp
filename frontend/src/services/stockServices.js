import axiosClient from "@/lib/axiosClient";

/**
 * =========================================================================
 * DỊCH VỤ QUẢN LÝ KHO (STOCK SERVICES)
 * Gọi các API Quản lý xuất nhập kho trên Backend Laravel
 * =========================================================================
 */

// 1. Tạo phiếu nhập kho (FUNC-ADM-STOCK-01)
// data: { ten_nha_cung_cap, ghi_chu, items: [{ san_pham_id, so_luong, gia }] }
export async function createStockImport(data) {
    try {
        const response = await axiosClient.post("/stock/imports", data);
        return response;
    } catch (error) {
        console.error("Lỗi khi tạo phiếu nhập kho:", error);
        throw error;
    }
}

// 2. Tạo phiếu xuất kho (FUNC-ADM-STOCK-02)
// data: { ly_do, ghi_chu, items: [{ san_pham_id, so_luong }] }
export async function createStockExport(data) {
    try {
        const response = await axiosClient.post("/stock/exports", data);
        return response;
    } catch (error) {
        console.error("Lỗi khi tạo phiếu xuất kho:", error);
        throw error;
    }
}

// 3. Lấy danh sách lịch sử phiếu nhập kho (FUNC-ADM-STOCK-03)
export async function getStockImports() {
    try {
        const res = await axiosClient.get("/stock/imports");
        // Tự động trích xuất mảng danh sách phiếu nhập
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu nhập:", error);
        return [];
    }
}

// 4. Lấy danh sách lịch sử phiếu xuất kho (FUNC-ADM-STOCK-03)
export async function getStockExports() {
    try {
        const res = await axiosClient.get("/stock/exports");
        // Tự động trích xuất mảng danh sách phiếu xuất
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        return [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu xuất:", error);
        return [];
    }
}

// 5. Lấy danh sách tồn kho hiện tại (FUNC-ADM-STOCK-03)
export async function getStockInventory() {
    try {
        const res = await axiosClient.get("/stock/inventory");
        // Tự động chuẩn hóa dữ liệu báo cáo tồn kho
        if (res?.items || res?.statistics) return res;
        if (res?.data?.items || res?.data?.statistics) return res.data;
        return {
            statistics: { total_products: 0, total_stock_quantity: 0, out_of_stock: 0, low_stock: 0 },
            items: [],
        };
    } catch (error) {
        console.error("Lỗi khi lấy tồn kho:", error);
        return {
            statistics: { total_products: 0, total_stock_quantity: 0, out_of_stock: 0, low_stock: 0 },
            items: [],
        };
    }
}
