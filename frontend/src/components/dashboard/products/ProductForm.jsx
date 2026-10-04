"use client";

import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";

export default function ProductForm({
    product,
    categories,
    brands,
    onSubmit,
    onClose,
}) {
    const [form, setForm] = useState({
        danh_muc_id: "",
        thuong_hieu_id: "",
        ten: "",
        duong_dan: "",
        gia: "",
        gia_khuyen_mai: "",
        so_luong_ton: "",
        mo_ta: "",
        hinh_anh: null,
        trang_thai: 1,
    });

    // Nếu sửa sản phẩm thì đưa dữ liệu cũ vào form
    useEffect(() => {
        if (product) {
            setForm({
                danh_muc_id: product.danh_muc_id || "",
                thuong_hieu_id: product.thuong_hieu_id || "",
                ten: product.ten || "",
                duong_dan: product.duong_dan || "",
                // "350000.00" -> 350000 (bỏ phần thập phân thừa)
                gia: product.gia ? Math.round(Number(product.gia)) : "",
                gia_khuyen_mai: product.gia_khuyen_mai
                    ? Math.round(Number(product.gia_khuyen_mai))
                    : "",
                so_luong_ton: product.so_luong_ton || "",
                mo_ta: product.mo_ta || "",
                hinh_anh: null,
                // Backend trả true/false -> đổi sang số 1/0
                // (cũng giúp ô chọn "Đang bán / Ngừng bán" hiển thị đúng)
                trang_thai: product.trang_thai === false || product.trang_thai === 0 ? 0 : 1,
            });
        }
    }, [product]);

    // Tạo slug từ tên sản phẩm
    const createSlug = (value) => {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Nhập tên thì tự tạo slug
    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            ten: value,
            duong_dan: createSlug(value),
        }));
    };

    // Nhận file ảnh
    const handleImageChange = (file) => {
        setForm((prev) => ({
            ...prev,
            hinh_anh: file,
        }));
    };

    // Gửi form
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("danh_muc_id", form.danh_muc_id);
        formData.append("thuong_hieu_id", form.thuong_hieu_id);
        formData.append("ten", form.ten);
        formData.append("duong_dan", form.duong_dan);
        formData.append("gia", form.gia);
        formData.append("gia_khuyen_mai", form.gia_khuyen_mai);
        formData.append("so_luong_ton", form.so_luong_ton);
        formData.append("mo_ta", form.mo_ta);
        // Select trả về chuỗi "1" hoặc "0"
        // Number() đổi sang số, rồi gửi đúng 1 hoặc 0 cho Laravel
        formData.append("trang_thai", Number(form.trang_thai) ? 1 : 0);

        // Chỉ gửi ảnh một lần
        if (form.hinh_anh instanceof File) {
            formData.append("hinh_anh", form.hinh_anh);
        }

        // Kiểm tra dữ liệu gửi lên
        console.log("===== FORM DATA =====");

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        onSubmit(formData);
    };

    // Class dùng chung cho input
    const inputClass =
        "w-full rounded-xl border border-white/[0.08] bg-[#1a1d3b] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none";

    // Class dùng chung cho label
    const labelClass =
        "mb-1.5 block text-xs font-semibold text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên sản phẩm */}
            <div>
                <label className={labelClass}>
                    Tên sản phẩm{" "}
                    <span className="text-red-400">*</span>
                </label>

                <input
                    type="text"
                    value={form.ten}
                    onChange={handleNameChange}
                    required
                    placeholder="Nhập tên sản phẩm..."
                    className={inputClass}
                />
            </div>

            {/* Đường dẫn */}
            <div>
                <label className={labelClass}>
                    Đường dẫn (Slug){" "}
                    <span className="text-red-400">*</span>
                </label>

                <input
                    type="text"
                    name="duong_dan"
                    value={form.duong_dan}
                    onChange={handleChange}
                    required
                    placeholder="ao-thun-nike"
                    className={`${inputClass} font-mono`}
                />
            </div>

            {/* Danh mục + thương hiệu */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>
                        Danh mục{" "}
                        <span className="text-red-400">*</span>
                    </label>

                    <select
                        name="danh_muc_id"
                        value={form.danh_muc_id}
                        onChange={handleChange}
                        required
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="">
                            — Chọn danh mục —
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.ten}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClass}>
                        Thương hiệu{" "}
                        <span className="text-red-400">*</span>
                    </label>

                    <select
                        name="thuong_hieu_id"
                        value={form.thuong_hieu_id}
                        onChange={handleChange}
                        required
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="">
                            — Chọn thương hiệu —
                        </option>

                        {brands.map((brand) => (
                            <option
                                key={brand.id}
                                value={brand.id}
                            >
                                {brand.ten}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Giá + giá khuyến mãi + tồn kho */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className={labelClass}>
                        Giá{" "}
                        <span className="text-red-400">*</span>
                    </label>

                    <input
                        type="number"
                        name="gia"
                        value={form.gia}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="0"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        Giá khuyến mãi
                    </label>

                    <input
                        type="number"
                        name="gia_khuyen_mai"
                        value={form.gia_khuyen_mai}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className={labelClass}>
                        Số lượng tồn{" "}
                        <span className="text-red-400">*</span>
                    </label>

                    <input
                        type="number"
                        name="so_luong_ton"
                        value={form.so_luong_ton}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="0"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Hình ảnh */}
            <div>
                <label className={labelClass}>
                    Hình ảnh
                </label>

                <ProductImage
                    currentImage={product?.hinh_anh}
                    onChange={handleImageChange}
                />
            </div>

            {/* Mô tả */}
            <div>
                <label className={labelClass}>
                    Mô tả
                </label>

                <textarea
                    name="mo_ta"
                    value={form.mo_ta}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Nhập mô tả sản phẩm..."
                    className={`${inputClass} resize-none`}
                />
            </div>

            {/* Trạng thái */}
            <div>
                <label className={labelClass}>
                    Trạng thái
                </label>

                <select
                    name="trang_thai"
                    value={form.trang_thai}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                >
                    <option value="1">
                        🟢 Đang bán
                    </option>

                    <option value="0">
                        🔴 Ngừng bán
                    </option>
                </select>
            </div>

            {/* Nút */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500"
                >
                    {product
                        ? "Lưu thay đổi"
                        : "Tạo sản phẩm"}
                </button>
            </div>
        </form>
    );
}