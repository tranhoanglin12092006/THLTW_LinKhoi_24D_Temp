// Component OrderStatus dùng để hiển thị
// tình trạng các đơn hàng trên Dashboard
export default function OrderStatus() {
    return (
        // Card chứa toàn bộ phần thống kê đơn hàng
        <div className="dashboard-card order-status-card">

            {/* =========================
                PHẦN TIÊU ĐỀ
            ========================= */}
            <div className="card-title">

                <div>

                    {/* Tên phần thống kê */}
                    <h3>Đơn hàng</h3>

                    {/* Mô tả ngắn */}
                    <p>
                        Trạng thái đơn hàng
                    </p>

                </div>

            </div>


            {/* =========================
                VÒNG TRÒN THỐNG KÊ
            ========================= */}
            <div className="status-chart">

                {/* 
                    Vòng tròn hiển thị tổng số đơn hàng.
                    Hiện tại số 128 là dữ liệu mẫu.
                */}
                <div className="status-circle">

                    {/* Tổng số đơn hàng */}
                    <strong>128</strong>

                    {/* Nội dung mô tả */}
                    <span>Tổng đơn</span>

                </div>

            </div>


            {/* =========================
                DANH SÁCH TRẠNG THÁI
            ========================= */}
            <div className="status-list">


                {/* =========================
                    ĐƠN HÀNG CHỜ XỬ LÝ
                ========================= */}
                <div className="status-item">

                    {/* 
                        Chấm màu đại diện cho trạng thái.
                        Không dùng icon để giao diện gọn hơn.
                    */}
                    <span className="status-dot pending">
                    </span>

                    {/* Tên trạng thái */}
                    <span>
                        Chờ xử lý
                    </span>

                    {/* Số lượng đơn */}
                    <strong>
                        24
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG ĐANG XỬ LÝ
                ========================= */}
                <div className="status-item">

                    <span className="status-dot processing">
                    </span>

                    <span>
                        Đang xử lý
                    </span>

                    <strong>
                        31
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG HOÀN THÀNH
                ========================= */}
                <div className="status-item">

                    <span className="status-dot completed">
                    </span>

                    <span>
                        Hoàn thành
                    </span>

                    <strong>
                        62
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG ĐÃ HỦY
                ========================= */}
                <div className="status-item">

                    <span className="status-dot cancelled">
                    </span>

                    <span>
                        Đã hủy
                    </span>

                    <strong>
                        11
                    </strong>

                </div>

            </div>

        </div>
    );
}