// Hàm định dạng tiền tệ Việt Nam Đồng (formatCurrency)
// Ví dụ: 1500000 -> "1.500.000 ₫"
export function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
        return "0 ₫";
    }
    return Number(amount).toLocaleString("vi-VN") + " ₫";
}
