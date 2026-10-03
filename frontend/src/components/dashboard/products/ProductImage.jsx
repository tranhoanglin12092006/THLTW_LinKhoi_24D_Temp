"use client";

import { useEffect, useState } from "react";

export default function ProductImage({
    currentImage,
    onChange,
}) {
    const [preview, setPreview] = useState(null);

    // Khi chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Kiểm tra file có phải hình ảnh không
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file hình ảnh!");
            return;
        }

        // Giới hạn ảnh 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert("Hình ảnh không được vượt quá 2MB!");
            return;
        }

        // Tạo ảnh xem trước
        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);

        // Gửi file về ProductForm
        console.log("Tên ảnh:", file.name);
        console.log("Loại ảnh:", file.type);

        onChange(file);
    };

    // Đường dẫn ảnh cũ
    const oldImage = currentImage
        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentImage}`
        : null;

    // Xóa URL ảnh xem trước khi component bị đóng
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div>
            {/* Chọn ảnh */}
            <div className="rounded-xl border border-white/[0.08] bg-[#1a1d3b] p-3">
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="
                        w-full
                        cursor-pointer
                        text-xs
                        text-slate-300
                        file:mr-3
                        file:cursor-pointer
                        file:rounded-lg
                        file:border-0
                        file:bg-violet-600
                        file:px-3
                        file:py-2
                        file:text-xs
                        file:font-semibold
                        file:text-white
                        hover:file:bg-violet-500
                    "
                />

                <p className="mt-2 text-[11px] text-slate-500">
                    JPG, JPEG, PNG, WEBP • Tối đa 2MB
                </p>
            </div>

            {/* Hiển thị ảnh mới */}
            {preview && (
                <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-slate-300">
                        Ảnh mới
                    </p>

                    <div className="inline-block rounded-xl border border-violet-500/30 bg-[#151832] p-2">
                        <img
                            src={preview}
                            alt="Ảnh mới"
                            className="h-32 w-32 rounded-lg object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Nếu chưa chọn ảnh mới thì hiển thị ảnh cũ */}
            {!preview && oldImage && (
                <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold text-slate-300">
                        Ảnh hiện tại
                    </p>

                    <div className="inline-block rounded-xl border border-white/[0.08] bg-[#151832] p-2">
                        <img
                            src={oldImage}
                            alt="Ảnh hiện tại"
                            className="h-32 w-32 rounded-lg object-cover"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}