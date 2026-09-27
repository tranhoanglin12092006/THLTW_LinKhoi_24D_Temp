"use client";

export default function Login() {
    return (
        <>
            {/* MAIN LOGIN CARD */}
            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 shadow-sm">
                            <i data-lucide="lock" className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Chào mừng trở lại
                        </h1>
                        <p className="text-xs text-slate-500">
                            Đăng nhập tài khoản để tiếp tục mua sắm tại TECHNOVA
                        </p>
                    </div>
                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onclick="mockSocialLogin('Google')"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                                />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onclick="mockSocialLogin('Facebook')"
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
                        >
                            <svg
                                className="w-4 h-4 text-blue-600 fill-current"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 absolute">
                            Hoặc bằng Email
                        </span>
                    </div>
                    {/* Login Form */}
                    <form
                        id="login-form"
                        onsubmit="handleLoginSubmit(event)"
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <i
                                    data-lucide="mail"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="email"
                                    id="login-email"
                                    required=""
                                    defaultValue="nguyenvanan@gmail.com"
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Mật khẩu
                                </label>
                                <a
                                    href="forgot-password.html"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <div className="relative">
                                <i
                                    data-lucide="key"
                                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                />
                                <input
                                    type="password"
                                    id="login-password"
                                    required=""
                                    defaultValue="password123"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('login-password')"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                                >
                                    <i data-lucide="eye" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember-me"
                                defaultChecked=""
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer"
                            >
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <button
                            type="submit"
                            id="login-submit-btn"
                            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-95"
                        >
                            Đăng nhập
                        </button>
                    </form>
                    <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        Chưa có tài khoản?
                        <a
                            href="register.html"
                            className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                        >
                            Đăng ký ngay
                        </a>
                    </div>
                </div>
            </main>
        </>

    );
}