/**
 * Component Hiển thị đánh giá của khách hàng (Testimonials)
 * Tăng sự tin cậy và trải nghiệm mua sắm e-commerce chân thực
 */
export default function TestimonialSection() {
    const reviews = [
        {
            name: "Trần Minh Hoàng",
            role: "Software Engineer • Hà Nội",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            product: "MacBook Pro 16 M3 Max",
            comment: "Dịch vụ giao hàng hỏa tốc trong 2h thật sự ấn tượng! Máy nguyên seal chính hãng, bảo hành kích hoạt chuẩn Apple. Nhân viên tư vấn nhiệt tình, đóng gói cẩn thận 3 lớp chống sốc.",
            rating: 5,
            date: "2 ngày trước"
        },
        {
            name: "Nguyễn Thảo My",
            role: "Creative Designer • TP. Hồ Chí Minh",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            product: "iPhone 16 Pro Max 256GB",
            comment: "Chính sách trả góp 0% qua thẻ tín dụng xử lý cực nhanh, chỉ mất chưa đầy 5 phút. Giá tại TECHNOVA tốt hơn nhiều chuỗi bán lẻ khác mà còn được tặng thêm củ sạc GaN 65W.",
            rating: 5,
            date: "1 tuần trước"
        },
        {
            name: "Lê Đức Anh",
            role: "Game Streamer • Đà Nẵng",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
            product: "Sony WH-1000XM5 Hi-Res",
            comment: "Tai nghe chống ồn đỉnh cao, âm bass chắc nịch. Đợt mua có bảo hành 1 đổi 1 trong 30 ngày nên mình rất yên tâm. Chắc chắn sẽ tiếp tục ủng hộ TECHNOVA cho dàn gaming gear tới!",
            rating: 5,
            date: "2 tuần trước"
        }
    ];

    return (
        <section className="py-14 sm:py-20 bg-slate-100/70 dark:bg-slate-900/40 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header Tiêu đề */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                        ⭐ 99.8% Khách Hàng Hài Lòng
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Khách hàng nói gì về TECHNOVA?
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        Hơn 50.000 tín đồ công nghệ đã tin tưởng lựa chọn mua sắm thiết bị chính hãng và trải nghiệm dịch vụ chăm sóc tận tâm tại hệ thống của chúng tôi.
                    </p>
                </div>

                {/* Grid 3 đánh giá khách hàng */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((r, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                {/* 5 Sao vàng + Tag đã mua hàng */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(r.rating)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                        ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                        ✓ Đã mua hàng
                                    </span>
                                </div>

                                {/* Sản phẩm đã mua */}
                                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg w-fit">
                                    Thiết bị: {r.product}
                                </div>

                                {/* Trích dẫn nhận xét */}
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{r.comment}"
                                </p>
                            </div>

                            {/* Thông tin người đánh giá */}
                            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <img
                                    src={r.avatar}
                                    alt={r.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                        {r.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-400">
                                        {r.role} • {r.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
