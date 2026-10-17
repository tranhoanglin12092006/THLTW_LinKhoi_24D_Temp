
"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductImage({
    currentImage,
    currentExtraImages = [],
    onChange,
    onImagesChange,
    onDeleteOldImage,
}) {
    const [preview, setPreview] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [removedOldImages, setRemovedOldImages] = useState([]);

    const previewUrls = useRef(new Set());

    // Thu hoi cac URL xem truoc khi component bi huy
    useEffect(() => {
        return () => {
            previewUrls.current.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            previewUrls.current.clear();
        };
    }, []);

    // Tao URL hien thi anh cu tu Backend
    const getOldImageUrl = (image) => {
        if (!image) return "";

        if (typeof image === "object") {
            image = image.image_url || image.image_path || "";
        }

        if (typeof image !== "string" || !image) return "";

        if (/^https?:\/\//i.test(image)) {
            return image;
        }

        let base =
            process.env.NEXT_PUBLIC_IMAGE_URL ||
            process.env.NEXT_PUBLIC_API_URL ||
            "http://127.0.0.1:8000";

        base = base
            .trim()
            .replace(/\/api\/?$/, "")
            .replace(/\/storage\/?$/, "")
            .replace(/\/$/, "");

        const path = image
            .replace(/^\/+/, "")
            .replace(/^storage\//, "");

        return `${base}/storage/${path}`;
    };

    // Kiem tra dinh dang va dung luong anh
    const validateImage = (file) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(`File ${file.name} phai la JPG, JPEG, PNG hoac WEBP!`);
            return false;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert(`Anh ${file.name} vuot qua 2MB!`);
            return false;
        }

        return true;
    };

    // Tao URL xem truoc va luu lai de thu hoi
    const createPreviewUrl = (file) => {
        const url = URL.createObjectURL(file);
        previewUrls.current.add(url);
        return url;
    };

    // Thu hoi URL khi khong con su dung
    const revokePreviewUrl = (url) => {
        if (!url) return;

        URL.revokeObjectURL(url);
        previewUrls.current.delete(url);
    };

    // Chon anh dai dien moi
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!validateImage(file)) {
            e.target.value = "";
            return;
        }

        if (preview) {
            revokePreviewUrl(preview);
        }

        setPreview(createPreviewUrl(file));
        onChange?.(file);

        e.target.value = "";
    };

    // Chon nhieu anh phu moi
    const handleExtraImagesChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        const validFiles = files.filter(validateImage);

        if (validFiles.length > 0) {
            const newImages = validFiles.map((file) => ({
                file,
                preview: createPreviewUrl(file),
            }));

            const updatedImages = [...extraImages, ...newImages];

            setExtraImages(updatedImages);
            onImagesChange?.(updatedImages.map((item) => item.file));
        }

        e.target.value = "";
    };

    // Xoa mot anh phu moi chon, chua tai len Backend
    const removeExtraImage = (index) => {
        const removedImage = extraImages[index];

        if (!removedImage) return;

        revokePreviewUrl(removedImage.preview);

        const updatedImages = extraImages.filter(
            (_, i) => i !== index
        );

        setExtraImages(updatedImages);
        onImagesChange?.(updatedImages.map((item) => item.file));
    };

    // Xoa tat ca anh phu moi chon
    const removeAllExtraImages = () => {
        extraImages.forEach((item) => {
            revokePreviewUrl(item.preview);
        });

        setExtraImages([]);
        onImagesChange?.([]);
    };

    // Bo chon anh dai dien moi
    const removeMainImage = () => {
        if (preview) {
            revokePreviewUrl(preview);
        }

        setPreview(null);
        onChange?.(null);
    };

    // Danh dau anh cu can xoa khi bam Luu san pham
    const removeOldImage = (image) => {
        const imageId = Number(image?.id);

        if (!Number.isInteger(imageId) || imageId <= 0) {
            alert("Anh cu khong co ID hop le, khong the xoa.");
            return;
        }

        if (removedOldImages.includes(imageId)) return;

        setRemovedOldImages((previous) => [
            ...previous,
            imageId,
        ]);

        onDeleteOldImage?.(imageId);
    };

    // Chi hien thi anh cu chua duoc danh dau xoa
    const visibleOldImages = (
        Array.isArray(currentExtraImages) ? currentExtraImages : []
    ).filter(
        (image) => !removedOldImages.includes(Number(image.id))
    );

    const oldImageUrl = getOldImageUrl(currentImage);

    return (
        <div className="space-y-5">
            {/* Anh dai dien */}
            <div>
                <p className="mb-2 text-xs font-semibold text-slate-300">
                    Anh dai dien san pham
                </p>

                <div className="rounded-xl border border-white/[0.08] bg-[#1a1d3b] p-3">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer text-xs text-slate-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-violet-500"
                    />

                    <p className="mt-2 text-[11px] text-slate-500">
                        JPG, JPEG, PNG, WEBP - Toi da 2MB moi anh
                    </p>
                </div>

                {(preview || oldImageUrl) && (
                    <div className="mt-3">
                        <p className="mb-2 text-xs font-semibold text-slate-300">
                            {preview ? "Anh dai dien moi" : "Anh dai dien hien tai"}
                        </p>

                        <div className="inline-block rounded-xl border border-violet-500/30 bg-[#151832] p-2">
                            <img
                                src={preview || oldImageUrl}
                                alt="Anh dai dien san pham"
                                className="h-36 w-36 rounded-lg object-contain"
                            />

                            {preview && (
                                <button
                                    type="button"
                                    onClick={removeMainImage}
                                    className="mt-2 w-full rounded-lg bg-red-500/10 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/20"
                                >
                                    Bo chon anh moi
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Anh phu cu */}
            <div>
                <p className="mb-2 text-xs font-semibold text-slate-300">
                    Anh phu da luu
                </p>

                {visibleOldImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {visibleOldImages.map((image) => (
                            <div
                                key={image.id}
                                className="min-w-0 rounded-xl border border-white/[0.08] bg-[#151832] p-2"
                            >
                                <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-black/20">
                                    <img
                                        src={getOldImageUrl(image)}
                                        alt="Anh phu cu"
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeOldImage(image)}
                                    className="mt-2 w-full rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                                >
                                    Xoa anh cu
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
                        Chua co anh phu cu
                    </p>
                )}

                {removedOldImages.length > 0 && (
                    <p className="mt-2 text-xs text-amber-400">
                        Da chon xoa {removedOldImages.length} anh cu.
                        Bam Luu san pham de xoa khoi he thong.
                    </p>
                )}
            </div>

            {/* Anh phu moi */}
            <div>
                <p className="mb-2 text-xs font-semibold text-slate-300">
                    Them anh phu moi
                </p>

                <div className="rounded-xl border border-white/[0.08] bg-[#1a1d3b] p-3">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleExtraImagesChange}
                        className="w-full cursor-pointer text-xs text-slate-300 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-violet-500"
                    />

                    <p className="mt-2 text-[11px] text-slate-500">
                        Co the chon nhieu anh. Toi da 2MB moi anh.
                    </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        Anh moi: {extraImages.length}
                    </p>

                    {extraImages.length > 0 && (
                        <button
                            type="button"
                            onClick={removeAllExtraImages}
                            className="text-xs font-semibold text-red-400 hover:text-red-300"
                        >
                            Xoa tat ca anh moi
                        </button>
                    )}
                </div>

                {extraImages.length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {extraImages.map((item, index) => (
                            <div
                                key={`${item.file.name}-${index}`}
                                className="min-w-0 rounded-xl border border-white/[0.08] bg-[#151832] p-2"
                            >
                                <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg bg-black/20">
                                    <img
                                        src={item.preview}
                                        alt={`Anh phu moi ${index + 1}`}
                                        className="h-full w-full object-contain"
                                    />
                                </div>

                                <p
                                    title={item.file.name}
                                    className="mt-2 truncate text-[11px] text-slate-300"
                                >
                                    {item.file.name}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-500">
                                    {(item.file.size / 1024).toFixed(0)} KB
                                </p>

                                <button
                                    type="button"
                                    onClick={() => removeExtraImage(index)}
                                    className="mt-2 w-full rounded-lg bg-red-500/10 px-2 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                                >
                                    Xoa anh moi
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
                        Chua chon anh phu moi
                    </p>
                )}
            </div>
        </div>
    );
}
