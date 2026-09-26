"use client";

export default function Login() {
    return (
        <main className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl2 p-8 shadow-sm">

                <div className="text-center mb-7">
                    <span
                        className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-4"
                        id="login-logo"
                    ></span>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Chào mừng trở lại
                    </h1>

                    <p className="text-sm text-slate-400 mt-1">
                        Đăng nhập để tiếp tục mua sắm
                    </p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-1.5">
                            Email
                        </label>

                        <input
                            required
                            name="email"
                            type="email"
                            className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1.5">
                            Mật khẩu
                        </label>

                        <input
                            required
                            name="password"
                            type="password"
                            className="w-full border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <input
                                type="checkbox"
                                className="rounded accent-primary"
                            />

                            Nhớ đăng nhập
                        </label>

                        <a
                            href="/forgot-password"
                            className="text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                    <span className="flex-1 h-px bg-slate-100 dark:bg-slate-700"></span>

                    <span className="text-xs text-slate-400">
                        Hoặc đăng nhập bằng
                    </span>

                    <span className="flex-1 h-px bg-slate-100 dark:bg-slate-700"></span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <span
                            className="w-4 h-4"
                            id="ic-google"
                        ></span>

                        Google
                    </button>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                        <span
                            className="w-4 h-4 text-[#1877F2]"
                            id="ic-fb"
                        ></span>

                        Facebook
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Chưa có tài khoản?{" "}

                    <a
                        href="/register"
                        className="text-primary font-medium hover:underline"
                    >
                        Đăng ký ngay
                    </a>
                </p>

            </div>
        </main>
    );
}