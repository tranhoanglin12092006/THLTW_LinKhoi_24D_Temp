// Component SalesChart dùng để hiển thị biểu đồ doanh thu
export default function SalesChart() {
    return (
        // Card bao quanh toàn bộ biểu đồ
        <div className="dashboard-card sales-card">

            {/* =========================
                PHẦN TIÊU ĐỀ BIỂU ĐỒ
            ========================= */}
            <div className="card-title">

                {/* Tên biểu đồ và mô tả */}
                <div>

                    {/* Tiêu đề */}
                    <h3>Doanh thu</h3>

                    {/* Mô tả */}
                    <p>
                        Thống kê doanh thu trong 7 ngày
                    </p>

                </div>


                {/* 
                    Cho phép chọn khoảng thời gian.
                    Hiện tại chỉ dùng để làm giao diện,
                    chưa xử lý thay đổi dữ liệu.
                */}
                <select>

                    <option>
                        7 ngày
                    </option>

                    <option>
                        30 ngày
                    </option>

                    <option>
                        3 tháng
                    </option>

                </select>

            </div>


            {/* =========================
                KHU VỰC BIỂU ĐỒ
            ========================= */}
            <div className="chart">

                {/* 
                    Trục dọc của biểu đồ.
                    Các giá trị này hiện tại chỉ là
                    số liệu mẫu để dựng giao diện.
                */}
                <div className="chart-y">

                    <span>30M</span>

                    <span>20M</span>

                    <span>10M</span>

                    <span>0</span>

                </div>


                {/* 
                    Khu vực chính của biểu đồ.
                    Các cột doanh thu sẽ nằm ở đây.
                */}
                <div className="chart-area">


                    {/* 
                        Các đường ngang giúp người dùng
                        dễ nhìn và so sánh chiều cao cột.
                    */}
                    <div className="chart-grid">
                    </div>


                    {/* =========================
                        CÁC CỘT BIỂU ĐỒ
                    ========================= */}
                    <div className="chart-bars">


                        {/* Thứ 2 */}
                        <div
                            className="bar"
                            style={{ height: "35%" }}
                        >
                        </div>


                        {/* Thứ 3 */}
                        <div
                            className="bar"
                            style={{ height: "55%" }}
                        >
                        </div>


                        {/* Thứ 4 */}
                        <div
                            className="bar"
                            style={{ height: "42%" }}
                        >
                        </div>


                        {/* Thứ 5 */}
                        <div
                            className="bar"
                            style={{ height: "72%" }}
                        >
                        </div>


                        {/* Thứ 6 */}
                        <div
                            className="bar"
                            style={{ height: "58%" }}
                        >
                        </div>


                        {/* Thứ 7 */}
                        <div
                            className="bar"
                            style={{ height: "85%" }}
                        >
                        </div>


                        {/* Chủ nhật */}
                        <div
                            className="bar"
                            style={{ height: "68%" }}
                        >
                        </div>

                    </div>


                    {/* =========================
                        TÊN CÁC NGÀY
                    ========================= */}
                    <div className="chart-labels">

                        <span>T2</span>

                        <span>T3</span>

                        <span>T4</span>

                        <span>T5</span>

                        <span>T6</span>

                        <span>T7</span>

                        <span>CN</span>

                    </div>

                </div>

            </div>

        </div>
    );
}