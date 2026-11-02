"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "@/services/productServices";
import {
    createStockImport,
    createStockExport,
    getStockImports,
    getStockExports,
    getStockInventory,
} from "@/services/stockServices";
import {
    exportStockImportsToExcel,
    exportStockExportsToExcel,
    exportStockInventoryToExcel,
    exportSingleSlipToExcel,
} from "@/utils/exportStockExcel";

export default function StockManagementPage() {
    // =========================================================================
    // KHAI BÁO CÁC STATE (TRẠNG THÁI DỮ LIỆU DÙNG CHUNG)
    // =========================================================================

    // Tab chức năng chính: 'import' (Nhập kho - B1), 'export' (Xuất kho - B2), 'history' (Lịch sử & Tồn kho - B3)
    const [activeTab, setActiveTab] = useState("import");

    // Danh sách toàn bộ sản phẩm lấy từ Backend để chọn khi nhập hoặc xuất hàng
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Thông báo kết quả dùng chung (thành công hoặc lỗi)
    const [alertMessage, setAlertMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // =========================================================================
    // STATE DÀNH CHO TAB 1: NHẬP HÀNG (FUNC-ADM-STOCK-01)
    // =========================================================================
    const [supplierName, setSupplierName] = useState("");
    const [note, setNote] = useState("");
    const [importItems, setImportItems] = useState([
        { san_pham_id: "", so_luong: 1, gia: 0 },
    ]);
    const [submittingImport, setSubmittingImport] = useState(false);

    // =========================================================================
    // STATE DÀNH CHO TAB 2: XUẤT HÀNG (FUNC-ADM-STOCK-02)
    // =========================================================================
    const [exportReason, setExportReason] = useState("Xuất trả nhà cung cấp");
    const [customReason, setCustomReason] = useState("");
    const [exportNote, setExportNote] = useState("");
    const [exportItems, setExportItems] = useState([
        { san_pham_id: "", so_luong: 1 },
    ]);
    const [submittingExport, setSubmittingExport] = useState(false);

    // =========================================================================
    // STATE DÀNH CHO TAB 3: LỊCH SỬ NHẬP/XUẤT & TỒN KHO (FUNC-ADM-STOCK-03)
    // =========================================================================
    // Sub-tab con bên trong Tab 3: 'imports' (Phiếu nhập), 'exports' (Phiếu xuất), 'inventory' (Báo cáo tồn kho)
    const [historySubTab, setHistorySubTab] = useState("imports");

    // Dữ liệu lịch sử phiếu nhập và phiếu xuất
    const [importHistoryList, setImportHistoryList] = useState([]);
    const [exportHistoryList, setExportHistoryList] = useState([]);

    // Dữ liệu báo cáo tồn kho và các con số thống kê
    const [inventoryData, setInventoryData] = useState({
        statistics: {
            total_products: 0,
            total_stock_quantity: 0,
            out_of_stock: 0,
            low_stock: 0,
        },
        items: [],
    });

    const [loadingHistory, setLoadingHistory] = useState(false);

    // Bộ lọc và tìm kiếm cho bảng tồn kho
    const [inventorySearch, setInventorySearch] = useState("");
    const [stockFilter, setStockFilter] = useState("all"); // 'all' | 'out' | 'low' | 'in_stock'

    // State phục vụ Modal xem chi tiết một phiếu nhập hoặc xuất
    const [selectedSlip, setSelectedSlip] = useState(null); // Dữ liệu phiếu đang chọn
    const [slipModalType, setSlipModalType] = useState(null); // 'import' | 'export' | null

    // =========================================================================
    // HÀM LẤY DANH SÁCH SẢN PHẨM TỪ BACKEND
    // =========================================================================
    const loadProducts = async () => {
        try {
            const res = await getAllProducts();
            const data = Array.isArray(res) ? res : res?.data || [];
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // =========================================================================
    // HÀM LẤY DỮ LIỆU LỊCH SỬ & BÁO CÁO TỒN KHO CHO BƯỚC 3 (FUNC-03)
    // =========================================================================
    const loadHistoryData = async () => {
        setLoadingHistory(true);
        try {
            const [importsRes, exportsRes, inventoryRes] = await Promise.all([
                getStockImports(),
                getStockExports(),
                getStockInventory(),
            ]);

            setImportHistoryList(
                Array.isArray(importsRes) ? importsRes : importsRes?.data || []
            );
            setExportHistoryList(
                Array.isArray(exportsRes) ? exportsRes : exportsRes?.data || []
            );
            setInventoryData(
                inventoryRes?.items
                    ? inventoryRes
                    : inventoryRes?.data || {
                          statistics: {
                              total_products: 0,
                              total_stock_quantity: 0,
                              out_of_stock: 0,
                              low_stock: 0,
                          },
                          items: [],
                      }
            );
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu lịch sử và tồn kho:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Tự động tải sản phẩm và lịch sử khi vừa mở trang
    useEffect(() => {
        let isMounted = true;
        getAllProducts()
            .then((res) => {
                if (isMounted) {
                    const data = Array.isArray(res) ? res : res?.data || [];
                    setProducts(data);
                    setLoadingProducts(false);
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải danh sách sản phẩm:", err);
                if (isMounted) setLoadingProducts(false);
            });

        // Tải trước dữ liệu lịch sử và tồn kho
        Promise.all([
            getStockImports(),
            getStockExports(),
            getStockInventory(),
        ])
            .then(([importsRes, exportsRes, inventoryRes]) => {
                if (isMounted) {
                    setImportHistoryList(
                        Array.isArray(importsRes) ? importsRes : importsRes?.data || []
                    );
                    setExportHistoryList(
                        Array.isArray(exportsRes) ? exportsRes : exportsRes?.data || []
                    );
                    setInventoryData(
                        inventoryRes?.items
                            ? inventoryRes
                            : inventoryRes?.data || {
                                  statistics: {
                                      total_products: 0,
                                      total_stock_quantity: 0,
                                      out_of_stock: 0,
                                      low_stock: 0,
                                  },
                                  items: [],
                              }
                    );
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải trước lịch sử:", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // =========================================================================
    // CÁC HÀM XỬ LÝ CHO BƯỚC 1: TẠO PHIẾU NHẬP HÀNG
    // =========================================================================
    const handleAddImportRow = () => {
        setImportItems((prev) => [
            ...prev,
            { san_pham_id: "", so_luong: 1, gia: 0 },
        ]);
    };

    const handleRemoveImportRow = (index) => {
        if (importItems.length === 1) {
            alert("Phiếu nhập phải có ít nhất 1 sản phẩm!");
            return;
        }
        setImportItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImportItemChange = (index, field, value) => {
        setImportItems((prev) => {
            const updated = [...prev];
            const item = { ...updated[index] };

            if (field === "san_pham_id") {
                item.san_pham_id = value;
                const found = products.find((p) => String(p.id) === String(value));
                if (found && item.gia === 0) {
                    item.gia = Number(found.gia || 0);
                }
            } else if (field === "so_luong") {
                item.so_luong = Math.max(1, parseInt(value, 10) || 1);
            } else if (field === "gia") {
                item.gia = Math.max(0, parseFloat(value) || 0);
            }

            updated[index] = item;
            return updated;
        });
    };

    const totalImportQuantity = importItems.reduce(
        (sum, item) => sum + (parseInt(item.so_luong, 10) || 0),
        0
    );
    const totalImportAmount = importItems.reduce(
        (sum, item) =>
            sum + (parseInt(item.so_luong, 10) || 0) * (parseFloat(item.gia) || 0),
        0
    );

    const handleSubmitImport = async (e) => {
        e.preventDefault();
        setAlertMessage(null);

        for (let i = 0; i < importItems.length; i++) {
            if (!importItems[i].san_pham_id) {
                setAlertMessage({
                    type: "error",
                    text: `Dòng ${i + 1}: Vui lòng chọn sản phẩm cần nhập!`,
                });
                return;
            }
        }

        setSubmittingImport(true);

        try {
            const payload = {
                ten_nha_cung_cap: supplierName.trim() || null,
                ghi_chu: note.trim() || null,
                items: importItems.map((item) => ({
                    san_pham_id: parseInt(item.san_pham_id, 10),
                    so_luong: parseInt(item.so_luong, 10),
                    gia: parseFloat(item.gia),
                })),
            };

            const result = await createStockImport(payload);

            setAlertMessage({
                type: "success",
                text: result?.message || "Tạo phiếu nhập hàng và tăng tồn kho thành công!",
            });

            setSupplierName("");
            setNote("");
            setImportItems([{ san_pham_id: "", so_luong: 1, gia: 0 }]);

            await loadProducts();
            loadHistoryData();
        } catch (error) {
            console.error("Lỗi submit phiếu nhập:", error);
            const errMsg =
                error?.response?.data?.message ||
                "Có lỗi xảy ra khi tạo phiếu nhập kho. Vui lòng thử lại!";
            setAlertMessage({ type: "error", text: errMsg });
        } finally {
            setSubmittingImport(false);
        }
    };

    // =========================================================================
    // CÁC HÀM XỬ LÝ CHO BƯỚC 2: TẠO PHIẾU XUẤT HÀNG
    // =========================================================================
    const handleAddExportRow = () => {
        setExportItems((prev) => [...prev, { san_pham_id: "", so_luong: 1 }]);
    };

    const handleRemoveExportRow = (index) => {
        if (exportItems.length === 1) {
            alert("Phiếu xuất phải có ít nhất 1 sản phẩm!");
            return;
        }
        setExportItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleExportItemChange = (index, field, value) => {
        setExportItems((prev) => {
            const updated = [...prev];
            const item = { ...updated[index] };

            if (field === "san_pham_id") {
                item.san_pham_id = value;
            } else if (field === "so_luong") {
                item.so_luong = Math.max(1, parseInt(value, 10) || 1);
            }

            updated[index] = item;
            return updated;
        });
    };

    const totalExportQuantity = exportItems.reduce(
        (sum, item) => sum + (parseInt(item.so_luong, 10) || 0),
        0
    );

    const handleSubmitExport = async (e) => {
        e.preventDefault();
        setAlertMessage(null);

        const finalReason =
            exportReason === "Khác" ? customReason.trim() : exportReason;

        if (!finalReason) {
            setAlertMessage({
                type: "error",
                text: "Vui lòng nhập lý do xuất kho!",
            });
            return;
        }

        for (let i = 0; i < exportItems.length; i++) {
            const row = exportItems[i];
            if (!row.san_pham_id) {
                setAlertMessage({
                    type: "error",
                    text: `Dòng ${i + 1}: Vui lòng chọn sản phẩm cần xuất!`,
                });
                return;
            }

            const currentProduct = products.find(
                (p) => String(p.id) === String(row.san_pham_id)
            );
            const currentStock = currentProduct?.so_luong_ton ?? 0;

            if (row.so_luong > currentStock) {
                setAlertMessage({
                    type: "error",
                    text: `Dòng ${i + 1}: Sản phẩm '${currentProduct?.ten}' chỉ còn tồn ${currentStock}, không thể xuất ${row.so_luong}!`,
                });
                return;
            }
        }

        setSubmittingExport(true);

        try {
            const payload = {
                ly_do: finalReason,
                ghi_chu: exportNote.trim() || null,
                items: exportItems.map((item) => ({
                    san_pham_id: parseInt(item.san_pham_id, 10),
                    so_luong: parseInt(item.so_luong, 10),
                })),
            };

            const result = await createStockExport(payload);

            setAlertMessage({
                type: "success",
                text: result?.message || "Tạo phiếu xuất hàng và giảm tồn kho thành công!",
            });

            setExportReason("Xuất trả nhà cung cấp");
            setCustomReason("");
            setExportNote("");
            setExportItems([{ san_pham_id: "", so_luong: 1 }]);

            await loadProducts();
            loadHistoryData();
        } catch (error) {
            console.error("Lỗi khi tạo phiếu xuất:", error);
            const errMsg =
                error?.response?.data?.message ||
                "Có lỗi xảy ra khi tạo phiếu xuất kho. Vui lòng kiểm tra lại!";
            setAlertMessage({ type: "error", text: errMsg });
        } finally {
            setSubmittingExport(false);
        }
    };

    // =========================================================================
    // LỌC SẢN PHẨM TRONG BẢNG TỒN KHO (TÌM KIẾM THEO TÊN + LỌC TRẠNG THÁI)
    // =========================================================================
    const filteredInventory = useMemo(() => {
        const list = inventoryData?.items || [];
        return list.filter((item) => {
            // Tìm kiếm theo tên sản phẩm hoặc mã ID
            const matchName =
                !inventorySearch ||
                item.ten?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                String(item.id).includes(inventorySearch);

            // Lọc theo số lượng tồn
            let matchStatus = true;
            if (stockFilter === "need_import") {
                matchStatus = (item.so_luong_ton ?? 0) < 20; // Báo đỏ nếu dưới 20 cái
            } else if (stockFilter === "out") {
                matchStatus = (item.so_luong_ton ?? 0) <= 0;
            } else if (stockFilter === "in_stock") {
                matchStatus = (item.so_luong_ton ?? 0) >= 20;
            }

            return matchName && matchStatus;
        });
    }, [inventoryData, inventorySearch, stockFilter]);

    return (
        <div className="space-y-6">
            {/* =========================================================================
                TIÊU ĐỀ TRANG VÀ TAB ĐIỀU HƯỚNG
            ========================================================================= */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                            📦
                        </span>
                        Quản Lý Kho Hàng
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Ghi nhận nhập kho, xuất trả / xuất hủy hàng và theo dõi tồn kho sản phẩm.
                    </p>
                </div>

                {/* Tabs điều hướng 3 chức năng chính */}
                <div className="flex items-center gap-2 bg-[#121528] p-1.5 rounded-xl border border-white/[0.08]">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("import");
                            setAlertMessage(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === "import"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <span>📥</span> Nhập Hàng (FUNC-01)
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("export");
                            setAlertMessage(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === "export"
                                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <span>📤</span> Xuất Hàng (FUNC-02)
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("history");
                            setAlertMessage(null);
                            loadHistoryData();
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                            activeTab === "history"
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                    >
                        <span>📋</span> Lịch Sử & Tồn Kho (FUNC-03)
                    </button>
                </div>
            </div>

            {/* =========================================================================
                THÔNG BÁO ALERT KẾT QUẢ
            ========================================================================= */}
            {alertMessage && (
                <div
                    className={`p-4 rounded-xl text-sm flex items-start justify-between border ${
                        alertMessage.type === "success"
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                            : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">
                            {alertMessage.type === "success" ? "✓" : "⚠"}
                        </span>
                        <span>{alertMessage.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setAlertMessage(null)}
                        className="text-xs opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* =========================================================================
                TAB 1: TẠO PHIẾU NHẬP HÀNG (FUNC-ADM-STOCK-01)
            ========================================================================= */}
            {activeTab === "import" && (
                <form onSubmit={handleSubmitImport} className="space-y-6">
                    <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                            Thông Tin Phiếu Nhập Hàng
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                    Tên Nhà Cung Cấp
                                </label>
                                <input
                                    type="text"
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    placeholder="Ví dụ: Công ty Phân Phối Thiết Bị ABC..."
                                    className="w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                    Ghi Chú Đợt Nhập
                                </label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ví dụ: Nhập bổ sung tồn kho quý 4..."
                                    className="w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Danh Sách Mặt Hàng Nhập Kho
                            </h2>

                            <button
                                type="button"
                                onClick={handleAddImportRow}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-xs font-semibold text-violet-300 hover:bg-violet-600 hover:text-white transition-all"
                            >
                                <span>+</span> Thêm mặt hàng
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#141830] text-slate-400 uppercase font-semibold border-b border-white/[0.06]">
                                    <tr>
                                        <th className="p-3 w-12 text-center">#</th>
                                        <th className="p-3">Sản phẩm</th>
                                        <th className="p-3 w-32 text-center">Tồn hiện tại</th>
                                        <th className="p-3 w-32">Số lượng nhập</th>
                                        <th className="p-3 w-44">Đơn giá nhập (đ)</th>
                                        <th className="p-3 w-44 text-right">Thành tiền (đ)</th>
                                        <th className="p-3 w-16 text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {importItems.map((item, index) => {
                                        const selectedProduct = products.find(
                                            (p) => String(p.id) === String(item.san_pham_id)
                                        );
                                        const rowTotal =
                                            (parseInt(item.so_luong, 10) || 0) *
                                            (parseFloat(item.gia) || 0);

                                        return (
                                            <tr key={index} className="hover:bg-white/[0.02]">
                                                <td className="p-3 text-center text-slate-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={item.san_pham_id}
                                                        onChange={(e) =>
                                                            handleImportItemChange(
                                                                index,
                                                                "san_pham_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#181c38] border border-white/[0.1] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                                                        required
                                                    >
                                                        <option value="">-- Chọn sản phẩm --</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                #{p.id} - {p.ten} (Tồn: {p.so_luong_ton ?? 0})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {selectedProduct ? (
                                                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                                            {selectedProduct.so_luong_ton ?? 0}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.so_luong}
                                                        onChange={(e) =>
                                                            handleImportItemChange(
                                                                index,
                                                                "so_luong",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#181c38] border border-white/[0.1] rounded-lg px-3 py-2 text-white text-xs text-center focus:outline-none focus:border-violet-500"
                                                        required
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        value={item.gia}
                                                        onChange={(e) =>
                                                            handleImportItemChange(
                                                                index,
                                                                "gia",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#181c38] border border-white/[0.1] rounded-lg px-3 py-2 text-white text-xs text-right focus:outline-none focus:border-violet-500"
                                                        required
                                                    />
                                                </td>
                                                <td className="p-3 text-right font-semibold text-emerald-400">
                                                    {rowTotal.toLocaleString("vi-VN")} đ
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImportRow(index)}
                                                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                    >
                                                        🗑
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/[0.08]">
                            <div className="text-xs text-slate-400">
                                Số loại hàng: <strong className="text-white">{importItems.length}</strong> | Tổng
                                số lượng nhập: <strong className="text-violet-400">{totalImportQuantity}</strong>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                                    Tổng tiền:
                                </span>
                                <span className="text-xl font-bold text-emerald-400">
                                    {totalImportAmount.toLocaleString("vi-VN")} đ
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSupplierName("");
                                setNote("");
                                setImportItems([{ san_pham_id: "", so_luong: 1, gia: 0 }]);
                            }}
                            className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
                        >
                            Làm Mới Form
                        </button>

                        <button
                            type="submit"
                            disabled={submittingImport || loadingProducts}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {submittingImport ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang tạo phiếu...</span>
                                </>
                            ) : (
                                <>
                                    <span>✓</span>
                                    <span>Tạo Phiếu Nhập & Tăng Tồn Kho</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* =========================================================================
                TAB 2: TẠO PHIẾU XUẤT HÀNG (FUNC-ADM-STOCK-02)
            ========================================================================= */}
            {activeTab === "export" && (
                <form onSubmit={handleSubmitExport} className="space-y-6">
                    <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            Thông Tin Phiếu Xuất Hàng (Xuất Ngoài Bán Hàng)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                    Lý Do Xuất Kho <span className="text-rose-400">*</span>
                                </label>
                                <select
                                    value={exportReason}
                                    onChange={(e) => setExportReason(e.target.value)}
                                    className="w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                >
                                    <option value="Xuất trả nhà cung cấp">
                                        Xuất trả nhà cung cấp
                                    </option>
                                    <option value="Xuất hủy hàng lỗi / hỏng">
                                        Xuất hủy hàng lỗi / hỏng / hết hạn
                                    </option>
                                    <option value="Xuất điều chuyển kho / kiểm kê">
                                        Xuất điều chuyển kho / kiểm kê cân đối
                                    </option>
                                    <option value="Khác">Lý do khác...</option>
                                </select>

                                {exportReason === "Khác" && (
                                    <input
                                        type="text"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Nhập lý do xuất kho cụ thể..."
                                        className="mt-2 w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                    Ghi Chú Đợt Xuất
                                </label>
                                <input
                                    type="text"
                                    value={exportNote}
                                    onChange={(e) => setExportNote(e.target.value)}
                                    placeholder="Ví dụ: Lô hàng bị trầy xước vỏ hộp gửi trả lại NCC..."
                                    className="w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                Danh Sách Mặt Hàng Xuất Kho
                            </h2>

                            <button
                                type="button"
                                onClick={handleAddExportRow}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-amber-600 hover:text-white transition-all"
                            >
                                <span>+</span> Thêm mặt hàng
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#141830] text-slate-400 uppercase font-semibold border-b border-white/[0.06]">
                                    <tr>
                                        <th className="p-3 w-12 text-center">#</th>
                                        <th className="p-3">Sản phẩm</th>
                                        <th className="p-3 w-36 text-center">Tồn kho hiện có</th>
                                        <th className="p-3 w-36 text-center">Số lượng xuất</th>
                                        <th className="p-3 w-48 text-center">Tình trạng kiểm tra</th>
                                        <th className="p-3 w-16 text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {exportItems.map((item, index) => {
                                        const selectedProduct = products.find(
                                            (p) => String(p.id) === String(item.san_pham_id)
                                        );
                                        const currentStock = selectedProduct?.so_luong_ton ?? 0;
                                        const isExceeded = item.san_pham_id && item.so_luong > currentStock;

                                        return (
                                            <tr key={index} className="hover:bg-white/[0.02]">
                                                <td className="p-3 text-center text-slate-500 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={item.san_pham_id}
                                                        onChange={(e) =>
                                                            handleExportItemChange(
                                                                index,
                                                                "san_pham_id",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#181c38] border border-white/[0.1] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                                                        required
                                                    >
                                                        <option value="">-- Chọn sản phẩm cần xuất --</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                #{p.id} - {p.ten} (Tồn: {p.so_luong_ton ?? 0})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {selectedProduct ? (
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                                currentStock > 0
                                                                    ? "bg-slate-800 text-slate-200 border-slate-700"
                                                                    : "bg-rose-950/60 text-rose-300 border-rose-800"
                                                            }`}
                                                        >
                                                            {currentStock} cái
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.so_luong}
                                                        onChange={(e) =>
                                                            handleExportItemChange(
                                                                index,
                                                                "so_luong",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full bg-[#181c38] border rounded-lg px-3 py-2 text-white text-xs text-center focus:outline-none ${
                                                            isExceeded
                                                                ? "border-rose-500 text-rose-300 ring-1 ring-rose-500"
                                                                : "border-white/[0.1] focus:border-amber-500"
                                                        }`}
                                                        required
                                                    />
                                                </td>
                                                <td className="p-3 text-center">
                                                    {!selectedProduct ? (
                                                        <span className="text-slate-500 text-[11px]">
                                                            Chưa chọn sản phẩm
                                                        </span>
                                                    ) : isExceeded ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-800/50">
                                                            ⚠ Vượt tồn kho ({item.so_luong}/{currentStock})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/50">
                                                            ✓ Hợp lệ (còn {currentStock - item.so_luong})
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExportRow(index)}
                                                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                    >
                                                        🗑
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/[0.08]">
                            <div className="text-xs text-slate-400">
                                Số loại mặt hàng xuất:{" "}
                                <strong className="text-white">{exportItems.length}</strong>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                                    Tổng số lượng sản phẩm xuất:
                                </span>
                                <span className="text-xl font-bold text-amber-400">
                                    {totalExportQuantity} cái
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setExportReason("Xuất trả nhà cung cấp");
                                setCustomReason("");
                                setExportNote("");
                                setExportItems([{ san_pham_id: "", so_luong: 1 }]);
                            }}
                            className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-xs font-semibold text-slate-300 hover:bg-white/[0.05]"
                        >
                            Làm Mới Form
                        </button>

                        <button
                            type="submit"
                            disabled={submittingExport || loadingProducts}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {submittingExport ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang tạo phiếu...</span>
                                </>
                            ) : (
                                <>
                                    <span>✓</span>
                                    <span>Tạo Phiếu Xuất & Giảm Tồn Kho</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* =========================================================================
                TAB 3: LỊCH SỬ NHẬP/XUẤT & TỒN KHO (FUNC-ADM-STOCK-03 - BƯỚC 3)
            ========================================================================= */}
            {activeTab === "history" && (
                <div className="space-y-6">
                    {/* BỘ NÚT CHUYỂN SUB-TAB (NHẬP, XUẤT, TỒN KHO) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f1225] p-3 rounded-2xl border border-white/[0.08]">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setHistorySubTab("imports")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    historySubTab === "imports"
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                <span>📥</span> Lịch Sử Nhập ({importHistoryList.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setHistorySubTab("exports")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    historySubTab === "exports"
                                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                <span>📤</span> Lịch Sử Xuất ({exportHistoryList.length})
                            </button>

                            <button
                                type="button"
                                onClick={() => setHistorySubTab("inventory")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    historySubTab === "inventory"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                }`}
                            >
                                <span>📊</span> Báo Cáo Tồn Kho ({inventoryData?.items?.length || 0})
                            </button>
                        </div>

                        {/* Nhóm nút hành động: Xuất Excel & Làm mới */}
                        <div className="flex flex-wrap items-center gap-2">
                            {historySubTab === "imports" && (
                                <button
                                    type="button"
                                    onClick={() => exportStockImportsToExcel(importHistoryList)}
                                    disabled={importHistoryList.length === 0}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-40"
                                >
                                    <span>📊</span> Xuất Excel Phiếu Nhập
                                </button>
                            )}

                            {historySubTab === "exports" && (
                                <button
                                    type="button"
                                    onClick={() => exportStockExportsToExcel(exportHistoryList)}
                                    disabled={exportHistoryList.length === 0}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600/20 border border-amber-500/40 text-xs font-semibold text-amber-300 hover:bg-amber-600 hover:text-white transition-all disabled:opacity-40"
                                >
                                    <span>📊</span> Xuất Excel Phiếu Xuất
                                </button>
                            )}

                            {historySubTab === "inventory" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        exportStockInventoryToExcel(
                                            filteredInventory,
                                            inventoryData?.statistics
                                        )
                                    }
                                    disabled={filteredInventory.length === 0}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-40"
                                >
                                    <span>📊</span> Xuất Excel Tồn Kho
                                </button>
                            )}

                            {/* Nút bấm làm mới dữ liệu */}
                            <button
                                type="button"
                                onClick={loadHistoryData}
                                disabled={loadingHistory}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                            >
                                <span>↻</span> Làm mới
                            </button>
                        </div>
                    </div>

                    {/* HIỆU ỨNG ĐANG TẢI DỮ LIỆU */}
                    {loadingHistory && (
                        <div className="p-12 text-center text-slate-400 text-xs">
                            <span className="inline-block w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                            Đang tải dữ liệu từ máy chủ...
                        </div>
                    )}

                    {/* -------------------------------------------------------------
                        SUB-TAB 3.1: DANH SÁCH LỊCH SỬ PHIẾU NHẬP KHO
                    ------------------------------------------------------------- */}
                    {!loadingHistory && historySubTab === "imports" && (
                        <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                                Danh Sách Phiếu Nhập Kho Gần Đây
                            </h2>

                            {importHistoryList.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-8">
                                    Chưa có phiếu nhập kho nào trong hệ thống.
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#141830] text-slate-400 uppercase font-semibold border-b border-white/[0.06]">
                                            <tr>
                                                <th className="p-3 w-16 text-center">Mã</th>
                                                <th className="p-3">Thời gian lập</th>
                                                <th className="p-3">Nhà cung cấp</th>
                                                <th className="p-3">Người lập phiếu</th>
                                                <th className="p-3 text-center">Số mặt hàng</th>
                                                <th className="p-3 text-right">Tổng tiền nhập</th>
                                                <th className="p-3 text-center">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {importHistoryList.map((slip) => {
                                                const details = slip.chi_tiet_phieu_nhap_khos || [];
                                                const slipTotal = details.reduce(
                                                    (sum, d) =>
                                                        sum +
                                                        (parseInt(d.so_luong, 10) || 0) *
                                                            (parseFloat(d.gia) || 0),
                                                    0
                                                );

                                                return (
                                                    <tr key={slip.id} className="hover:bg-white/[0.02]">
                                                        <td className="p-3 text-center font-bold text-violet-400">
                                                            #{slip.id}
                                                        </td>
                                                        <td className="p-3 text-slate-300">
                                                            {new Date(slip.created_at).toLocaleString("vi-VN")}
                                                        </td>
                                                        <td className="p-3 font-medium text-white">
                                                            {slip.ten_nha_cung_cap || "(Không ghi rõ)"}
                                                        </td>
                                                        <td className="p-3 text-slate-400">
                                                            {slip.nguoi_tao_phieu?.ho_ten || "Quản trị viên"}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                                                                {details.length} món
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-right font-bold text-emerald-400">
                                                            {slipTotal.toLocaleString("vi-VN")} đ
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedSlip(slip);
                                                                    setSlipModalType("import");
                                                                }}
                                                                className="px-3 py-1 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600 hover:text-white transition-colors font-medium text-[11px]"
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* -------------------------------------------------------------
                        SUB-TAB 3.2: DANH SÁCH LỊCH SỬ PHIẾU XUẤT KHO
                    ------------------------------------------------------------- */}
                    {!loadingHistory && historySubTab === "exports" && (
                        <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Danh Sách Phiếu Xuất Kho Gần Đây
                            </h2>

                            {exportHistoryList.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-8">
                                    Chưa có phiếu xuất kho nào trong hệ thống.
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#141830] text-slate-400 uppercase font-semibold border-b border-white/[0.06]">
                                            <tr>
                                                <th className="p-3 w-16 text-center">Mã</th>
                                                <th className="p-3">Thời gian lập</th>
                                                <th className="p-3">Lý do xuất</th>
                                                <th className="p-3">Ghi chú</th>
                                                <th className="p-3">Người lập phiếu</th>
                                                <th className="p-3 text-center">Tổng xuất</th>
                                                <th className="p-3 text-center">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {exportHistoryList.map((slip) => {
                                                const details = slip.chi_tiet_phieu_xuat_khos || [];
                                                const totalExportQty = details.reduce(
                                                    (sum, d) => sum + (parseInt(d.so_luong, 10) || 0),
                                                    0
                                                );

                                                return (
                                                    <tr key={slip.id} className="hover:bg-white/[0.02]">
                                                        <td className="p-3 text-center font-bold text-amber-400">
                                                            #{slip.id}
                                                        </td>
                                                        <td className="p-3 text-slate-300">
                                                            {new Date(slip.created_at).toLocaleString("vi-VN")}
                                                        </td>
                                                        <td className="p-3 font-semibold text-white">
                                                            <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                                                {slip.ly_do}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-slate-400 max-w-xs truncate">
                                                            {slip.ghi_chu || "-"}
                                                        </td>
                                                        <td className="p-3 text-slate-400">
                                                            {slip.nguoi_tao_phieu?.ho_ten || "Quản trị viên"}
                                                        </td>
                                                        <td className="p-3 text-center font-bold text-rose-400">
                                                            {totalExportQty} cái
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedSlip(slip);
                                                                    setSlipModalType("export");
                                                                }}
                                                                className="px-3 py-1 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600 hover:text-white transition-colors font-medium text-[11px]"
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* -------------------------------------------------------------
                        SUB-TAB 3.3: BÁO CÁO TỒN KHO VÀ CẢNH BÁO
                    ------------------------------------------------------------- */}
                    {!loadingHistory && historySubTab === "inventory" && (
                        <div className="space-y-6">
                            {/* 4 THẺ THỐNG KÊ NHANH (STAT CARDS) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-4">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                        Tổng mặt hàng
                                    </span>
                                    <span className="text-2xl font-bold text-white mt-1 block">
                                        {inventoryData?.statistics?.total_products || 0}
                                    </span>
                                </div>

                                <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-4">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                        Tổng tồn kho (cái)
                                    </span>
                                    <span className="text-2xl font-bold text-violet-400 mt-1 block">
                                        {(
                                            inventoryData?.statistics?.total_stock_quantity || 0
                                        ).toLocaleString("vi-VN")}
                                    </span>
                                </div>

                                <div className="bg-[#0f1225] border border-rose-500/20 rounded-2xl p-4 bg-rose-950/10">
                                    <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider block">
                                        Đã hết hàng (0 tồn)
                                    </span>
                                    <span className="text-2xl font-bold text-rose-400 mt-1 block">
                                        {inventoryData?.statistics?.out_of_stock || 0}
                                    </span>
                                </div>

                                <div className="bg-[#0f1225] border border-rose-500/40 rounded-2xl p-4 bg-rose-950/20 shadow-lg shadow-rose-950/30">
                                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                        Cần nhập thêm (&lt; 20 cái)
                                    </span>
                                    <span className="text-2xl font-bold text-rose-400 mt-1 block">
                                        {inventoryData?.statistics?.need_import ?? inventoryData?.statistics?.low_stock ?? 0}
                                    </span>
                                </div>
                            </div>

                            {/* BẢNG SẢN PHẨM VÀ BỘ LỌC TỒN KHO */}
                            <div className="bg-[#0f1225] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                    {/* Ô tìm kiếm tên sản phẩm */}
                                    <div className="relative w-full sm:w-80">
                                        <input
                                            type="text"
                                            value={inventorySearch}
                                            onChange={(e) => setInventorySearch(e.target.value)}
                                            placeholder="Tìm theo tên sản phẩm hoặc mã #ID..."
                                            className="w-full bg-[#161a33] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    {/* Dropdown lọc tình trạng tồn kho */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            Lọc trạng thái:
                                        </span>
                                        <select
                                            value={stockFilter}
                                            onChange={(e) => setStockFilter(e.target.value)}
                                            className="bg-[#161a33] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                                        >
                                            <option value="all">Tất cả sản phẩm</option>
                                            <option value="need_import">⚠ Cần nhập thêm (&lt; 20 cái)</option>
                                            <option value="out">Đã hết hàng (0 cái)</option>
                                            <option value="in_stock">Còn nhiều hàng (&ge; 20 cái)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Bảng danh sách tồn kho */}
                                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#141830] text-slate-400 uppercase font-semibold border-b border-white/[0.06]">
                                            <tr>
                                                <th className="p-3 w-16 text-center">Mã</th>
                                                <th className="p-3">Tên sản phẩm</th>
                                                <th className="p-3">Danh mục</th>
                                                <th className="p-3">Thương hiệu</th>
                                                <th className="p-3 text-right">Giá bán</th>
                                                <th className="p-3 text-center">Tồn kho hiện có</th>
                                                <th className="p-3 text-center">Tình trạng</th>
                                                <th className="p-3 text-center w-28">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {filteredInventory.map((item) => {
                                                const stock = item.so_luong_ton ?? 0;
                                                const isOut = stock <= 0;
                                                const isNeedImport = stock < 20;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className={`hover:bg-white/[0.02] ${
                                                            isNeedImport ? "bg-rose-950/15" : ""
                                                        }`}
                                                    >
                                                        <td className="p-3 text-center font-bold text-slate-400">
                                                            #{item.id}
                                                        </td>
                                                        <td className="p-3 font-medium text-white">
                                                            {item.ten}
                                                        </td>
                                                        <td className="p-3 text-slate-400">
                                                            {item.danh_muc?.ten || "-"}
                                                        </td>
                                                        <td className="p-3 text-slate-400">
                                                            {item.thuong_hieu?.ten || "-"}
                                                        </td>
                                                        <td className="p-3 text-right text-slate-300">
                                                            {Number(item.gia || 0).toLocaleString("vi-VN")} đ
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span
                                                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                                                    isNeedImport
                                                                        ? "bg-rose-950/80 text-rose-300 border-rose-500 ring-1 ring-rose-500/60 shadow-sm shadow-rose-950/50"
                                                                        : "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                                                                }`}
                                                            >
                                                                {stock} cái
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            {isOut ? (
                                                                <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px] bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/60">
                                                                    ● Hết hàng (0)
                                                                </span>
                                                            ) : isNeedImport ? (
                                                                <span className="inline-flex items-center gap-1 text-rose-300 font-bold text-[11px] bg-rose-950/50 px-2.5 py-0.5 rounded border border-rose-800/60 animate-pulse">
                                                                    ⚠ Cần nhập thêm (&lt; 20)
                                                                </span>
                                                            ) : (
                                                                <span className="text-emerald-400 font-semibold text-[11px]">
                                                                    ✓ Còn hàng
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            {isNeedImport && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveTab("import");
                                                                        setAlertMessage(null);
                                                                        setImportItems([
                                                                            {
                                                                                san_pham_id: item.id,
                                                                                so_luong: Math.max(1, 20 - stock),
                                                                                gia: Number(item.gia || 0),
                                                                            },
                                                                        ]);
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-md shadow-rose-600/30 transition-all flex items-center gap-1 mx-auto"
                                                                    title="Bấm để chuyển sang tạo phiếu nhập hàng cho sản phẩm này"
                                                                >
                                                                    <span>📥</span> Nhập ngay
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================================
                MODAL XEM CHI TIẾT PHIẾU NHẬP / XUẤT (DETAIL MODAL)
            ========================================================================= */}
            {selectedSlip && slipModalType && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0f1225] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <span>{slipModalType === "import" ? "📥" : "📤"}</span>
                                Chi Tiết Phiếu {slipModalType === "import" ? "Nhập Kho" : "Xuất Kho"} #{selectedSlip.id}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedSlip(null);
                                    setSlipModalType(null);
                                }}
                                className="text-slate-400 hover:text-white text-lg p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Thông tin chung của phiếu */}
                        <div className="grid grid-cols-2 gap-3 text-xs bg-[#141830] p-3 rounded-xl border border-white/[0.06]">
                            <div>
                                <span className="text-slate-400">Thời gian tạo:</span>{" "}
                                <strong className="text-white">
                                    {new Date(selectedSlip.created_at).toLocaleString("vi-VN")}
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-400">Người lập:</span>{" "}
                                <strong className="text-white">
                                    {selectedSlip.nguoi_tao_phieu?.ho_ten || "Quản trị viên"}
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-400">
                                    {slipModalType === "import" ? "Nhà cung cấp:" : "Lý do xuất:"}
                                </span>{" "}
                                <strong className="text-white">
                                    {slipModalType === "import"
                                        ? selectedSlip.ten_nha_cung_cap || "(Không ghi)"
                                        : selectedSlip.ly_do}
                                </strong>
                            </div>
                            <div>
                                <span className="text-slate-400">Ghi chú:</span>{" "}
                                <span className="text-slate-300">
                                    {selectedSlip.ghi_chu || "(Không có)"}
                                </span>
                            </div>
                        </div>

                        {/* Danh sách các sản phẩm trong phiếu */}
                        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-[#141830] text-slate-400 uppercase font-semibold">
                                    <tr>
                                        <th className="p-2.5 w-12 text-center">#</th>
                                        <th className="p-2.5">Sản phẩm</th>
                                        <th className="p-2.5 w-24 text-center">Số lượng</th>
                                        {slipModalType === "import" && (
                                            <>
                                                <th className="p-2.5 w-32 text-right">Đơn giá</th>
                                                <th className="p-2.5 w-32 text-right">Thành tiền</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {(slipModalType === "import"
                                        ? selectedSlip.chi_tiet_phieu_nhap_khos || []
                                        : selectedSlip.chi_tiet_phieu_xuat_khos || []
                                    ).map((item, idx) => {
                                        const qty = parseInt(item.so_luong, 10) || 0;
                                        const price = parseFloat(item.gia) || 0;
                                        return (
                                            <tr key={idx}>
                                                <td className="p-2.5 text-center text-slate-500 font-medium">
                                                    {idx + 1}
                                                </td>
                                                <td className="p-2.5 font-medium text-white">
                                                    {item.san_pham?.ten || `Sản phẩm #${item.san_pham_id}`}
                                                </td>
                                                <td className="p-2.5 text-center font-bold text-violet-400">
                                                    {qty}
                                                </td>
                                                {slipModalType === "import" && (
                                                    <>
                                                        <td className="p-2.5 text-right text-slate-300">
                                                            {price.toLocaleString("vi-VN")} đ
                                                        </td>
                                                        <td className="p-2.5 text-right font-semibold text-emerald-400">
                                                            {(qty * price).toLocaleString("vi-VN")} đ
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Nhóm nút chân modal: Tải Excel phiếu & Đóng */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => exportSingleSlipToExcel(selectedSlip, slipModalType)}
                                className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                            >
                                <span>📊</span> Tải Excel Phiếu Này
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedSlip(null);
                                    setSlipModalType(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-semibold transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
