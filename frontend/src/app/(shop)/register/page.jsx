"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authServices";

/**
 * =========================================================================
 * TRANG ĐĂNG KÝ TÀI KHOẢN (REGISTER PAGE)
 * Bám sát cấu trúc tranhoanglin-frontend, code rõ ràng, có chú thích chi tiết
 * =========================================================================
 */
export default function RegisterPage() {
    const router = useRouter();

    // 1. Quản lý dữ liệu người dùng nhập vào form
    const [formData, setFormData] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: "",
        mat_khau: "",
        mat_khau_confirmation: "",
        agree_terms: true,
    });

    // 2. Trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3. Trạng thái xử lý form: đang tải, thông báo lỗi, thông báo thành công
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    /**
     * 4. Hàm kiểm tra độ mạnh của mật khẩu theo thời gian thực
     * Trả về thông số: điểm số, nhãn hiển thị, màu sắc và phần trăm thanh tiến trình
     */
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, text: "Chưa nhập", color: "bg-slate-300 dark:bg-slate-700", width: "0%" };
        if (pass.length < 6) return { score: 1, text: "Rất yếu (Dưới 6 ký tự)", color: "bg-rose-500", width: "25%" };

        let score = 1;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 2) {
            return { score: 2, text: "Yếu (Cần từ 8 ký tự)", color: "bg-amber-500", width: "50%" };
        } else if (score === 3 || score === 4) {
            return { score: 3, text: "Trung bình (Khá an toàn)", color: "bg-blue-500", width: "75%" };
        } else {
            return { score: 4, text: "Rất mạnh (Bảo mật cao)", color: "bg-emerald-500", width: "100%" };
        }
    };

    const passwordStrength = getPasswordStrength(formData.mat_khau);

    // 5. Xử lý khi người dùng gõ vào các ô input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Tự động xóa lỗi của trường đó khi người dùng bắt đầu sửa
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    // 6. Xử lý khi nhấn nút "Tạo tài khoản" (Submit Form)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setFieldErrors({});
        setSuccessMessage("");

        // ===== BƯỚC 1: VALIDATE DỮ LIỆU PHÍA CLIENT =====
        if (!formData.ho_ten.trim()) {
            setErrorMessage("Vui lòng nhập họ và tên của bạn.");
            return;
        }

        if (!formData.email.trim()) {
            setErrorMessage("Vui lòng nhập địa chỉ email.");
            return;
        }

        if (formData.mat_khau.length < 8) {
            setErrorMessage("Mật khẩu phải có tối thiểu 8 ký tự để bảo mật an toàn.");
            return;
        }

        if (formData.mat_khau !== formData.mat_khau_confirmation) {
            setErrorMessage("Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.");
            return;
        }

        if (!formData.agree_terms) {
            setErrorMessage("Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật.");
            return;
        }

        // ===== BƯỚC 2: GỬI YÊU CẦU ĐẾN BACKEND API =====
        try {
            setLoading(true);

            // Chuẩn bị payload bám sát RegisterRequest của Laravel Backend
            const payload = {
                ho_ten: formData.ho_ten.trim(),
                email: formData.email.trim(),
                so_dien_thoai: formData.so_dien_thoai.trim() || null,
                dia_chi: formData.dia_chi.trim() || null,
                mat_khau: formData.mat_khau,
                mat_khau_confirmation: formData.mat_khau_confirmation,
            };

            // Gọi API đăng ký qua authServices
            const response = await registerUser(payload);

            // Thông báo thành công
            setSuccessMessage("✓ Đăng ký tài khoản thành công! Đang chuyển hướng...");

            // Lưu token và thông tin người dùng vào localStorage (nếu backend trả về)
            if (response?.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("access_token", response.token);
            }
            if (response?.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
            }

            // Tự động chuyển hướng sau 1.5 giây
            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);

            // Bắt lỗi validation trả về từ Laravel (mã 422)
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                setFieldErrors(errors);

                // Lấy thông báo lỗi đầu tiên để hiển thị cho người dùng
                const firstErrorKey = Object.keys(errors)[0];
                const firstErrorMessage = errors[firstErrorKey][0];
                setErrorMessage(firstErrorMessage || "Thông tin nhập vào chưa hợp lệ, vui lòng kiểm tra lại.");
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-[calc(100vh-140px)]">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">

                {/* Vệt sáng trang trí nền */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* =========================================================================
                    1. HEADER FORM ĐĂNG KÝ
                ========================================================================= */}
                <div className="text-center space-y-2 relative">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Tạo tài khoản mới
                    </h1>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gia nhập cộng đồng <strong className="text-blue-600 dark:text-blue-400 font-bold">TECHNOVA</strong> để nhận ngập tràn ưu đãi
                    </p>
                </div>

                {/* =========================================================================
                    2. THÔNG BÁO LỖI HOẶC THÀNH CÔNG
                ========================================================================= */}
                {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-shake">
                        <span className="text-sm leading-none mt-0.5">⚠️</span>
                        <div className="flex-1 font-medium">{errorMessage}</div>
                    </div>
                )}

                {successMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
                        <span className="text-sm">✓</span>
                        <div className="flex-1 font-semibold">{successMessage}</div>
                    </div>
                )}

                {/* =========================================================================
                    3. FORM ĐIỀN THÔNG TIN ĐĂNG KÝ
                ========================================================================= */}
                <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>

                    {/* HỌ VÀ TÊN */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[11px]">
                            Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </span>
                            <input
                                type="text"
                                name="ho_ten"
                                value={formData.ho_ten}
                                onChange={handleChange}
                                placeholder="Ví dụ: Nguyễn Văn An"
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${fieldErrors.ho_ten ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                            />
                        </div>
                        {fieldErrors.ho_ten && (
                            <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.ho_ten[0]}</p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[11px]">
                            Địa chỉ Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${fieldErrors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                            />
                        </div>
                        {fieldErrors.email && (
                            <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.email[0]}</p>
                        )}
                    </div>

                    {/* SỐ ĐIỆN THOẠI */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[11px]">
                            Số điện thoại
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            </span>
                            <input
                                type="tel"
                                name="so_dien_thoai"
                                value={formData.so_dien_thoai}
                                onChange={handleChange}
                                placeholder="0987 654 321"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all"
                            />
                        </div>
                        {fieldErrors.so_dien_thoai && (
                            <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.so_dien_thoai[0]}</p>
                        )}
                    </div>

                    {/* MẬT KHẨU */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[11px]">
                            Mật khẩu <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="mat_khau"
                                value={formData.mat_khau}
                                onChange={handleChange}
                                placeholder="Tối thiểu 8 ký tự"
                                required
                                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${fieldErrors.mat_khau ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                            />
                            {/* Nút bật/tắt hiển thị mật khẩu */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>

                        {/* Thanh đo độ mạnh mật khẩu */}
                        {formData.mat_khau && (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>Độ mạnh mật khẩu:</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {passwordStrength.text}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: passwordStrength.width }}
                                    />
                                </div>
                            </div>
                        )}
                        {fieldErrors.mat_khau && (
                            <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.mat_khau[0]}</p>
                        )}
                    </div>

                    {/* XÁC NHẬN MẬT KHẨU */}
                    <div>
                        <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[11px]">
                            Xác nhận mật khẩu <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/></svg>
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="mat_khau_confirmation"
                                value={formData.mat_khau_confirmation}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu ở trên"
                                required
                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all"
                            />
                            {/* Nút bật/tắt hiển thị xác nhận mật khẩu */}
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                                title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>

                        {/* Báo lỗi nếu 2 mật khẩu không khớp */}
                        {formData.mat_khau_confirmation && formData.mat_khau !== formData.mat_khau_confirmation && (
                            <p className="text-[10px] text-rose-500 mt-1">
                                ✕ Mật khẩu xác nhận chưa trùng khớp
                            </p>
                        )}
                        {formData.mat_khau_confirmation && formData.mat_khau === formData.mat_khau_confirmation && (
                            <p className="text-[10px] text-emerald-500 mt-1">
                                ✓ Mật khẩu xác nhận trùng khớp
                            </p>
                        )}
                    </div>

                    {/* ĐIỀU KHOẢN VÀ CHÍNH SÁCH */}
                    <div className="flex items-start pt-1">
                        <input
                            type="checkbox"
                            id="agree_terms"
                            name="agree_terms"
                            checked={formData.agree_terms}
                            onChange={handleChange}
                            required
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 mt-0.5 cursor-pointer"
                        />
                        <label
                            htmlFor="agree_terms"
                            className="ml-2.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer leading-relaxed"
                        >
                            Tôi đồng ý với{" "}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold underline">
                                Điều khoản dịch vụ
                            </span>{" "}
                            và{" "}
                            <span className="text-blue-600 dark:text-blue-400 font-semibold underline">
                                Chính sách bảo mật
                            </span>{" "}
                            của TECHNOVA.
                        </label>
                    </div>

                    {/* NÚT SUBMIT TẠO TÀI KHOẢN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang xử lý đăng ký...</span>
                            </>
                        ) : (
                            <span>Đăng ký tài khoản</span>
                        )}
                    </button>
                </form>

                {/* =========================================================================
                    4. LIÊN KẾT ĐẾN TRANG ĐĂNG NHẬP
                ========================================================================= */}
                <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Đã có tài khoản?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </main>
    );
}