/**
 * =========================================================================
 * BỘ TIỆN ÍCH XUẤT DỮ LIỆU KHO RA FILE EXCEL (.XLS)
 * Định dạng bảng HTML chuẩn Microsoft Excel kèm UTF-8 BOM chống lỗi font tiếng Việt
 * Trình bày đẹp mắt với màu sắc, viền bảng, căn lề và dòng tổng kết
 * =========================================================================
 */

// Hàm tải file về máy tính người dùng
function downloadExcelFile(htmlContent, fileName) {
    // Thêm ký tự \uFEFF (UTF-8 BOM) ở đầu để Excel trên Windows nhận diện đúng dấu tiếng Việt
    const blob = new Blob(["\uFEFF" + htmlContent], {
        type: "application/vnd.ms-excel;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Định dạng ngày giờ dạng VN: dd/mm/yyyy hh:mm
function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN");
}

// Định dạng tiền tệ VND
function formatMoney(amount) {
    return Number(amount || 0).toLocaleString("vi-VN") + " đ";
}

/**
 * =========================================================================
 * 1. XUẤT DANH SÁCH LỊCH SỬ PHIẾU NHẬP KHO RA EXCEL
 * =========================================================================
 */
export function exportStockImportsToExcel(importsList) {
    const today = new Date().toLocaleDateString("vi-VN");

    // Tính tổng tiền toàn bộ các phiếu
    let grandTotalAmount = 0;
    let grandTotalQuantity = 0;

    const rowsHtml = importsList.map((slip, index) => {
        const details = slip.chi_tiet_phieu_nhap_khos || [];
        
        // Liệt kê chi tiết sản phẩm thành từng dòng hoặc chuỗi
        const itemsText = details.map((d) => 
            `- ${d.san_pham?.ten || 'SP #' + d.san_pham_id} (SL: ${d.so_luong}, Giá: ${formatMoney(d.gia)})`
        ).join("<br/>");

        const slipQty = details.reduce((sum, d) => sum + (parseInt(d.so_luong, 10) || 0), 0);
        const slipTotal = details.reduce((sum, d) => 
            sum + (parseInt(d.so_luong, 10) || 0) * (parseFloat(d.gia) || 0), 0
        );

        grandTotalQuantity += slipQty;
        grandTotalAmount += slipTotal;

        return `
            <tr>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${index + 1}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca; padding: 6px;">#${slip.id}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${formatDate(slip.created_at)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 500;">${slip.ten_nha_cung_cap || "(Chưa có)"}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px;">${slip.nguoi_tao_phieu?.ho_ten || "Quản trị viên"}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 10pt;">${itemsText || "-"}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${slipQty}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; font-weight: bold; color: #047857; padding: 6px;">${formatMoney(slipTotal)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; color: #64748b;">${slip.ghi_chu || ""}</td>
            </tr>
        `;
    }).join("");

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
                .title { font-size: 16pt; font-weight: bold; color: #4338ca; text-align: center; padding: 12px; }
                .subtitle { font-size: 10pt; color: #64748b; text-align: center; padding-bottom: 8px; }
                th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #3730a3; padding: 8px; text-align: center; font-size: 11pt; }
                .total-row td { background-color: #e2e8f0; font-weight: bold; font-size: 11pt; border: 1px solid #94a3b8; padding: 8px; }
            </style>
        </head>
        <body>
            <div class="title">BÁO CÁO LỊCH SỬ PHIẾU NHẬP KHO - HỆ THỐNG TECHNOVA</div>
            <div class="subtitle">Ngày xuất file: ${today} | Tổng số phiếu: ${importsList.length} phiếu</div>
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 40px;">STT</th>
                        <th style="width: 70px;">Mã Phiếu</th>
                        <th style="width: 140px;">Ngày Lập</th>
                        <th style="width: 200px;">Nhà Cung Cấp</th>
                        <th style="width: 140px;">Người Lập</th>
                        <th style="width: 300px;">Mặt Hàng Nhập (SL - Đơn Giá)</th>
                        <th style="width: 90px;">Tổng SL</th>
                        <th style="width: 140px;">Tổng Tiền</th>
                        <th style="width: 160px;">Ghi Chú</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    <tr class="total-row">
                        <td colspan="6" style="text-align: right; padding: 8px;">TỔNG CỘNG TOÀN BỘ:</td>
                        <td style="text-align: center; padding: 8px;">${grandTotalQuantity} cái</td>
                        <td style="text-align: right; color: #047857; padding: 8px;">${formatMoney(grandTotalAmount)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

    downloadExcelFile(htmlContent, `Lich_Su_Nhap_Kho_${new Date().toISOString().slice(0, 10)}.xls`);
}

/**
 * =========================================================================
 * 2. XUẤT DANH SÁCH LỊCH SỬ PHIẾU XUẤT KHO RA EXCEL
 * =========================================================================
 */
export function exportStockExportsToExcel(exportsList) {
    const today = new Date().toLocaleDateString("vi-VN");

    let grandTotalQuantity = 0;

    const rowsHtml = exportsList.map((slip, index) => {
        const details = slip.chi_tiet_phieu_xuat_khos || [];
        
        const itemsText = details.map((d) => 
            `- ${d.san_pham?.ten || 'SP #' + d.san_pham_id} (SL xuất: ${d.so_luong})`
        ).join("<br/>");

        const slipQty = details.reduce((sum, d) => sum + (parseInt(d.so_luong, 10) || 0), 0);
        grandTotalQuantity += slipQty;

        return `
            <tr>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${index + 1}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; color: #d97706; padding: 6px;">#${slip.id}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${formatDate(slip.created_at)}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold; color: #b45309;">${slip.ly_do}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px;">${slip.nguoi_tao_phieu?.ho_ten || "Quản trị viên"}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-size: 10pt;">${itemsText || "-"}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; color: #dc2626; padding: 6px;">${slipQty} cái</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; color: #64748b;">${slip.ghi_chu || ""}</td>
            </tr>
        `;
    }).join("");

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
                .title { font-size: 16pt; font-weight: bold; color: #b45309; text-align: center; padding: 12px; }
                .subtitle { font-size: 10pt; color: #64748b; text-align: center; padding-bottom: 8px; }
                th { background-color: #d97706; color: #ffffff; font-weight: bold; border: 1px solid #b45309; padding: 8px; text-align: center; font-size: 11pt; }
                .total-row td { background-color: #e2e8f0; font-weight: bold; font-size: 11pt; border: 1px solid #94a3b8; padding: 8px; }
            </style>
        </head>
        <body>
            <div class="title">BÁO CÁO LỊCH SỬ PHIẾU XUẤT KHO (NGOÀI BÁN HÀNG) - TECHNOVA</div>
            <div class="subtitle">Ngày xuất file: ${today} | Tổng số phiếu: ${exportsList.length} phiếu</div>
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 40px;">STT</th>
                        <th style="width: 70px;">Mã Phiếu</th>
                        <th style="width: 140px;">Ngày Lập</th>
                        <th style="width: 220px;">Lý Do Xuất</th>
                        <th style="width: 140px;">Người Lập</th>
                        <th style="width: 320px;">Chi Tiết Hàng Xuất (Tên - Số Lượng)</th>
                        <th style="width: 110px;">Tổng Xuất</th>
                        <th style="width: 180px;">Ghi Chú</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    <tr class="total-row">
                        <td colspan="6" style="text-align: right; padding: 8px;">TỔNG CỘNG SỐ LƯỢNG ĐÃ XUẤT:</td>
                        <td style="text-align: center; color: #dc2626; padding: 8px;">${grandTotalQuantity} cái</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

    downloadExcelFile(htmlContent, `Lich_Su_Xuat_Kho_${new Date().toISOString().slice(0, 10)}.xls`);
}

/**
 * =========================================================================
 * 3. XUẤT BÁO CÁO TỒN KHO VÀ CẢNH BÁO RA EXCEL
 * =========================================================================
 */
export function exportStockInventoryToExcel(inventoryList, statistics = {}) {
    const today = new Date().toLocaleDateString("vi-VN");

    let totalStock = 0;

    const rowsHtml = inventoryList.map((item, index) => {
        const stock = item.so_luong_ton ?? 0;
        totalStock += stock;

        let statusText = "Còn hàng";
        let statusStyle = "color: #047857; background-color: #d1fae5; font-weight: bold;";

        if (stock < 20) {
            statusText = stock <= 0 ? "Đã hết hàng (0 cái)" : `Cần nhập thêm (${stock} cái)`;
            statusStyle = "color: #b91c1c; background-color: #fee2e2; font-weight: bold;";
        }

        return `
            <tr>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${index + 1}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; color: #475569; padding: 6px;">#${item.id}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 500;">${item.ten}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px;">${item.danh_muc?.ten || "-"}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px;">${item.thuong_hieu?.ten || "-"}</td>
                <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px;">${formatMoney(item.gia)}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; font-size: 11pt; padding: 6px;">${stock} cái</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px; ${statusStyle}">${statusText}</td>
            </tr>
        `;
    }).join("");

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
                .title { font-size: 16pt; font-weight: bold; color: #047857; text-align: center; padding: 12px; }
                .subtitle { font-size: 10pt; color: #64748b; text-align: center; padding-bottom: 8px; }
                .summary-box { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; margin-bottom: 12px; font-size: 10pt; }
                th { background-color: #059669; color: #ffffff; font-weight: bold; border: 1px solid #047857; padding: 8px; text-align: center; font-size: 11pt; }
                .total-row td { background-color: #e2e8f0; font-weight: bold; font-size: 11pt; border: 1px solid #94a3b8; padding: 8px; }
            </style>
        </head>
        <body>
            <div class="title">BÁO CÁO KIỂM KÊ TỒN KHO SẢN PHẨM - TECHNOVA</div>
            <div class="subtitle">Ngày xuất file: ${today} | Tổng số sản phẩm hiển thị: ${inventoryList.length} mặt hàng</div>
            
            <table border="0" cellpadding="4" cellspacing="0" style="margin-bottom: 12px; font-size: 10pt;">
                <tr>
                    <td><strong>Tổng số mặt hàng:</strong> ${statistics.total_products || inventoryList.length}</td>
                    <td style="width: 30px;"></td>
                    <td><strong>Tổng tồn kho:</strong> ${(statistics.total_stock_quantity || totalStock).toLocaleString("vi-VN")} cái</td>
                    <td style="width: 30px;"></td>
                    <td style="color: #b91c1c;"><strong>Đã hết hàng:</strong> ${statistics.out_of_stock ?? 0} sản phẩm</td>
                    <td style="width: 30px;"></td>
                    <td style="color: #b91c1c;"><strong>Cần nhập thêm (&lt; 20 cái):</strong> ${statistics.need_import ?? statistics.low_stock ?? 0} sản phẩm</td>
                </tr>
            </table>

            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 40px;">STT</th>
                        <th style="width: 70px;">Mã SP</th>
                        <th style="width: 250px;">Tên Sản Phẩm</th>
                        <th style="width: 140px;">Danh Mục</th>
                        <th style="width: 140px;">Thương Hiệu</th>
                        <th style="width: 130px;">Giá Bán</th>
                        <th style="width: 110px;">Tồn Kho</th>
                        <th style="width: 130px;">Tình Trạng</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    <tr class="total-row">
                        <td colspan="6" style="text-align: right; padding: 8px;">TỔNG SỐ LƯỢNG TỒN:</td>
                        <td style="text-align: center; font-size: 12pt; color: #047857; padding: 8px;">${totalStock} cái</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

    downloadExcelFile(htmlContent, `Bao_Cao_Ton_Kho_${new Date().toISOString().slice(0, 10)}.xls`);
}

/**
 * =========================================================================
 * 4. XUẤT CHI TIẾT 1 PHIẾU CỤ THỂ (DÀNH CHO MODAL XEM CHI TIẾT)
 * =========================================================================
 */
export function exportSingleSlipToExcel(slip, type = "import") {
    const isImport = type === "import";
    const title = isImport ? `PHIẾU NHẬP KHO #${slip.id}` : `PHIẾU XUẤT KHO #${slip.id}`;
    const details = isImport ? (slip.chi_tiet_phieu_nhap_khos || []) : (slip.chi_tiet_phieu_xuat_khos || []);
    
    let totalQty = 0;
    let totalAmount = 0;

    const rowsHtml = details.map((d, index) => {
        const qty = parseInt(d.so_luong, 10) || 0;
        const price = parseFloat(d.gia) || 0;
        const subTotal = qty * price;

        totalQty += qty;
        totalAmount += subTotal;

        return `
            <tr>
                <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px;">${index + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: 500;">${d.san_pham?.ten || 'Sản phẩm #' + d.san_pham_id}</td>
                <td style="text-align: center; border: 1px solid #cbd5e1; font-weight: bold; padding: 6px;">${qty}</td>
                ${isImport ? `
                    <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px;">${formatMoney(price)}</td>
                    <td style="text-align: right; border: 1px solid #cbd5e1; font-weight: bold; color: #047857; padding: 6px;">${formatMoney(subTotal)}</td>
                ` : ''}
            </tr>
        `;
    }).join("");

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; }
                .title { font-size: 16pt; font-weight: bold; color: ${isImport ? '#4338ca' : '#b45309'}; text-align: center; padding: 12px; }
                th { background-color: ${isImport ? '#4f46e5' : '#d97706'}; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
                .total-row td { background-color: #e2e8f0; font-weight: bold; font-size: 11pt; border: 1px solid #94a3b8; padding: 8px; }
            </style>
        </head>
        <body>
            <div class="title">${title} - TECHNOVA</div>
            <table border="0" cellpadding="4" cellspacing="0" style="margin-bottom: 14px; font-size: 10pt;">
                <tr>
                    <td><strong>Thời gian lập:</strong> ${formatDate(slip.created_at)}</td>
                    <td style="width: 40px;"></td>
                    <td><strong>Người lập phiếu:</strong> ${slip.nguoi_tao_phieu?.ho_ten || 'Quản trị viên'}</td>
                </tr>
                <tr>
                    <td><strong>${isImport ? 'Nhà cung cấp:' : 'Lý do xuất:'}</strong> ${isImport ? (slip.ten_nha_cung_cap || 'Chưa ghi') : slip.ly_do}</td>
                    <td style="width: 40px;"></td>
                    <td><strong>Ghi chú:</strong> ${slip.ghi_chu || '(Không có)'}</td>
                </tr>
            </table>

            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 40px;">STT</th>
                        <th style="width: 300px;">Tên Sản Phẩm</th>
                        <th style="width: 100px;">Số Lượng</th>
                        ${isImport ? `
                            <th style="width: 140px;">Đơn Giá</th>
                            <th style="width: 160px;">Thành Tiền</th>
                        ` : ''}
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                    <tr class="total-row">
                        <td colspan="2" style="text-align: right; padding: 8px;">TỔNG CỘNG:</td>
                        <td style="text-align: center; padding: 8px;">${totalQty} cái</td>
                        ${isImport ? `
                            <td></td>
                            <td style="text-align: right; color: #047857; padding: 8px;">${formatMoney(totalAmount)}</td>
                        ` : ''}
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
    `;

    const prefix = isImport ? "Phieu_Nhap" : "Phieu_Xuat";
    downloadExcelFile(htmlContent, `${prefix}_#${slip.id}.xls`);
}
