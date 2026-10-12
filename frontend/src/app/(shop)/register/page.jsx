"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authServices";

/**
 * =========================================================================
 * TRANG ĐĂNG KÝ TÀI KHOẢN CAO CẤP (FLAGSHIP TECHNOVA REGISTER)
 * Thiết kế phong cách Glassmorphism hiện đại, giao diện Split-Screen 2 cột
 * Tích hợp đặc quyền thành viên VIP, kiểm tra mật khẩu realtime và tối ưu UX
 * =========================================================================
 */
export default function RegisterPage() {
    const router = useRouter();

    // 1. Quản lý thông tin người dùng nhập vào Form
    const [formData, setFormData] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        mat_khau: "",
        mat_khau_confirmation: "",
        agree_terms: true,
    });

    // 2. Trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 3. Trạng thái xử lý form: Loading, Lỗi, Thành công
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    /**
     * 4. Hàm kiểm tra độ mạnh của mật khẩu theo thời gian thực
     * Trả về điểm số, mô tả, màu sắc và độ dài thanh phần trăm
     */
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, text: "Chưa nhập", color: "bg-slate-300 dark:bg-slate-700", width: "0%" };
        if (pass.length < 6) return { score: 1, text: "Rất yếu", color: "bg-rose-500", width: "25%" };

        let score = 1;
        if (pass.length >= 8) score++;
        if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 10) score++;

        if (score <= 2) {
            return { score: 2, text: "Yếu (Cần ít nhất 8 ký tự)", color: "bg-amber-500", width: "50%" };
        } else if (score === 3) {
            return { score: 3, text: "Trung bình (Khá an toàn)", color: "bg-blue-500", width: "75%" };
        } else {
            return { score: 4, text: "Rất mạnh (Bảo mật tối đa)", color: "bg-emerald-500", width: "100%" };
        }
    };

    const passwordStrength = getPasswordStrength(formData.mat_khau);

    // Kiểm tra các tiêu chí mật khẩu trực quan
    const hasMinLength = formData.mat_khau.length >= 8;
    const hasLetterAndNumber = /[A-Za-z]/.test(formData.mat_khau) && /[0-9]/.test(formData.mat_khau);
    const isPasswordMatched = formData.mat_khau && formData.mat_khau === formData.mat_khau_confirmation;

    // 5. Xử lý thay đổi dữ liệu trong các ô nhập
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: null }));
        }
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    // 6. Xử lý Đăng ký với Google / Facebook (Mock)
    const handleSocialAuth = (provider) => {
        alert(`Tính năng đăng ký nhanh qua ${provider} đang được phát triển trong phiên bản tiếp theo!`);
    };

    // 7. Xử lý gửi Form Đăng ký (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setFieldErrors({});
        setSuccessMessage("");

        // Kiểm tra dữ liệu bắt buộc phía Client
        if (!formData.ho_ten.trim()) {
            setErrorMessage("Vui lòng nhập họ và tên của bạn.");
            return;
        }

        if (!formData.email.trim()) {
            setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
            return;
        }

        if (formData.mat_khau.length < 8) {
            setErrorMessage("Mật khẩu phải chứa ít nhất 8 ký tự để đảm bảo an toàn.");
            return;
        }

        if (formData.mat_khau !== formData.mat_khau_confirmation) {
            setErrorMessage("Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.");
            return;
        }

        if (!formData.agree_terms) {
            setErrorMessage("Vui lòng tích chọn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
            return;
        }

        try {
            setLoading(true);

            // Gửi dữ liệu lên API Backend Laravel
            const payload = {
                ho_ten: formData.ho_ten.trim(),
                email: formData.email.trim(),
                so_dien_thoai: formData.so_dien_thoai.trim() || null,
                mat_khau: formData.mat_khau,
                mat_khau_confirmation: formData.mat_khau_confirmation,
            };

            const response = await registerUser(payload);

            // Báo thành công
            setSuccessMessage("✓ Chúc mừng bạn đã đăng ký tài khoản thành công! Đang chuyển hướng...");

            // Lưu token và user vào localStorage
            if (response?.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("access_token", response.token);
            }
            if (response?.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
            }

            // Bắn event để Header lập tức cập nhật thông tin người dùng
            window.dispatchEvent(new Event("userUpdated"));

            // Tự động chuyển hướng về trang chủ
            setTimeout(() => {
                router.push("/");
            }, 1800);

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                setFieldErrors(errors);
                const firstKey = Object.keys(errors)[0];
                setErrorMessage(errors[firstKey][0] || "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-[calc(100vh-120px)] flex items-center justify-center py-10 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-[#090b16] dark:to-slate-950 overflow-hidden">

            {/* VỆT SÁNG NGHỆ THUẬT NỀN (AMBIENT GLOWS) */}
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

                    {/* =========================================================================
                        CỘT TRÁI: SHOWCASE ĐẶC QUYỀN THÀNH VIÊN VIP TECHNOVA
                    ========================================================================= */}
                    <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-950/95 border border-white/[0.1] text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                        
                        {/* Họa tiết trang trí ánh sao */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            {/* Huy hiệu thương hiệu */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                                ✦ TECHNOVA VIP CLUB 2026
                            </div>

                            {/* Tiêu đề đặc quyền */}
                            <h2 className="text-3xl font-black tracking-tight leading-tight">
                                Khởi đầu hành trình <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                                    công nghệ tương lai
                                </span>
                            </h2>

                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Đăng ký thành viên TECHNOVA để mở khóa toàn bộ quyền lợi mua sắm thiết bị chính hãng, bảo hành mở rộng và các ưu đãi thành viên độc quyền.
                            </p>

                            {/* Danh sách 4 đặc quyền lớn */}
                            <div className="space-y-3.5 pt-2">
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 text-sm">
                                        🎁
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Voucher 500.000đ Chào Mừng</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Tặng ngay mã giảm giá áp dụng trực tiếp cho đơn hàng đầu tiên.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0 text-sm">
                                        🛡️
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Bảo Hành Kim Cương 1 Đổi 1</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Đổi mới nguyên seal trong 30 ngày nếu lỗi kỹ thuật từ nhà sản xuất.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 text-sm">
                                        ⚡
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Giao Hỏa Tốc 2H Miễn Phí</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Nhận hàng siêu tốc nội thành và freeship toàn quốc trọn đời.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 text-sm">
                                        💎
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Tích Điểm TECH-POINT 5%</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Hoàn tiền tích lũy sử dụng trừ thẳng vào lần mua sắm tiếp theo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thẻ đánh giá khách hàng bên dưới */}
                        <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex -space-x-2">
                                    <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                                    <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                                    <img className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Avatar" />
                                </div>
                                <div className="text-[11px]">
                                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                                    <span className="text-slate-400 font-medium">50,000+ tín đồ công nghệ</span>
                                </div>
                            </div>

                            <span className="text-[11px] font-bold text-blue-400">4.9 / 5.0 ⭐</span>
                        </div>
                    </div>

                    {/* =========================================================================
                        CỘT PHẢI: FORM ĐĂNG KÝ THÔNG MINH HIỆN ĐẠI
                    ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between">
                        
                        {/* Header của Form */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Đăng ký tài khoản
                                </h1>
                                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                                    Nhanh & Bảo mật
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Nhập thông tin để tạo tài khoản TECHNOVA chỉ trong 30 giây.
                            </p>
                        </div>

                        {/* Social Login Buttons (Google & Facebook) */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialAuth("Google")}
                                className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                                </svg>
                                <span>Tiếp tục với Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialAuth("Facebook")}
                                className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                <svg className="w-4 h-4 text-blue-600 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Tiếp tục với Facebook</span>
                            </button>
                        </div>

                        {/* Đường phân cách */}
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 absolute">
                                Hoặc bằng Email
                            </span>
                        </div>

                        {/* Hộp cảnh báo lỗi */}
                        {errorMessage && (
                            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-shake">
                                <span className="text-sm leading-none mt-0.5">⚠️</span>
                                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                            </div>
                        )}

                        {/* Hộp thông báo thành công */}
                        {successMessage && (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
                                <span className="text-sm">✓</span>
                                <div className="flex-1 font-semibold leading-relaxed">{successMessage}</div>
                            </div>
                        )}

                        {/* =========================================================================
                            FORM ĐIỀN THÔNG TIN CHI TIẾT
                        ========================================================================= */}
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>

                            {/* HÀNG 1: HỌ VÀ TÊN & SỐ ĐIỆN THOẠI (BỐ TRÍ 2 CỘT GỌN GÀNG) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[10px]">
                                        Họ và tên <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </span>
                                        <input
                                            type="text"
                                            name="ho_ten"
                                            value={formData.ho_ten}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn An"
                                            required
                                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border ${fieldErrors.ho_ten ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700/80'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                                        />
                                    </div>
                                    {fieldErrors.ho_ten && (
                                        <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.ho_ten[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[10px]">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                        </span>
                                        <input
                                            type="tel"
                                            name="so_dien_thoai"
                                            value={formData.so_dien_thoai}
                                            onChange={handleChange}
                                            placeholder="0987 654 321"
                                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    {fieldErrors.so_dien_thoai && (
                                        <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.so_dien_thoai[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* HÀNG 2: ĐỊA CHỈ EMAIL */}
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[10px]">
                                    Địa chỉ Email <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        required
                                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border ${fieldErrors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700/80'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.email[0]}</p>
                                )}
                            </div>

                            {/* HÀNG 3: MẬT KHẨU & XÁC NHẬN MẬT KHẨU (2 CỘT) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* MẬT KHẨU */}
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[10px]">
                                        Mật khẩu <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="mat_khau"
                                            value={formData.mat_khau}
                                            onChange={handleChange}
                                            placeholder="Tối thiểu 8 ký tự"
                                            required
                                            className={`w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border ${fieldErrors.mat_khau ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700/80'} text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                                            title={showPassword ? "Ẩn" : "Hiện"}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.mat_khau && (
                                        <p className="text-[10px] text-rose-500 mt-1">{fieldErrors.mat_khau[0]}</p>
                                    )}
                                </div>

                                {/* XÁC NHẬN MẬT KHẨU */}
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-[10px]">
                                        Xác nhận mật khẩu <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/></svg>
                                        </span>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="mat_khau_confirmation"
                                            value={formData.mat_khau_confirmation}
                                            onChange={handleChange}
                                            placeholder="Nhập lại mật khẩu"
                                            required
                                            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                                            title={showConfirmPassword ? "Ẩn" : "Hiện"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* THANH ĐO ĐỘ MẠNH & CHECKLIST MẬT KHẨU */}
                            {formData.mat_khau && (
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-slate-400">Độ mạnh mật khẩu:</span>
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

                                    {/* 3 TIÊU CHÍ BẢO MẬT */}
                                    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                                        <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
                                            <span>{hasMinLength ? '✓' : '•'}</span>
                                            <span>Tối thiểu 8 ký tự</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${hasLetterAndNumber ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
                                            <span>{hasLetterAndNumber ? '✓' : '•'}</span>
                                            <span>Có cả chữ & số</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${isPasswordMatched ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
                                            <span>{isPasswordMatched ? '✓' : '•'}</span>
                                            <span>Trùng khớp</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ĐỒNG Ý ĐIỀU KHOẢN VÀ CHÍNH SÁCH */}
                            <div className="flex items-start pt-1">
                                <input
                                    type="checkbox"
                                    id="agree_terms"
                                    name="agree_terms"
                                    checked={formData.agree_terms}
                                    onChange={handleChange}
                                    required
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 mt-0.5 cursor-pointer accent-blue-600"
                                />
                                <label
                                    htmlFor="agree_terms"
                                    className="ml-2.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer leading-relaxed select-none"
                                >
                                    Tôi đồng ý với{" "}
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                        Điều khoản dịch vụ
                                    </span>{" "}
                                    và{" "}
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                        Chính sách bảo mật
                                    </span>{" "}
                                    của hệ thống TECHNOVA.
                                </label>
                            </div>

                            {/* NÚT SUBMIT TẠO TÀI KHOẢN */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang khởi tạo tài khoản...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Tạo tài khoản thành viên</span>
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* LIÊN KẾT ĐẾN ĐĂNG NHẬP */}
                        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            Đã có tài khoản TECHNOVA?{" "}
                            <Link
                                href="/login"
                                className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}