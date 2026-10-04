"use client";

import { useEffect, useState } from "react";

const initialForm = {
    ten_nguoi_nhan: "",
    so_dien_thoai: "",
    dia_chi: "",
    phuong_thuc_thanh_toan: "",
    khuyen_mai_id: "",
    tong_tien: "",
    trang_thai: "0",
};

export default function OrderForm({
    order,
    onSubmit,
    onCancel,
    loading = false,
}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // Khi sửa thì đưa dữ liệu đơn hàng vào form
    useEffect(() => {
        if (order) {
            setFormData({
                
                ten_nguoi_nhan: order.ten_nguoi_nhan ?? "",
                so_dien_thoai: order.so_dien_thoai ?? "",
                dia_chi: order.dia_chi ?? "",
                phuong_thuc_thanh_toan:
                    order.phuong_thuc_thanh_toan ?? "",
                khuyen_mai_id: order.khuyen_mai_id ?? "",
                tong_tien: order.tong_tien ?? "",
                trang_thai: String(order.trang_thai ?? "0"),
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
    }, [order]);

    // Cập nhật dữ liệu form
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Xóa lỗi của field đang nhập
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Kiểm tra dữ liệu cơ bản trước khi gửi
    const validateForm = () => {
        const newErrors = {};

       

        if (!formData.ten_nguoi_nhan.trim()) {
            newErrors.ten_nguoi_nhan = "Vui lòng nhập tên người nhận.";
        }

        if (!formData.so_dien_thoai.trim()) {
            newErrors.so_dien_thoai = "Vui lòng nhập số điện thoại.";
        }

        if (!formData.dia_chi.trim()) {
            newErrors.dia_chi = "Vui lòng nhập địa chỉ.";
        }

        if (!formData.phuong_thuc_thanh_toan.trim()) {
            newErrors.phuong_thuc_thanh_toan =
                "Vui lòng nhập phương thức thanh toán.";
        }

        if (
            formData.tong_tien === "" ||
            Number(formData.tong_tien) < 0
        ) {
            newErrors.tong_tien = "Tổng tiền không hợp lệ.";
        }

        if (!formData.trang_thai) {
            newErrors.trang_thai = "Vui lòng chọn trạng thái.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Gửi dữ liệu
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const data = {
            

           

            ten_nguoi_nhan: formData.ten_nguoi_nhan.trim(),

            so_dien_thoai: formData.so_dien_thoai.trim(),

            dia_chi: formData.dia_chi.trim(),

            phuong_thuc_thanh_toan:
                formData.phuong_thuc_thanh_toan.trim(),

            khuyen_mai_id: formData.khuyen_mai_id
                ? Number(formData.khuyen_mai_id)
                : null,

            tong_tien: Number(formData.tong_tien),

            // Backend yêu cầu string
            trang_thai: String(formData.trang_thai),
        };

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
          

                

            

            {/* Tên người nhận */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Tên người nhận
                </label>

                <input
                    type="text"
                    name="ten_nguoi_nhan"
                    value={formData.ten_nguoi_nhan}
                    onChange={handleChange}
                    placeholder="Nhập tên người nhận"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                />

                {errors.ten_nguoi_nhan && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.ten_nguoi_nhan}
                    </p>
                )}
            </div>

            {/* Số điện thoại */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Số điện thoại
                </label>

                <input
                    type="text"
                    name="so_dien_thoai"
                    value={formData.so_dien_thoai}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                />

                {errors.so_dien_thoai && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.so_dien_thoai}
                    </p>
                )}
            </div>

            {/* Địa chỉ */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Địa chỉ giao hàng
                </label>

                <textarea
                    name="dia_chi"
                    value={formData.dia_chi}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ giao hàng"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                />

                {errors.dia_chi && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.dia_chi}
                    </p>
                )}
            </div>

            {/* Thanh toán */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phương thức thanh toán
                </label>

                <select
                    name="phuong_thuc_thanh_toan"
                    value={formData.phuong_thuc_thanh_toan}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#111328] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                >
                    <option value="">-- Chọn phương thức --</option>
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="Chuyển khoản">
                        Chuyển khoản
                    </option>
                    <option value="Ví điện tử">Ví điện tử</option>
                </select>

                {errors.phuong_thuc_thanh_toan && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.phuong_thuc_thanh_toan}
                    </p>
                )}
            </div>

            {/* Mã khuyến mãi */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    ID khuyến mãi
                    <span className="ml-1 text-xs text-slate-500">
                        (không bắt buộc)
                    </span>
                </label>

                <input
                    type="number"
                    name="khuyen_mai_id"
                    value={formData.khuyen_mai_id}
                    onChange={handleChange}
                    placeholder="Nhập ID khuyến mãi"
                    min="1"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                />
            </div>

            {/* Tổng tiền */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Tổng tiền
                </label>

                <input
                    type="number"
                    name="tong_tien"
                    value={formData.tong_tien}
                    onChange={handleChange}
                    placeholder="Nhập tổng tiền"
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                />

                {errors.tong_tien && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.tong_tien}
                    </p>
                )}
            </div>

            {/* Trạng thái */}
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                    Trạng thái
                </label>

                <select
                    name="trang_thai"
                    value={formData.trang_thai}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#111328] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
                >
                    <option value="0">Chờ xử lý</option>
                    <option value="1">Đang xử lý</option>
                    <option value="2">Đang giao</option>
                    <option value="3">Đã giao</option>
                    <option value="4">Đã hủy</option>
                </select>

                {errors.trang_thai && (
                    <p className="mt-1 text-xs text-rose-400">
                        {errors.trang_thai}
                    </p>
                )}
            </div>

            {/* Nút */}
            <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Đang lưu..."
                        : order
                          ? "Cập nhật đơn hàng"
                          : "Thêm đơn hàng"}
                </button>
            </div>
        </form>
    );
}