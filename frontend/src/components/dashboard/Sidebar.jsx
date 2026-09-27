// Component Sidebar dùng để tạo thanh menu bên trái của Dashboard
export default function Sidebar() {
    return (
        // Thẻ aside chứa toàn bộ thanh Sidebar
        <aside className="sidebar">

            {/* =========================
                PHẦN LOGO
                Hiển thị tên hệ thống
            ========================= */}
            <div className="sidebar-logo">

                {/* Tên của trang quản trị */}
                <h2>SHOP ADMIN</h2>

                {/* Mô tả nhỏ bên dưới logo */}
                <span>Management System</span>

            </div>


            {/* =========================
                PHẦN MENU
                Chứa các chức năng quản lý
            ========================= */}
            <nav className="sidebar-menu">

                {/* Tiêu đề nhóm menu */}
                <p className="menu-title">
                    TỔNG QUAN
                </p>


                {/* =========================
                    DASHBOARD
                    Đây là trang tổng quan
                ========================= */}
                <a
                    href="/dashboard"
                    className="menu-item active"
                >

                    {/* 
                        Khu vực để thêm icon Dashboard.
                        Bạn có thể tự lấy icon và đặt vào đây.
                    */}
                    <span className="menu-icon">
                        {/* ICON DASHBOARD */}
                    </span>

                    Dashboard

                </a>


                {/* =========================
                    NHÓM QUẢN LÝ
                ========================= */}
                <p className="menu-title">
                    QUẢN LÝ
                </p>


                {/* =========================
                    QUẢN LÝ SẢN PHẨM
                ========================= */}
                <a
                    href="/admin/products"
                    className="menu-item"
                >

                    {/* Khu vực để thêm icon sản phẩm */}
                    <span className="menu-icon">
                        {/* ICON SẢN PHẨM */}
                    </span>

                    Sản phẩm

                </a>


                {/* =========================
                    QUẢN LÝ DANH MỤC
                ========================= */}
                <a
                    href="/admin/categories"
                    className="menu-item"
                >

                    {/* Khu vực để thêm icon danh mục */}
                    <span className="menu-icon">
                        {/* ICON DANH MỤC */}
                    </span>

                    Danh mục

                </a>


                {/* =========================
                    QUẢN LÝ THƯƠNG HIỆU
                ========================= */}
                <a
                    href="/admin/brands"
                    className="menu-item"
                >

                    {/* Khu vực để thêm icon thương hiệu */}
                    <span className="menu-icon">
                        {/* ICON THƯƠNG HIỆU */}
                    </span>

                    Thương hiệu

                </a>


                {/* =========================
                    QUẢN LÝ ĐƠN HÀNG
                ========================= */}
                <a
                    href="/admin/orders"
                    className="menu-item"
                >

                    {/* Khu vực để thêm icon đơn hàng */}
                    <span className="menu-icon">
                        {/* ICON ĐƠN HÀNG */}
                    </span>

                    Đơn hàng

                </a>


                {/* =========================
                    QUẢN LÝ NGƯỜI DÙNG
                ========================= */}
                <a
                    href="/admin/users"
                    className="menu-item"
                >

                    {/* Khu vực để thêm icon người dùng */}
                    <span className="menu-icon">
                        {/* ICON NGƯỜI DÙNG */}
                    </span>

                    Người dùng

                </a>

            </nav>


            {/* =========================
                PHẦN CUỐI SIDEBAR
                Hiển thị thông tin phiên bản
            ========================= */}
            <div className="sidebar-footer">

                {/* Tên khu vực quản trị */}
                <span>Admin Panel</span>

                {/* Phiên bản hệ thống */}
                <small>Version 1.0</small>

            </div>

        </aside>
    );
}