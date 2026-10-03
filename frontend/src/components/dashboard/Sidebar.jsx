// Component Sidebar dùng để tạo thanh menu bên trái của Dashboard
export default function Sidebar() {
    return (
        // Thẻ aside chứa toàn bộ thanh Sidebar
        <aside className="fixed left-0 top-0 w-[260px] h-screen flex flex-col py-7 px-5 bg-gradient-to-b from-[#0f1129] to-[#080a18] border-r border-white/[0.06] z-50">

            {/* =========================
                PHẦN LOGO
                Hiển thị tên hệ thống
            ========================= */}
            <div className="px-3 pb-8">

                {/* Tên của trang quản trị */}
                <h2 className="m-0 text-xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                    ✦ TECHNOVA
                </h2>

                {/* Mô tả nhỏ bên dưới logo */}
                <span className="block mt-1.5 text-[11px] text-slate-500 font-medium tracking-widest uppercase">
                    Admin Dashboard
                </span>

            </div>


            {/* =========================
                PHẦN MENU
                Chứa các chức năng quản lý
            ========================= */}
            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">

                {/* Tiêu đề nhóm menu */}
                <p className="mx-3 mt-4 mb-2 text-[10px] font-semibold text-slate-600 tracking-[0.15em] uppercase">
                    TỔNG QUAN
                </p>


                {/* =========================
                    DASHBOARD
                    Đây là trang tổng quan
                ========================= */}
                <a
                    href="/dashboard"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-violet-600/30 to-indigo-600/15 border border-violet-500/20 shadow-lg shadow-violet-500/5 transition-all duration-200"
                >

                    {/* 
                        Icon Dashboard
                    */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    </span>

                    Dashboard

                </a>


                {/* =========================
                    NHÓM QUẢN LÝ
                ========================= */}
                <p className="mx-3 mt-6 mb-2 text-[10px] font-semibold text-slate-600 tracking-[0.15em] uppercase">
                    QUẢN LÝ
                </p>


                {/* =========================
                    QUẢN LÝ SẢN PHẨM
                ========================= */}
                <a
                    href="/admin/products"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-violet-500/10 transition-all duration-200"
                >

                    {/* Icon sản phẩm */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </span>

                    Sản phẩm

                </a>


                {/* =========================
                    QUẢN LÝ DANH MỤC
                ========================= */}
                <a
                    href="/admin/categories"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-violet-500/10 transition-all duration-200"
                >

                    {/* Icon danh mục */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </span>

                    Danh mục

                </a>


                {/* =========================
                    QUẢN LÝ THƯƠNG HIỆU
                ========================= */}
                <a
                    href="/admin/brands"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-violet-500/10 transition-all duration-200"
                >

                    {/* Icon thương hiệu */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                    </span>

                    Thương hiệu

                </a>


                {/* =========================
                    QUẢN LÝ ĐƠN HÀNG
                ========================= */}
                <a
                    href="/admin/orders"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-violet-500/10 transition-all duration-200"
                >

                    {/* Icon đơn hàng */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </span>

                    Đơn hàng

                </a>


                {/* =========================
                    QUẢN LÝ NGƯỜI DÙNG
                ========================= */}
                <a
                    href="/admin/users"
                    className="flex items-center gap-3 min-h-[44px] px-3 rounded-xl text-slate-400 text-sm font-medium hover:text-white hover:bg-violet-500/10 transition-all duration-200"
                >

                    {/* Icon người dùng */}
                    <span className="w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </span>

                    Người dùng

                </a>

            </nav>


            {/* =========================
                PHẦN CUỐI SIDEBAR
                Hiển thị thông tin phiên bản
            ========================= */}
            <div className="mt-auto pt-5 px-3 border-t border-white/[0.06] flex flex-col gap-1">

                {/* Tên khu vực quản trị */}
                <span className="text-xs text-slate-500">Admin Panel</span>

                {/* Phiên bản hệ thống */}
                <small className="text-[10px] text-slate-700">Version 1.0</small>

            </div>

        </aside>
    );
}