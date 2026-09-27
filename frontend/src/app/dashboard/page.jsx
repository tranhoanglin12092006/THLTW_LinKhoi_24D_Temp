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

// Import CSS riêng của Dashboard
import "@/app/dashboard.css";


// Component chính của trang Dashboard
export default function DashboardPage() {
    return (

        // Bao ngoài toàn bộ giao diện Dashboard
        <div className="dashboard">

            {/* 
                Sidebar:
                Thanh menu nằm bên trái màn hình
            */}
            <Sidebar />


            {/* 
                Nội dung chính của Dashboard.
                Phần này nằm bên phải Sidebar.
            */}
            <main className="dashboard-main">


                {/* =========================
                    PHẦN TIÊU ĐỀ
                ========================= */}
                <div className="dashboard-title">

                    {/* Tên trang và mô tả */}
                    <div>

                        <h1>Dashboard</h1>

                        <p>
                            Tổng quan hệ thống bán hàng
                        </p>

                    </div>


                    {/* 
                        Phần bên phải tiêu đề.
                        Tạm thời chỉ hiển thị "Tổng quan".
                    */}
                    <div className="dashboard-date">
                        Tổng quan
                    </div>

                </div>



                {/* =========================
                    4 Ô THỐNG KÊ
                    Sản phẩm
                    Danh mục
                    Đơn hàng
                    Người dùng
                ========================= */}

                <div className="stat-grid">


                    {/* Thống kê sản phẩm */}
                    <StatCard
                        title="Sản phẩm"
                        value="356"
                        description="Sản phẩm đang có"
                        color="purple"
                    />


                    {/* Thống kê danh mục */}
                    <StatCard
                        title="Danh mục"
                        value="24"
                        description="Danh mục sản phẩm"
                        color="blue"
                    />


                    {/* Thống kê đơn hàng */}
                    <StatCard
                        title="Đơn hàng"
                        value="128"
                        description="Đơn hàng trong tháng"
                        color="pink"
                    />


                    {/* Thống kê người dùng */}
                    <StatCard
                        title="Người dùng"
                        value="892"
                        description="Tài khoản khách hàng"
                        color="cyan"
                    />

                </div>



                {/* =========================
                    KHU VỰC BIỂU ĐỒ
                    Bên trái: Doanh thu
                    Bên phải: Trạng thái đơn hàng
                ========================= */}

                <div className="dashboard-row">


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

                <div className="dashboard-row bottom-row">


                    {/* Danh sách các đơn hàng mới */}
                    <RecentOrders />


                    {/* 
                        Thống kê thương hiệu.
                        Hiện tại dùng dữ liệu mẫu.
                    */}
                    <div className="dashboard-card brand-card">


                        {/* Tiêu đề phần thương hiệu */}
                        <div className="card-title">

                            <div>

                                <h3>Thương hiệu</h3>

                                <p>
                                    Số lượng sản phẩm theo thương hiệu
                                </p>

                            </div>

                        </div>


                        {/* Danh sách thương hiệu */}
                        <div className="brand-list">


                            {/* Thương hiệu thứ nhất */}
                            <div className="brand-item">

                                <span>
                                    Thương hiệu A
                                </span>

                                <strong>
                                    85
                                </strong>

                            </div>


                            {/* Thương hiệu thứ hai */}
                            <div className="brand-item">

                                <span>
                                    Thương hiệu B
                                </span>

                                <strong>
                                    64
                                </strong>

                            </div>


                            {/* Thương hiệu thứ ba */}
                            <div className="brand-item">

                                <span>
                                    Thương hiệu C
                                </span>

                                <strong>
                                    51
                                </strong>

                            </div>


                            {/* Thương hiệu thứ tư */}
                            <div className="brand-item">

                                <span>
                                    Thương hiệu D
                                </span>

                                <strong>
                                    37
                                </strong>

                            </div>


                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}