// Import Sidebar để hiển thị thanh menu bên trái
import Sidebar from "@/components/dashboard/Sidebar";

// Import các component thống kê
import StatCard from "@/components/dashboard/StatCard";

// Import component biểu đồ doanh thu
import SalesChart from "@/components/dashboard/SalesChart";

// Import component thống kê trạng thái đơn hàng
import OrderStatus from "@/components/dashboard/OrderStatus";

// Import component danh sách đơn hàng gần đây
import RecentOrders from "@/components/dashboard/RecentOrders";


// Component chính của trang Dashboard
export default function DashboardPage() {
    return (

        // Bao ngoài toàn bộ giao diện Dashboard
        <div className="min-h-screen bg-[#090b14] text-white" style={{
            background: 'radial-gradient(ellipse at top right, rgba(109,40,217,0.15), transparent 50%), radial-gradient(ellipse at bottom left, rgba(59,130,246,0.08), transparent 50%), #090b14'
        }}>

            {/* 
                Sidebar:
                Thanh menu nằm bên trái màn hình
            */}
            <Sidebar />


            {/* 
                Nội dung chính của Dashboard.
                Phần này nằm bên phải Sidebar.
            */}
            <main className="ml-[260px] p-8 min-h-screen">


                {/* =========================
                    PHẦN TIÊU ĐỀ
                ========================= */}
                <div className="flex items-center justify-between mb-8">

                    {/* Tên trang và mô tả */}
                    <div>

                        <h1 className="m-0 text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-slate-500 text-sm">
                            Tổng quan hệ thống bán hàng
                        </p>

                    </div>


                    {/* 
                        Phần bên phải tiêu đề.
                    */}
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 text-xs font-medium backdrop-blur-sm">
                            📅 Tháng 10, 2026
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20 cursor-pointer hover:shadow-violet-500/40 transition-shadow">
                            A
                        </div>
                    </div>

                </div>



                {/* =========================
                    4 Ô THỐNG KÊ
                    Sản phẩm
                    Danh mục
                    Đơn hàng
                    Người dùng
                ========================= */}

                <div className="grid grid-cols-4 gap-5 mb-6">


                    {/* Thống kê sản phẩm */}
                    <StatCard
                        title="Sản phẩm"
                        value="356"
                        description="Sản phẩm đang có"
                        color="purple"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        }
                    />


                    {/* Thống kê danh mục */}
                    <StatCard
                        title="Danh mục"
                        value="24"
                        description="Danh mục sản phẩm"
                        color="blue"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        }
                    />


                    {/* Thống kê đơn hàng */}
                    <StatCard
                        title="Đơn hàng"
                        value="128"
                        description="Đơn hàng trong tháng"
                        color="pink"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        }
                    />


                    {/* Thống kê người dùng */}
                    <StatCard
                        title="Người dùng"
                        value="892"
                        description="Tài khoản khách hàng"
                        color="cyan"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        }
                    />

                </div>



                {/* =========================
                    KHU VỰC BIỂU ĐỒ
                    Bên trái: Doanh thu
                    Bên phải: Trạng thái đơn hàng
                ========================= */}

                <div className="grid grid-cols-[2fr_1fr] gap-5 mb-6">


                    {/* Biểu đồ doanh thu */}
                    <SalesChart />


                    {/* Thống kê trạng thái đơn hàng */}
                    <OrderStatus />

                </div>



                {/* =========================
                    KHU VỰC PHÍA DƯỚI
                    Bên trái: Đơn hàng gần đây
                    Bên phải: Thương hiệu
                ========================= */}

                <div className="grid grid-cols-[2fr_1fr] gap-5 mb-6">


                    {/* Danh sách các đơn hàng mới */}
                    <RecentOrders />


                    {/* 
                        Thống kê thương hiệu.
                        Hiện tại dùng dữ liệu mẫu.
                    */}
                    <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm p-6">


                        {/* Tiêu đề phần thương hiệu */}
                        <div className="flex items-center justify-between mb-5">

                            <div>

                                <h3 className="m-0 text-[15px] font-semibold text-white">
                                    Thương hiệu
                                </h3>

                                <p className="mt-1.5 text-[11px] text-slate-500">
                                    Số lượng sản phẩm theo thương hiệu
                                </p>

                            </div>

                        </div>


                        {/* Danh sách thương hiệu */}
                        <div className="flex flex-col gap-4">


                            {/* Thương hiệu thứ nhất */}
                            <div className="flex justify-between items-center pb-3.5 border-b border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 text-xs font-bold">A</div>
                                    <span className="text-[12px] text-slate-400">Thương hiệu A</span>
                                </div>
                                <strong className="text-white text-sm font-semibold">85</strong>
                            </div>


                            {/* Thương hiệu thứ hai */}
                            <div className="flex justify-between items-center pb-3.5 border-b border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold">B</div>
                                    <span className="text-[12px] text-slate-400">Thương hiệu B</span>
                                </div>
                                <strong className="text-white text-sm font-semibold">64</strong>
                            </div>


                            {/* Thương hiệu thứ ba */}
                            <div className="flex justify-between items-center pb-3.5 border-b border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 text-xs font-bold">C</div>
                                    <span className="text-[12px] text-slate-400">Thương hiệu C</span>
                                </div>
                                <strong className="text-white text-sm font-semibold">51</strong>
                            </div>


                            {/* Thương hiệu thứ tư */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold">D</div>
                                    <span className="text-[12px] text-slate-400">Thương hiệu D</span>
                                </div>
                                <strong className="text-white text-sm font-semibold">37</strong>
                            </div>


                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}