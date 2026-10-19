"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authServices";

/**
 * =========================================================================
 * TRANG ĐĂNG NHẬP TÀI KHOẢN CAO CẤP (FLAGSHIP TECHNOVA LOGIN)
 * Phong cách Split-Screen Glassmorphism hiện đại, đồng bộ với trang Đăng ký.
 * Tích hợp đầy đủ:
 * - Gọi API Backend Laravel (/api/login)
 * - Tự động lưu Token (token, access_token) và User vào localStorage
 * - Hỗ trợ "Ghi nhớ đăng nhập" (Remember Email)
 * - Nút bật/tắt hiển thị mật khẩu
 * - Phân quyền tự động: Admin -> /dashboard, Member -> /
 * - Bắt lỗi chi tiết và thông báo thân thiện bằng tiếng Việt
 * =========================================================================
 */
export default function LoginPage() {
    const router = useRouter();

    // 1. Dữ liệu form nhập vào
    const [formData, setFormData] = useState({
        email: "",
        mat_khau: "",
        remember_me: true,
    });

    // 2. Trạng thái ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // 3. Trạng thái xử lý: Loading, Lỗi, Thành công
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // 4. Khi load trang, tự điền email nếu người dùng từng chọn "Ghi nhớ đăng nhập"
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedEmail = localStorage.getItem("technova_remembered_email");
            if (savedEmail) {
                setFormData((prev) => ({
                    ...prev,
                    email: savedEmail,
                    remember_me: true,
                }));
            }
        }
    }, []);

    // 5. Cập nhật giá trị các trường nhập liệu
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Xóa thông báo lỗi khi người dùng bắt đầu gõ lại
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    // 6. Xử lý Đăng nhập mạng xã hội (Mockup Google / Facebook)
    const handleSocialAuth = (provider) => {
        alert(`Tính năng đăng nhập nhanh bằng ${provider} đang được hoàn thiện trong phiên bản tới!`);
    };

    // 7. Xử lý Gửi Form Đăng nhập (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!formData.email.trim()) {
            setErrorMessage("Vui lòng nhập địa chỉ email của bạn.");
            return;
        }

        if (!formData.mat_khau) {
            setErrorMessage("Vui lòng nhập mật khẩu.");
            return;
        }

        try {
            setLoading(true);

            // Gửi thông tin đăng nhập lên API Backend Laravel (POST /api/login)
            const payload = {
                email: formData.email.trim(),
                mat_khau: formData.mat_khau,
            };

            const response = await loginUser(payload);

            // Xử lý ghi nhớ email
            if (formData.remember_me) {
                localStorage.setItem("technova_remembered_email", formData.email.trim());
            } else {
                localStorage.removeItem("technova_remembered_email");
            }

            // Lưu Token & User vào LocalStorage (Đồng bộ với axiosClient interceptors)
            if (response?.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("access_token", response.token);
                if (response?.role === "admin" || response?.user?.vai_tro === "admin") {
                    localStorage.setItem("admin_token", response.token);
                }
            }

            if (response?.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
            }

            // Bắn event để Header lập tức cập nhật thông tin người dùng
            window.dispatchEvent(new Event("userUpdated")); 

            // Thông báo thành công
            const userName = response?.user?.ho_ten || "bạn";
            setSuccessMessage(`✓ Đăng nhập thành công! Chào mừng ${userName} trở lại.`);

            // Tự động điều hướng theo quyền hạn (Admin chuyển về dashboard, Khách chuyển về trang chủ)
            setTimeout(() => {
                const isAdmin = response?.role === "admin" || response?.user?.vai_tro === "admin";
                if (isAdmin) {
                    router.push("/dashboard");
                } else {
                    router.push("/");
                }
            }, 1200);

        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);

            // Bắt lỗi cụ thể từ Backend Laravel trả về
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else if (error.response?.status === 401) {
                setErrorMessage("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
            } else if (error.response?.status === 403) {
                setErrorMessage("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ!");
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

            <div className="max-w-5xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

                    {/* =========================================================================
                        CỘT TRÁI: GIỚI THIỆU TECHNOVA & ĐẶC QUYỀN THÀNH VIÊN
                    ========================================================================= */}
                    <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/80 to-slate-950/95 border border-white/[0.1] text-white shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                        
                        {/* Họa tiết trang trí ánh sao */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            {/* Huy hiệu thương hiệu */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                                ✦ CHÀO MỪNG TRỞ LẠI
                            </div>

                            {/* Tiêu đề */}
                            <h2 className="text-3xl font-black tracking-tight leading-tight">
                                Tiếp tục trải nghiệm <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                                    công nghệ đỉnh cao
                                </span>
                            </h2>

                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                                Đăng nhập tài khoản TECHNOVA để theo dõi đơn hàng, quản lý danh sách yêu thích và tận hưởng ngập tràn voucher giảm giá dành riêng cho bạn.
                            </p>

                            {/* Lợi ích khi đăng nhập */}
                            <div className="space-y-3.5 pt-2">
                                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 text-sm">
                                        📦
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Theo Dõi Đơn Hàng Realtime</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Cập nhật lộ trình vận chuyển và trạng thái giao hàng tức thì.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0 text-sm">
                                        💎
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Kho Voucher Cá Nhân</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Tự động áp dụng mã giảm giá và hoàn xu TECH-POINT khi thanh toán.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 text-sm">
                                        🔒
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Bảo Mật Tiêu Chuẩn Quốc Tế</h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Mã hóa mật khẩu an toàn chuẩn Sanctum và bảo vệ quyền riêng tư.</p>
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
                                    <span className="text-slate-400 font-medium">Hơn 50,000+ thành viên tin dùng</span>
                                </div>
                            </div>

                            <span className="text-[11px] font-bold text-blue-400">4.9 / 5.0 ⭐</span>
                        </div>
                    </div>

                    {/* =========================================================================
                        CỘT PHẢI: FORM ĐĂNG NHẬP CHÍNH (LOGIN FORM)
                    ========================================================================= */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between">
                        
                        {/* Header của Form */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    Đăng nhập
                                </h1>
                                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                                    Bảo mật SSL 256-bit
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Chào mừng bạn quay trở lại! Đăng nhập để tiếp tục mua sắm tại TECHNOVA.
                            </p>
                        </div>

                        {/* Nút đăng nhập qua mạng xã hội (Google & Facebook) */}
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
                                <span>Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSocialAuth("Facebook")}
                                className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                <svg className="w-4 h-4 text-blue-600 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Facebook</span>
                            </button>
                        </div>

                        {/* Đường phân cách */}
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 absolute">
                                Hoặc bằng Email
                            </span>
                        </div>

                        {/* Thông báo lỗi */}
                        {errorMessage && (
                            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-shake">
                                <span className="text-sm leading-none mt-0.5">⚠️</span>
                                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                            </div>
                        )}

                        {/* Thông báo thành công */}
                        {successMessage && (
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5">
                                <span className="text-sm">✓</span>
                                <div className="flex-1 font-semibold leading-relaxed">{successMessage}</div>
                            </div>
                        )}

                        {/* Form Đăng nhập */}
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Ô nhập Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Địa chỉ Email <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="vidu: nguyenvanan@gmail.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Ô nhập Mật khẩu */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Mật khẩu <span className="text-rose-500">*</span>
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="mat_khau"
                                        value={formData.mat_khau}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập mật khẩu của bạn"
                                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Tùy chọn: Ghi nhớ đăng nhập */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                                    <input
                                        type="checkbox"
                                        name="remember_me"
                                        checked={formData.remember_me}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                    <span>Ghi nhớ tài khoản này trên thiết bị</span>
                                </label>
                            </div>

                            {/* Nút gửi form (Đăng nhập) */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                        loading
                                            ? "bg-blue-400 cursor-not-allowed opacity-80"
                                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-blue-500/35"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.827z" />
                                            </svg>
                                            <span>Đang xác thực đăng nhập...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đăng Nhập Ngay</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer: Chuyển sang Đăng ký */}
                        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                            Chưa có tài khoản TECHNOVA?{" "}
                            <Link
                                href="/register"
                                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                            >
                                Đăng ký tài khoản mới ngay
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}