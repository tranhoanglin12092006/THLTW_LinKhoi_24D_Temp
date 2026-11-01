"use client";

import { useEffect, useState } from "react";
import { getProductReviews, addProductReview } from "@/services/reviewServices";

/**
 * Component Hiển thị Đánh giá & Form gửi nhận xét sản phẩm
 * Tự động nhận diện tài khoản đã đăng nhập (lấy họ tên + avatar), không cần nhập tên thủ công
 */
export default function ProductReviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [soSao, setSoSao] = useState(5);
    const [noiDung, setNoiDung] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [thongBao, setThongBao] = useState({ type: "", text: "" });

    // 1. Tự động lấy thông tin tài khoản người dùng đang đăng nhập từ localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStored = localStorage.getItem("user");
            if (userStored) {
                try {
                    setCurrentUser(JSON.parse(userStored));
                } catch (e) {
                    console.error("Lỗi đọc thông tin tài khoản:", e);
                }
            }
        }
    }, []);

    // 2. Tải danh sách đánh giá của sản phẩm từ Backend
    const loadReviews = async () => {
        if (!productId) return;
        try {
            const res = await getProductReviews(productId);
            const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
            setReviews(list);
        } catch (err) {
            console.error("Không thể tải đánh giá:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId]);

    // Tên hiển thị của người đánh giá
    const displayName = currentUser?.ho_ten || currentUser?.name || currentUser?.email || "Khách hàng TECHNOVA";
    const avatarUrl = currentUser?.avatar || currentUser?.avatar_url || currentUser?.hinh_anh;

    // 3. Xử lý khi khách bấm nút "Gửi đánh giá"
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!noiDung.trim()) {
            setThongBao({ type: "error", text: "Vui lòng nhập nội dung đánh giá của bạn!" });
            return;
        }

        try {
            setSubmitting(true);
            // Gửi nhận xét lên Backend kèm tên tài khoản tự động
            await addProductReview(productId, {
                ho_ten: displayName,
                so_sao: Number(soSao),
                noi_dung: noiDung,
            });

            setThongBao({ type: "success", text: "Gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến." });
            setNoiDung("");
            setSoSao(5);
            loadReviews(); // Tải lại danh sách đánh giá ngay lập tức
        } catch (err) {
            setThongBao({ type: "error", text: "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!" });
        } finally {
            setSubmitting(false);
            setTimeout(() => setThongBao({ type: "", text: "" }), 4000);
        }
    };

    // 4. Tính điểm trung bình cộng số sao
    const diemTrungBinh = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + Number(r.so_sao), 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            {/* Header: Điểm trung bình và tổng lượt đánh giá */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                        Đánh giá & Nhận xét sản phẩm
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Tất cả nhận xét thực tế từ những khách hàng đã mua sản phẩm này
                    </p>
                </div>

                {/* Hộp điểm trung bình */}
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 rounded-2xl border border-amber-200/60 dark:border-amber-800/60 self-start sm:self-auto">
                    <span className="text-3xl font-black text-amber-500">{diemTrungBinh}</span>
                    <div>
                        <div className="flex text-amber-400 text-sm">
                            {"★".repeat(Math.round(diemTrungBinh))}
                            {"☆".repeat(5 - Math.round(diemTrungBinh))}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                            {reviews.length} lượt đánh giá
                        </span>
                    </div>
                </div>
            </div>

            {/* Form viết đánh giá mới (Tự động nhận diện người đánh giá) */}
            <form onSubmit={handleSubmit} className="mt-6 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    ✍️ Viết đánh giá sản phẩm:
                </h3>

                {thongBao.text && (
                    <div className={`p-3 rounded-xl text-xs font-semibold mb-4 ${
                        thongBao.type === "success" 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    }`}>
                        {thongBao.text}
                    </div>
                )}

                {/* Thẻ hiển thị avatar và tên tài khoản người đánh giá */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center uppercase shadow-sm">
                            {displayName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                                {displayName}
                            </p>
                            {currentUser ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                    ✓ Thành viên
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">
                                    Khách mua hàng
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                            {currentUser?.email || "Đánh giá được ghi nhận với tài khoản của bạn"}
                        </p>
                    </div>
                </div>

                {/* Chọn số sao */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Đánh giá mức độ hài lòng:
                    </label>
                    <select
                        value={soSao}
                        onChange={(e) => setSoSao(e.target.value)}
                        className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                        <option value="5">⭐⭐⭐⭐⭐ (5 sao - Rất hài lòng)</option>
                        <option value="4">⭐⭐⭐⭐ (4 sao - Hài lòng)</option>
                        <option value="3">⭐⭐⭐ (3 sao - Bình thường)</option>
                        <option value="2">⭐⭐ (2 sao - Chưa ưng ý)</option>
                        <option value="1">⭐ (1 sao - Rất tệ)</option>
                    </select>
                </div>

                {/* Nội dung nhận xét */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nội dung bình luận / nhận xét:
                    </label>
                    <textarea
                        rows="3"
                        placeholder="Hãy chia sẻ trải nghiệm thực tế của bạn về sản phẩm (chất lượng, độ bền, đóng gói, giao hàng...)"
                        value={noiDung}
                        onChange={(e) => setNoiDung(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                    <span>{submitting ? "Đang gửi..." : "Gửi đánh giá"}</span>
                    <span>→</span>
                </button>
            </form>

            {/* Danh sách các đánh giá từ khách hàng */}
            <div className="mt-8 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Nhận xét từ khách hàng ({reviews.length})
                </h3>

                {loading ? (
                    <p className="text-xs text-slate-400">Đang tải các đánh giá...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 italic">
                            Chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên để lại đánh giá!
                        </p>
                    </div>
                ) : (
                    reviews.map((r) => (
                        <div 
                            key={r.id} 
                            className="p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm ring-2 ring-blue-500/20">
                                        {r.ho_ten ? r.ho_ten.charAt(0) : "K"}
                                    </div>
                                    <div>
                                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                            {r.ho_ten}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            📅 {r.created_at ? new Date(r.created_at).toLocaleDateString("vi-VN") : "Vừa xong"}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-amber-400 text-xs tracking-wider">
                                    {"★".repeat(r.so_sao)}
                                    {"☆".repeat(5 - r.so_sao)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                                {r.noi_dung}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
