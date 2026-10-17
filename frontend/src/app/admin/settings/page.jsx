"use client";

import { useState, useEffect } from "react";
import { getSettings, saveSettingsBulk } from "@/services/settingServices";

/**
 * =========================================================================
 * TRANG QUẢN LÝ CẤU HÌNH HỆ THỐNG (ADMIN SETTINGS)
 * Thiết kế giao diện Dark Luxury đồng bộ TECHNOVA Dashboard
 * Phân chia các tab chuyên nghiệp:
 *  - 1. Thông tin chung (Tên website, Slogan, Logo, Copyright)
 *  - 2. Liên hệ & Hỗ trợ (Hotline, Email, Địa chỉ, Bản đồ)
 *  - 3. Mạng xã hội & Kênh truyền thông (Facebook, YouTube, TikTok, Zalo)
 *  - 4. SEO & Tìm kiếm (Meta Description, Meta Keywords, Google Analytics)
 *  - 5. Trạng thái hệ thống (Bảo trì website, Cho phép đặt hàng)
 * =========================================================================
 */
export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Form data state lưu trữ các khóa cấu hình
    const [formData, setFormData] = useState({
        // 1. Chung
        site_name: "",
        site_slogan: "",
        site_logo: "",
        site_favicon: "",
        copyright: "",

        // 2. Liên hệ
        hotline: "",
        email_contact: "",
        address: "",
        work_time: "",

        // 3. Mạng xã hội
        facebook: "",
        youtube: "",
        tiktok: "",
        zalo: "",

        // 4. SEO
        meta_description: "",
        meta_keywords: "",

        // 5. Hệ thống
        maintenance_mode: "0",
        order_enabled: "1",
    });

    // 1. Tải danh sách cấu hình từ Backend API
    const loadSettings = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const res = await getSettings();

            if (res?.map) {
                setFormData((prev) => ({
                    ...prev,
                    ...res.map,
                }));
            } else if (Array.isArray(res?.data)) {
                const map = {};
                res.data.forEach((item) => {
                    map[item.khoa] = item.gia_tri;
                });
                setFormData((prev) => ({
                    ...prev,
                    ...map,
                }));
            }
        } catch (error) {
            console.error("Lỗi khi tải cấu hình:", error);
            setErrorMessage("Không thể kết nối đến máy chủ để lấy thông tin cấu hình.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    // 2. Cập nhật giá trị ô nhập
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
        }));
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    // 3. Xử lý lưu cấu hình (Gửi POST /api/settings)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setSuccessMessage("");
            setErrorMessage("");

            await saveSettingsBulk(formData);

            setSuccessMessage("✓ Cập nhật toàn bộ cấu hình hệ thống thành công!");
            // Tự động ẩn thông báo sau 4 giây
            setTimeout(() => {
                setSuccessMessage("");
            }, 4000);
        } catch (error) {
            console.error("Lỗi khi lưu cấu hình:", error);
            setErrorMessage("Lỗi khi lưu cấu hình: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    // Danh sách các Tab cấu hình
    const tabs = [
        { id: "general", label: "Thông tin chung", icon: "🏢" },
        { id: "contact", label: "Liên hệ & Hỗ trợ", icon: "📞" },
        { id: "social", label: "Mạng xã hội", icon: "🌐" },
        { id: "seo", label: "Cấu hình SEO", icon: "🔍" },
        { id: "system", label: "Trạng thái hệ thống", icon: "⚙️" },
    ];

    return (
        <div className="space-y-6">

            {/* HEADER TIÊU ĐỀ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                            ⚙️
                        </span>
                        Quản Lý Cấu Hình Hệ Thống
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Tùy chỉnh thông tin cửa hàng, hotline, mạng xã hội, thẻ meta SEO và trạng thái hoạt động website.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={loadSettings}
                        disabled={loading || saving}
                        className="px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <span>🔄</span> Làm mới
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || saving}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                            saving
                                ? "bg-violet-600/70 cursor-not-allowed opacity-80"
                                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/25 active:scale-95"
                        }`}
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin text-sm">⏳</span>
                                <span>Đang lưu cấu hình...</span>
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                <span>Lưu tất cả thay đổi</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* THÔNG BÁO THÀNH CÔNG / THẤT BẠI */}
            {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-3 animate-fadeIn">
                    <span className="text-base font-bold">✓</span>
                    <span className="font-semibold">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-3 animate-fadeIn">
                    <span className="text-base font-bold">⚠️</span>
                    <span className="font-semibold">{errorMessage}</span>
                </div>
            )}

            {/* THANH ĐIỀU HƯỚNG TAB */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.06] no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === tab.id
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-400/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* KHỐI NỘI DUNG FORM CHÍNH */}
            {loading ? (
                <div className="p-16 rounded-3xl bg-[#0c0e1e]/60 border border-white/[0.06] text-center text-slate-400 text-xs">
                    <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
                    <p>Đang nạp dữ liệu cấu hình hệ thống...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* =========================================================================
                        TAB 1: THÔNG TIN CHUNG
                    ========================================================================= */}
                    {activeTab === "general" && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e1e]/80 border border-white/[0.08] backdrop-blur-xl space-y-6">
                            <div className="border-b border-white/[0.06] pb-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    🏢 Cấu Hình Thông Tin Chung Website
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Tên thương hiệu, khẩu hiệu hoạt động và bản quyền hiển thị trên Header / Footer.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tên Website */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Tên Website / Thương hiệu <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="site_name"
                                        value={formData.site_name || ""}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: TECHNOVA - Siêu Thị Thiết Bị Điện Tử"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    <span className="text-[11px] text-slate-500">Hiển thị trên thanh tiêu đề trình duyệt và logo chữ.</span>
                                </div>

                                {/* Slogan */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Khẩu hiệu (Slogan)
                                    </label>
                                    <input
                                        type="text"
                                        name="site_slogan"
                                        value={formData.site_slogan || ""}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: Công nghệ dẫn đầu - Trải nghiệm đỉnh cao"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Đường dẫn Logo */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Đường dẫn Logo (Image URL)
                                    </label>
                                    <input
                                        type="text"
                                        name="site_logo"
                                        value={formData.site_logo || ""}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    {formData.site_logo && (
                                        <div className="mt-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] inline-flex items-center gap-3">
                                            <img
                                                src={formData.site_logo}
                                                alt="Logo Preview"
                                                className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1"
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                            <span className="text-[11px] text-slate-400">Xem trước Logo</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bản quyền Footer */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Nội dung Bản quyền (Copyright)
                                    </label>
                                    <input
                                        type="text"
                                        name="copyright"
                                        value={formData.copyright || ""}
                                        onChange={handleChange}
                                        placeholder="© 2026 TECHNOVA. Tất cả các quyền được bảo lưu."
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    <span className="text-[11px] text-slate-500">Hiển thị ở dòng chân trang (Footer).</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 2: LIÊN HỆ & HỖ TRỢ KHÁCH HÀNG
                    ========================================================================= */}
                    {activeTab === "contact" && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e1e]/80 border border-white/[0.08] backdrop-blur-xl space-y-6">
                            <div className="border-b border-white/[0.06] pb-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    📞 Kênh Liên Hệ & Hỗ Trợ Khách Hàng
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Các thông tin Hotline, Email chăm sóc khách hàng và Trụ sở chính.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Hotline */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Hotline Hỗ Trợ 24/7 <span className="text-rose-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="hotline"
                                        value={formData.hotline || ""}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: 1800 6868"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    <span className="text-[11px] text-slate-500">Hiển thị trên Topbar và trang liên hệ.</span>
                                </div>

                                {/* Email Liên hệ */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Email Chăm Sóc Khách Hàng
                                    </label>
                                    <input
                                        type="email"
                                        name="email_contact"
                                        value={formData.email_contact || ""}
                                        onChange={handleChange}
                                        placeholder="cskh@technova.vn"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Giờ làm việc */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Thời Gian Phục Vụ
                                    </label>
                                    <input
                                        type="text"
                                        name="work_time"
                                        value={formData.work_time || ""}
                                        onChange={handleChange}
                                        placeholder="08:00 - 22:00 (Tất cả các ngày trong tuần)"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Địa chỉ trụ sở */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Địa Chỉ Trụ Sở Chính
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleChange}
                                        placeholder="Tầng 5, Tòa nhà Bitexco, Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 3: MẠNG XÃ HỘI
                    ========================================================================= */}
                    {activeTab === "social" && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e1e]/80 border border-white/[0.08] backdrop-blur-xl space-y-6">
                            <div className="border-b border-white/[0.06] pb-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    🌐 Liên Kết Mạng Xã Hội
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Đường dẫn tới các kênh truyền thông chính thức của TECHNOVA ở chân trang.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Facebook */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className="text-blue-400">📘</span> Facebook Fanpage
                                    </label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.facebook || ""}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/technovavn"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* YouTube */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className="text-rose-500">▶️</span> Kênh YouTube
                                    </label>
                                    <input
                                        type="url"
                                        name="youtube"
                                        value={formData.youtube || ""}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/@technova"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* TikTok */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className="text-cyan-400">🎵</span> Kênh TikTok
                                    </label>
                                    <input
                                        type="url"
                                        name="tiktok"
                                        value={formData.tiktok || ""}
                                        onChange={handleChange}
                                        placeholder="https://tiktok.com/@technova"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Zalo OA */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className="text-blue-500">💬</span> Zalo Official Account
                                    </label>
                                    <input
                                        type="text"
                                        name="zalo"
                                        value={formData.zalo || ""}
                                        onChange={handleChange}
                                        placeholder="https://zalo.me/0901234567"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 4: CẤU HÌNH SEO
                    ========================================================================= */}
                    {activeTab === "seo" && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e1e]/80 border border-white/[0.08] backdrop-blur-xl space-y-6">
                            <div className="border-b border-white/[0.06] pb-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    🔍 Tối Ưu Hóa Tìm Kiếm (SEO Metadata)
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Cấu hình các thẻ meta mặc định phục vụ công cụ tìm kiếm Google, Bing và chia sẻ Facebook OpenGraph.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Meta Description */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Mô Tả Trang Chủ (Meta Description)
                                    </label>
                                    <textarea
                                        rows={3}
                                        name="meta_description"
                                        value={formData.meta_description || ""}
                                        onChange={handleChange}
                                        placeholder="TECHNOVA - Hệ thống bán lẻ thiết bị điện tử, smartphone, laptop, phụ kiện chính hãng giá tốt nhất..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                                    />
                                    <div className="flex justify-between text-[11px] text-slate-500">
                                        <span>Khuyến nghị độ dài: 120 - 160 ký tự.</span>
                                        <span>Đã nhập: {formData.meta_description?.length || 0} ký tự</span>
                                    </div>
                                </div>

                                {/* Meta Keywords */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Từ Khóa SEO (Meta Keywords)
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_keywords"
                                        value={formData.meta_keywords || ""}
                                        onChange={handleChange}
                                        placeholder="technova, smartphone, iphone, macbook, tai nghe, sony, ban le dien tu"
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                    <span className="text-[11px] text-slate-500">Phân tách các từ khóa bằng dấu phẩy (,).</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================================
                        TAB 5: TRẠNG THÁI HỆ THỐNG
                    ========================================================================= */}
                    {activeTab === "system" && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0e1e]/80 border border-white/[0.08] backdrop-blur-xl space-y-6">
                            <div className="border-b border-white/[0.06] pb-4">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    ⚙️ Trạng Thái Hoạt Động Của Hệ Thống
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Kiểm soát bật/tắt chế độ bảo trì và các quyền truy cập mua hàng trên toàn hệ thống.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Chế độ bảo trì */}
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                            <span>🚧</span> Chế Độ Bảo Trì Website (Maintenance Mode)
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Khi kích hoạt, chỉ quản trị viên mới có thể truy cập cửa hàng. Khách hàng sẽ thấy trang thông báo bảo trì.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="maintenance_mode"
                                            checked={formData.maintenance_mode === "1"}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>

                                {/* Cho phép đặt hàng */}
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-white flex items-center gap-2">
                                            <span>🛒</span> Cho Phép Khách Hàng Đặt Hàng Mới
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Tạm ngưng nhận đơn hàng mới trong trường hợp kiểm kho hoặc dịp lễ tết dài ngày.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="order_enabled"
                                            checked={formData.order_enabled === "1"}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NÚT LƯU CỐ ĐỊNH Ở DƯỚI FORM */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-8 py-3.5 rounded-xl font-bold text-xs text-white shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
                                saving
                                    ? "bg-violet-600/70 cursor-not-allowed opacity-80"
                                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30 active:scale-95"
                            }`}
                        >
                            {saving ? (
                                <>
                                    <span className="animate-spin text-sm">⏳</span>
                                    <span>Đang tiến hành lưu...</span>
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    <span>Lưu Toàn Bộ Cấu Hình</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            )}

        </div>
    );
}
