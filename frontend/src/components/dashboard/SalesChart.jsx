// Component SalesChart dùng để hiển thị biểu đồ doanh thu
export default function SalesChart() {
    return (
        // Card bao quanh toàn bộ biểu đồ
        <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm p-6">

            {/* =========================
                PHẦN TIÊU ĐỀ BIỂU ĐỒ
            ========================= */}
            <div className="flex items-center justify-between mb-6">

                {/* Tên biểu đồ và mô tả */}
                <div>

                    {/* Tiêu đề */}
                    <h3 className="m-0 text-[15px] font-semibold text-white">
                        Doanh thu
                    </h3>

                    {/* Mô tả */}
                    <p className="mt-1.5 text-[11px] text-slate-500">
                        Thống kê doanh thu trong 7 ngày
                    </p>

                </div>


                {/* 
                    Cho phép chọn khoảng thời gian.
                    Hiện tại chỉ dùng để làm giao diện,
                    chưa xử lý thay đổi dữ liệu.
                */}
                <select className="px-3 py-2 rounded-lg border border-white/[0.08] bg-[#151726] text-slate-400 text-[11px] focus:outline-none focus:border-violet-500/30 transition-colors cursor-pointer">

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
            <div className="h-[260px] flex">

                {/* 
                    Trục dọc của biểu đồ.
                    Các giá trị này hiện tại chỉ là
                    số liệu mẫu để dựng giao diện.
                */}
                <div className="w-10 flex flex-col justify-between pb-7 text-[10px] text-slate-600 font-medium">

                    <span>30M</span>

                    <span>20M</span>

                    <span>10M</span>

                    <span>0</span>

                </div>


                {/* 
                    Khu vực chính của biểu đồ.
                    Các cột doanh thu sẽ nằm ở đây.
                */}
                <div className="relative flex-1 h-full">


                    {/* 
                        Các đường ngang giúp người dùng
                        dễ nhìn và so sánh chiều cao cột.
                    */}
                    <div className="absolute inset-0 bottom-7" style={{
                        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 25%)'
                    }} />


                    {/* =========================
                        CÁC CỘT BIỂU ĐỒ
                    ========================= */}
                    <div className="absolute inset-0 bottom-7 flex items-end justify-around gap-3 px-2">


                        {/* Thứ 2 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 shadow-lg shadow-violet-500/15 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "35%" }}
                        />


                        {/* Thứ 3 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 shadow-lg shadow-violet-500/15 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "55%" }}
                        />


                        {/* Thứ 4 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 shadow-lg shadow-violet-500/15 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "42%" }}
                        />


                        {/* Thứ 5 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "72%" }}
                        />


                        {/* Thứ 6 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 shadow-lg shadow-violet-500/15 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "58%" }}
                        />


                        {/* Thứ 7 */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "85%" }}
                        />


                        {/* Chủ nhật */}
                        <div
                            className="w-8 max-w-[12%] min-h-[15px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 shadow-lg shadow-violet-500/15 hover:-translate-y-1 hover:brightness-125 transition-all duration-200 cursor-pointer"
                            style={{ height: "68%" }}
                        />

                    </div>


                    {/* =========================
                        TÊN CÁC NGÀY
                    ========================= */}
                    <div className="absolute left-0 right-0 bottom-0 flex justify-around text-[10px] text-slate-600 font-medium">

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