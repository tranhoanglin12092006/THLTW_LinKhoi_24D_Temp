"use client";

export default function Register() {
    return (
        <>
            {/* REGISTER MAIN */}
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 shadow-sm">
                            <i data-lucide="user-plus" className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Tạo tài khoản mới
                        </h1>
                        <p className="text-xs text-slate-500">
                            Gia nhập cộng đồng TECHNOVA để nhận ngập tràn ưu đãi
                        </p>
                    </div>
                    {/* Form */}
                    <form
                        id="register-form"
                        onsubmit="handleRegisterSubmit(event)"
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Họ và tên *
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="user"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="text"
                                    id="reg-name"
                                    required=""
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Địa chỉ Email *
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="mail"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="email"
                                    id="reg-email"
                                    required=""
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Số điện thoại *
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="phone"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="tel"
                                    id="reg-phone"
                                    required=""
                                    placeholder="0987 654 321"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="key"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="password"
                                    id="reg-password"
                                    required=""
                                    placeholder="Tối thiểu 6 ký tự"
                                    oninput="checkPasswordStrength(this.value)"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('reg-password')"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                >
                                    <i data-lucide="eye" className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Password Strength Bar */}
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>Độ mạnh mật khẩu:</span>
                                    <span id="strength-text" className="font-bold">
                                        Chưa nhập
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        id="strength-bar"
                                        className="h-full w-0 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Xác nhận mật khẩu *
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="shield-check"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="password"
                                    id="reg-confirm"
                                    required=""
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('reg-confirm')"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                >
                                    <i data-lucide="eye" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="agree-terms"
                                required=""
                                defaultChecked=""
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
                            />
                            <label
                                htmlFor="agree-terms"
                                className="ml-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                            >
                                Tôi đồng ý với các{" "}
                                <a
                                    href="about.html"
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    Điều khoản dịch vụ
                                </a>{" "}
                                và{" "}
                                <a
                                    href="about.html"
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    Chính sách bảo mật
                                </a>
                            </label>
                        </div>
                        <button
                            type="submit"
                            id="reg-submit-btn"
                            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-95"
                        >
                            Tạo tài khoản
                        </button>
                    </form>
                    <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        Đã có tài khoản?
                        <a
                            href="login.html"
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                        >
                            Đăng nhập ngay
                        </a>
                    </div>
                </div>
            </main>
        </>


    );
}