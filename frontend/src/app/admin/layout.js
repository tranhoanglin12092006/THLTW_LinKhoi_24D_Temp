import Sidebar from "@/components/dashboard/Sidebar";
import Link from "next/link";

export const metadata = {
    title: "TECHNOVA - Quản Trị Hệ Thống",
    description: "Trang quản trị sản phẩm, danh mục, thương hiệu, đơn hàng TECHNOVA",
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#090b14] text-white flex">
            {/* Sidebar quản trị bên trái */}
            <Sidebar />

            {/* Nội dung chính bên phải */}
            <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
                {/* Header thanh công cụ Admin */}
                <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-[#0c0e1e]/90 backdrop-blur-md px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                            ✦ Trang Quản Trị
                        </span>
                        <span className="text-slate-600">/</span>
                        <span className="text-xs text-slate-400">Hệ thống TECHNOVA</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                        >
                            <span>🛒 Xem cửa hàng</span>
                            <span className="text-[10px]">↗</span>
                        </Link>

                        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                                AD
                            </div>
                            <span className="text-xs font-medium text-slate-300">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Nội dung các trang con (Categories, Brands, Products, ...) */}
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
