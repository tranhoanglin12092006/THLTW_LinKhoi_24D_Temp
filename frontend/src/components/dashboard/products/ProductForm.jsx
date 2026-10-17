
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
    const [extraImages, setExtraImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);

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

    // Dua thong tin san pham cu vao form khi sua
    useEffect(() => {
        setExtraImages([]);
        setDeletedImageIds([]);

        if (product) {
            setForm({
                danh_muc_id: product.danh_muc_id || "",
                thuong_hieu_id: product.thuong_hieu_id || "",
                ten: product.ten || "",
                duong_dan: product.duong_dan || "",
                gia: product.gia
                    ? Math.round(Number(product.gia))
                    : "",
                gia_khuyen_mai: product.gia_khuyen_mai
                    ? Math.round(Number(product.gia_khuyen_mai))
                    : "",
                so_luong_ton: product.so_luong_ton || "",
                mo_ta: product.mo_ta || "",
                hinh_anh: null,
                trang_thai:
                    product.trang_thai === false ||
                        product.trang_thai === 0
                        ? 0
                        : 1,
            });
        } else {
            setForm({
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
        }
    }, [product]);

    // Tao slug tu ten san pham
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

    // Xu ly thay doi input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Tu tao slug khi nhap ten san pham
    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            ten: value,
            duong_dan: createSlug(value),
        }));
    };

    // Nhan anh dai dien moi
    const handleImageChange = (file) => {
        setForm((prev) => ({
            ...prev,
            hinh_anh: file,
        }));
    };

    // Danh dau anh cu can xoa
    const handleDeleteOldImage = (imageId) => {
        const id = Number(imageId);

        if (!Number.isInteger(id) || id <= 0) {
            console.error("ID anh cu khong hop le:", imageId);
            return;
        }

        setDeletedImageIds((prev) =>
            prev.includes(id) ? prev : [...prev, id]
        );
    };

    // Gui thong tin san pham va danh sach anh len component cha
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
        formData.append(
            "trang_thai",
            Number(form.trang_thai) ? 1 : 0
        );

        // Chi gui anh dai dien neu chon anh moi
        if (form.hinh_anh instanceof File) {
            formData.append("hinh_anh", form.hinh_anh);
        }

        console.log("Danh sach anh phu moi:", extraImages);
        console.log("ID anh cu can xoa:", deletedImageIds);

        // Gui du lieu cho component cha xu ly
        onSubmit(formData, extraImages, deletedImageIds);
    };

    const inputClass =
        "w-full rounded-xl border border-white/[0.08] bg-[#1a1d3b] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none";

    const labelClass =
        "mb-1.5 block text-xs font-semibold text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ten san pham */}
            <div>
                <label className={labelClass}>
                    Ten san pham <span className="text-red-400">*</span>
                </label>

                <input
                    type="text"
                    value={form.ten}
                    onChange={handleNameChange}
                    required
                    placeholder="Nhap ten san pham..."
                    className={inputClass}
                />
            </div>

            {/* Duong dan */}
            <div>
                <label className={labelClass}>
                    Duong dan (Slug) <span className="text-red-400">*</span>
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

            {/* Danh muc va thuong hieu */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className={labelClass}>
                        Danh muc <span className="text-red-400">*</span>
                    </label>

                    <select
                        name="danh_muc_id"
                        value={form.danh_muc_id}
                        onChange={handleChange}
                        required
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="">— Chon danh muc —</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.ten}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClass}>
                        Thuong hieu <span className="text-red-400">*</span>
                    </label>

                    <select
                        name="thuong_hieu_id"
                        value={form.thuong_hieu_id}
                        onChange={handleChange}
                        required
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="">— Chon thuong hieu —</option>

                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.ten}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Gia va so luong */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className={labelClass}>
                        Gia <span className="text-red-400">*</span>
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
                    <label className={labelClass}>Gia khuyen mai</label>

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
                        So luong ton <span className="text-red-400">*</span>
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

            {/* Hinh anh */}
            <div>
                <label className={labelClass}>Hinh anh</label>

                <ProductImage
                    key={product?.id ?? "new"}
                    currentImage={product?.hinh_anh}
                    currentExtraImages={product?.hinh_anh_phu || []}
                    onChange={handleImageChange}
                    onImagesChange={setExtraImages}
                    onDeleteOldImage={handleDeleteOldImage}
                />
            </div>

            {/* Mo ta */}
            <div>
                <label className={labelClass}>Mo ta</label>

                <textarea
                    name="mo_ta"
                    value={form.mo_ta}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Nhap mo ta san pham..."
                    className={`${inputClass} resize-none`}
                />
            </div>

            {/* Trang thai */}
            <div>
                <label className={labelClass}>Trang thai</label>

                <select
                    name="trang_thai"
                    value={form.trang_thai}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                >
                    <option value="1">Dang ban</option>
                    <option value="0">Ngung ban</option>
                </select>
            </div>

            {/* Nut thao tac */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                    Huy
                </button>

                <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500"
                >
                    {product ? "Luu thay doi" : "Tao san pham"}
                </button>
            </div>
        </form>
    );
}
