// Component OrderStatus dùng để hiển thị
// tình trạng các đơn hàng trên Dashboard
export default function OrderStatus() {
    return (
        // Card chứa toàn bộ phần thống kê đơn hàng
        <div className="rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm p-6 min-h-[330px]">

            {/* =========================
                PHẦN TIÊU ĐỀ
            ========================= */}
            <div className="flex items-center justify-between mb-5">

                <div>

                    {/* Tên phần thống kê */}
                    <h3 className="m-0 text-[15px] font-semibold text-white">
                        Đơn hàng
                    </h3>

                    {/* Mô tả ngắn */}
                    <p className="mt-1.5 text-[11px] text-slate-500">
                        Trạng thái đơn hàng
                    </p>

                </div>

            </div>


            {/* =========================
                VÒNG TRÒN THỐNG KÊ
            ========================= */}
            <div className="flex justify-center my-5">

                {/* 
                    Vòng tròn hiển thị tổng số đơn hàng.
                    Hiện tại số 128 là dữ liệu mẫu.
                */}
                <div className="w-[130px] h-[130px] rounded-full flex flex-col items-center justify-center border-[10px] border-indigo-900/80 shadow-xl shadow-indigo-500/10 bg-[#16182b]">

                    {/* Tổng số đơn hàng */}
                    <strong className="text-2xl font-bold text-white">
                        128
                    </strong>

                    {/* Nội dung mô tả */}
                    <span className="mt-1 text-[10px] text-slate-500">
                        Tổng đơn
                    </span>

                </div>

            </div>


            {/* =========================
                DANH SÁCH TRẠNG THÁI
            ========================= */}
            <div className="flex flex-col gap-3.5 mt-6">


                {/* =========================
                    ĐƠN HÀNG CHỜ XỬ LÝ
                ========================= */}
                <div className="grid grid-cols-[10px_1fr_auto] items-center gap-3 text-[12px] text-slate-400 hover:text-slate-300 transition-colors">

                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/40" />

                    {/* Tên trạng thái */}
                    <span>Chờ xử lý</span>

                    {/* Số lượng đơn */}
                    <strong className="text-white font-semibold">
                        24
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG ĐANG XỬ LÝ
                ========================= */}
                <div className="grid grid-cols-[10px_1fr_auto] items-center gap-3 text-[12px] text-slate-400 hover:text-slate-300 transition-colors">

                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/40" />

                    <span>Đang xử lý</span>

                    <strong className="text-white font-semibold">
                        31
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG HOÀN THÀNH
                ========================= */}
                <div className="grid grid-cols-[10px_1fr_auto] items-center gap-3 text-[12px] text-slate-400 hover:text-slate-300 transition-colors">

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />

                    <span>Hoàn thành</span>

                    <strong className="text-white font-semibold">
                        62
                    </strong>

                </div>


                {/* =========================
                    ĐƠN HÀNG ĐÃ HỦY
                ========================= */}
                <div className="grid grid-cols-[10px_1fr_auto] items-center gap-3 text-[12px] text-slate-400 hover:text-slate-300 transition-colors">

                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/40" />

                    <span>Đã hủy</span>

                    <strong className="text-white font-semibold">
                        11
                    </strong>

                </div>

            </div>

        </div>
    );
}