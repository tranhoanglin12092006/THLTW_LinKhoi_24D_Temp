"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sendContact } from "@/services/contactServices";

/**
 * Trang Liên hệ - Gửi góp ý & Yêu cầu hỗ trợ dành cho khách hàng TECHNOVA
 */
export default function ContactPage() {
    // Form state
    const [formData, setFormData] = useState({
        ten: "",
        email: "",
        so_dien_thoai: "",
        chu_de: "Góp ý chất lượng dịch vụ & sản phẩm",
        tieu_de_khac: "",
        noi_dung: "",
    });

    const [isCustomSubject, setIsCustomSubject] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
    const [isSentSuccess, setIsSentSuccess] = useState(false);

    // Tự động điền thông tin nếu khách hàng đã đăng nhập
    useEffect(() => {
        try {
            const rawUser = localStorage.getItem("user");
            if (rawUser) {
                const user = JSON.parse(rawUser);
                setFormData((prev) => ({
                    ...prev,
                    ten: prev.ten || user.name || user.ten || user.ho_ten || "",
                    email: prev.email || user.email || "",
                    so_dien_thoai: prev.so_dien_thoai || user.phone || user.so_dien_thoai || "",
                }));
            }
        } catch (e) {
            console.error("Lỗi đọc thông tin người dùng từ localStorage:", e);
        }
    }, []);

    // Danh sách chủ đề gợi ý
    const subjectOptions = [
        "Góp ý chất lượng dịch vụ & sản phẩm",
        "Yêu cầu hỗ trợ kỹ thuật / Bảo hành",
        "Thắc mắc về đơn hàng & Vận chuyển",
        "Tư vấn chọn mua sản phẩm công nghệ",
        "Báo giá đơn hàng doanh nghiệp",
        "Chủ đề khác (tự nhập)",
    ];

    const handleSubjectChange = (e) => {
        const val = e.target.value;
        if (val === "Chủ đề khác (tự nhập)") {
            setIsCustomSubject(true);
            setFormData({ ...formData, chu_de: val });
        } else {
            setIsCustomSubject(false);
            setFormData({ ...formData, chu_de: val, tieu_de_khac: "" });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý gửi biểu mẫu
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: "", message: "" });

        // Kiểm tra hợp lệ phía client
        if (!formData.ten.trim()) {
            setSubmitStatus({ type: "error", message: "Vui lòng nhập họ và tên của bạn." });
            return;
        }

        if (!formData.email.trim() || !formData.email.includes("@")) {
            setSubmitStatus({ type: "error", message: "Vui lòng nhập địa chỉ email hợp lệ để nhận phản hồi." });
            return;
        }

        if (!formData.noi_dung.trim()) {
            setSubmitStatus({ type: "error", message: "Vui lòng nhập nội dung chi tiết góp ý hoặc yêu cầu hỗ trợ." });
            return;
        }

        const finalTitle = isCustomSubject && formData.tieu_de_khac.trim()
            ? formData.tieu_de_khac.trim()
            : formData.chu_de;

        try {
            setSubmitting(true);
            const payload = {
                ten: formData.ten.trim(),
                email: formData.email.trim(),
                so_dien_thoai: formData.so_dien_thoai.trim() || null,
                tieu_de: finalTitle,
                noi_dung: formData.noi_dung.trim(),
            };

            const res = await sendContact(payload);

            setIsSentSuccess(true);
            setSubmitStatus({
                type: "success",
                message: res?.message || "Yêu cầu của bạn đã được gửi thành công! Quản trị viên sẽ phản hồi sớm nhất.",
            });

            // Reset form nội dung
            setFormData((prev) => ({
                ...prev,
                noi_dung: "",
                tieu_de_khac: "",
            }));
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu liên hệ:", error);
            const errMsg = error?.response?.data?.message || "Không thể gửi liên hệ vào lúc này. Vui lòng thử lại sau.";
            setSubmitStatus({ type: "error", message: errMsg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Đường dẫn điều hướng (Breadcrumb) */}
                <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        Liên hệ &amp; Góp ý
                    </span>
                </nav>

                {/* Banner Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-8 md:p-12 mb-10 shadow-xl shadow-blue-500/10">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-blue-100 mb-4">
                            ✦ Trung tâm chăm sóc khách hàng
                        </span>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                            Chúng tôi luôn lắng nghe bạn
                        </h1>
                        <p className="text-sm md:text-base text-blue-100 leading-relaxed">
                            Mỗi ý kiến đóng góp, thắc mắc hoặc yêu cầu hỗ trợ của bạn là động lực giúp TECHNOVA hoàn thiện và mang đến trải nghiệm mua sắm công nghệ tốt nhất.
                        </p>
                    </div>

                    {/* Họa tiết trang trí */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:flex items-center justify-center">
                        <svg className="w-96 h-96 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ & SHOWROOM (5 Cột) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Thẻ liên hệ chính */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-7 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </span>
                                Trụ sở &amp; Kênh liên lạc
                            </h2>

                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">Địa chỉ văn phòng</div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                                            Tầng 5, Tòa nhà TECHNOVA Tower, Số 123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh
                                        </div>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">Tổng đài hỗ trợ (Miễn phí)</div>
                                        <a href="tel:18006868" className="text-blue-600 dark:text-blue-400 text-base font-bold hover:underline block mt-0.5">
                                            1800 6868
                                        </a>
                                        <span className="text-[11px] text-slate-400">8:00 - 21:30 (Tất cả các ngày)</span>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">Hòm thư điện tử</div>
                                        <a href="mailto:support@technova.vn" className="text-slate-600 dark:text-slate-300 text-xs hover:text-blue-600 block mt-0.5">
                                            support@technova.vn
                                        </a>
                                        <span className="text-[11px] text-slate-400">Tiếp nhận &amp; phản hồi trong 24 giờ làm việc</span>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">Thời gian làm việc</div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                            Thứ Hai - Thứ Bảy: 08:00 - 21:30<br />
                                            Chủ Nhật &amp; Ngày lễ: 09:00 - 18:00
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Thẻ cam kết dịch vụ */}
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-900/50 shadow-md">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
                                <span>🛡️</span> Cam kết dịch vụ TECHNOVA
                            </h3>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    <span>Tiếp nhận và xử lý mọi phản ánh trong 24 giờ.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    <span>Đội ngũ kỹ thuật viên chuyên sâu sẵn sàng trợ giúp.</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                                    <span>Bảo mật tuyệt đối thông tin cá nhân của khách hàng.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CỘT PHẢI: FORM GỬI GÓP Ý / YÊU CẦU HỖ TRỢ (7 Cột) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                            <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Gửi góp ý &amp; Yêu cầu hỗ trợ
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Vui lòng điền thông tin chi tiết dưới đây. Đội ngũ quản trị viên TECHNOVA sẽ xem xét và phản hồi sớm nhất.
                                </p>
                            </div>

                            {/* Thông báo trạng thái */}
                            {submitStatus.message && (
                                <div
                                    className={`p-4 rounded-xl text-sm mb-6 flex items-start gap-3 ${
                                        submitStatus.type === "success"
                                            ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                                            : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                                    }`}
                                >
                                    <span className="text-lg flex-shrink-0">
                                        {submitStatus.type === "success" ? "✅" : "⚠️"}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {submitStatus.type === "success" ? "Gửi thành công!" : "Có lỗi xảy ra"}
                                        </p>
                                        <p className="text-xs mt-0.5 opacity-90">{submitStatus.message}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSubmitStatus({ type: "", message: "" })}
                                        className="text-xs font-bold opacity-60 hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {isSentSuccess ? (
                                <div className="text-center py-10 px-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-emerald-500/10">
                                        ✓
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        Cảm ơn bạn đã gửi ý kiến!
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                        Ý kiến hoặc yêu cầu hỗ trợ của bạn đã được chuyển tới ban quản trị TECHNOVA. Chúng tôi sẽ phản hồi trực tiếp qua email hoặc số điện thoại của bạn.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSentSuccess(false);
                                            setSubmitStatus({ type: "", message: "" });
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                                    >
                                        <span>Gửi thêm yêu cầu khác</span>
                                        <span>→</span>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Họ và tên */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Họ và tên <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="ten"
                                                required
                                                value={formData.ten}
                                                onChange={handleChange}
                                                placeholder="VD: Nguyễn Văn A"
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>

                                        {/* Địa chỉ Email */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Địa chỉ Email <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="VD: nguyenvana@gmail.com"
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Số điện thoại */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Số điện thoại liên hệ
                                            </label>
                                            <input
                                                type="tel"
                                                name="so_dien_thoai"
                                                value={formData.so_dien_thoai}
                                                onChange={handleChange}
                                                placeholder="VD: 0912 345 678"
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>

                                        {/* Chủ đề / Phân loại yêu cầu */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Chủ đề yêu cầu <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                value={formData.chu_de}
                                                onChange={handleSubjectChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                            >
                                                {subjectOptions.map((opt) => (
                                                    <option key={opt} value={opt} className="bg-white dark:bg-slate-900">
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Nhập tiêu đề tự do nếu chọn chủ đề khác */}
                                    {isCustomSubject && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Tiêu đề tùy chỉnh <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="tieu_de_khac"
                                                required={isCustomSubject}
                                                value={formData.tieu_de_khac}
                                                onChange={handleChange}
                                                placeholder="Nhập tiêu đề tóm tắt yêu cầu..."
                                                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                    )}

                                    {/* Nội dung chi tiết */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Nội dung chi tiết <span className="text-rose-500">*</span>
                                            </label>
                                            <span className="text-[10px] text-slate-400">
                                                {formData.noi_dung.length}/5000 ký tự
                                            </span>
                                        </div>
                                        <textarea
                                            name="noi_dung"
                                            required
                                            rows={5}
                                            maxLength={5000}
                                            value={formData.noi_dung}
                                            onChange={handleChange}
                                            placeholder="Mô tả chi tiết câu hỏi, ý kiến đóng góp hoặc vấn đề bạn cần được hỗ trợ..."
                                            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                                        />
                                    </div>

                                    {/* Nút gửi form */}
                                    <div className="pt-2 flex items-center justify-between gap-4">
                                        <p className="text-[11px] text-slate-400">
                                            🔒 Thông tin của bạn được bảo mật tuyệt đối.
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                                        >
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                    </svg>
                                                    <span>Đang gửi yêu cầu...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Gửi phản hồi / Yêu cầu</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
