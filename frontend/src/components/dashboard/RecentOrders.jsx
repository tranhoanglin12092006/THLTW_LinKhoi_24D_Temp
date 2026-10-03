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
            status: "Hoàn thành",
            statusColor: "bg-emerald-500/15 text-emerald-400"
        },
        {
            id: "#DH002",
            customer: "Trần Văn B",
            total: "720.000đ",
            status: "Đang xử lý",
            statusColor: "bg-blue-500/15 text-blue-400"
        },
        {
            id: "#DH003",
            customer: "Lê Thị C",
            total: "320.000đ",
            status: "Chờ xử lý",
            statusColor: "bg-amber-500/15 text-amber-400"
        },
        {
            id: "#DH004",
            customer: "Phạm Văn D",
            total: "890.000đ",
            status: "Hoàn thành",
            statusColor: "bg-emerald-500/15 text-emerald-400"
        }
    ];


    return (
        // Card chứa danh sách đơn hàng
        <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm p-6 overflow-hidden">

            {/* =========================
                PHẦN TIÊU ĐỀ
            ========================= */}
            <div className="flex items-center justify-between mb-5">

                <div>

                    {/* Tên phần */}
                    <h3 className="m-0 text-[15px] font-semibold text-white">
                        Đơn hàng gần đây
                    </h3>

                    {/* Mô tả */}
                    <p className="mt-1.5 text-[11px] text-slate-500">
                        Các đơn hàng mới nhất
                    </p>

                </div>


                {/* 
                    Link chuyển sang trang quản lý
                    toàn bộ đơn hàng.
                */}
                <a href="/admin/orders" className="text-violet-400 text-[11px] font-medium no-underline hover:text-violet-300 transition-colors">
                    Xem tất cả →
                </a>

            </div>


            {/* =========================
                BẢNG ĐƠN HÀNG
            ========================= */}
            <div className="w-full">


                {/* =========================
                    TIÊU ĐỀ CÁC CỘT
                ========================= */}
                <div className="grid grid-cols-[0.8fr_1.5fr_1fr_1fr] items-center gap-4 py-3 border-b border-white/[0.06] text-[10px] text-slate-600 uppercase tracking-wider font-semibold">

                    {/* Mã đơn hàng */}
                    <span>Mã đơn</span>

                    {/* Tên khách hàng */}
                    <span>Khách hàng</span>

                    {/* Tổng tiền */}
                    <span>Tổng tiền</span>

                    {/* Trạng thái */}
                    <span>Trạng thái</span>

                </div>


                {/* =========================
                    DANH SÁCH ĐƠN HÀNG
                ========================= */}
                {orders.map((order) => (

                    // Mỗi order sẽ tạo thành một dòng trong bảng
                    <div
                        className="grid grid-cols-[0.8fr_1.5fr_1fr_1fr] items-center gap-4 min-h-[52px] border-b border-white/[0.04] text-[12px] text-slate-400 hover:bg-white/[0.02] transition-colors"
                        key={order.id}
                    >

                        {/* Mã đơn */}
                        <strong className="text-slate-200 font-semibold">
                            {order.id}
                        </strong>


                        {/* Tên khách hàng */}
                        <span>
                            {order.customer}
                        </span>


                        {/* Tổng tiền */}
                        <strong className="text-slate-200 font-semibold">
                            {order.total}
                        </strong>


                        {/* 
                            Trạng thái đơn hàng.
                        */}
                        <span className={`w-fit px-2.5 py-1 rounded-md text-[10px] font-medium ${order.statusColor}`}>
                            {order.status}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}