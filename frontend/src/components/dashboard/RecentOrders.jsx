// Component RecentOrders dùng để hiển thị
// danh sách các đơn hàng mới nhất
export default function RecentOrders() {

    // =========================
    // DỮ LIỆU ĐƠN HÀNG MẪU
    // =========================
    // Hiện tại dùng dữ liệu mẫu để dựng giao diện.
    // Sau này sẽ thay bằng dữ liệu lấy từ API Laravel.
    const orders = [
        {
            id: "#DH001",
            customer: "Nguyễn Văn A",
            total: "450.000đ",
            status: "Hoàn thành"
        },
        {
            id: "#DH002",
            customer: "Trần Văn B",
            total: "720.000đ",
            status: "Đang xử lý"
        },
        {
            id: "#DH003",
            customer: "Lê Thị C",
            total: "320.000đ",
            status: "Chờ xử lý"
        },
        {
            id: "#DH004",
            customer: "Phạm Văn D",
            total: "890.000đ",
            status: "Hoàn thành"
        }
    ];


    return (
        // Card chứa danh sách đơn hàng
        <div className="dashboard-card recent-orders">

            {/* =========================
                PHẦN TIÊU ĐỀ
            ========================= */}
            <div className="card-title">

                <div>

                    {/* Tên phần */}
                    <h3>
                        Đơn hàng gần đây
                    </h3>

                    {/* Mô tả */}
                    <p>
                        Các đơn hàng mới nhất
                    </p>

                </div>


                {/* 
                    Link chuyển sang trang quản lý
                    toàn bộ đơn hàng.
                */}
                <a href="/admin/orders">
                    Xem tất cả
                </a>

            </div>


            {/* =========================
                BẢNG ĐƠN HÀNG
            ========================= */}
            <div className="order-table">


                {/* =========================
                    TIÊU ĐỀ CÁC CỘT
                ========================= */}
                <div className="order-header">

                    {/* Mã đơn hàng */}
                    <span>
                        Mã đơn
                    </span>

                    {/* Tên khách hàng */}
                    <span>
                        Khách hàng
                    </span>

                    {/* Tổng tiền */}
                    <span>
                        Tổng tiền
                    </span>

                    {/* Trạng thái */}
                    <span>
                        Trạng thái
                    </span>

                </div>


                {/* =========================
                    DANH SÁCH ĐƠN HÀNG
                ========================= */}
                {orders.map((order) => (

                    // Mỗi order sẽ tạo thành một dòng trong bảng
                    <div
                        className="order-row"
                        key={order.id}
                    >

                        {/* Mã đơn */}
                        <strong>
                            {order.id}
                        </strong>


                        {/* Tên khách hàng */}
                        <span>
                            {order.customer}
                        </span>


                        {/* Tổng tiền */}
                        <strong>
                            {order.total}
                        </strong>


                        {/* 
                            Trạng thái đơn hàng.
                            CSS sẽ tạo kiểu cho phần badge này.
                        */}
                        <span className="order-badge">
                            {order.status}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}