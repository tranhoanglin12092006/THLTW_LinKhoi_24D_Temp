"use client";

import ProductForm from "./ProductForm";

export default function ProductModal({
    product,
    categories,
    brands,
    onClose,
    onSubmit,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#14162e] p-6 shadow-2xl">

                {/* Header modal */}
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div>
                        <h2 className="text-base font-bold text-white">
                            {product
                                ? "Chỉnh sửa sản phẩm"
                                : "Thêm sản phẩm mới"}
                        </h2>

                        <p className="mt-1 text-[11px] text-slate-500">
                            {product
                                ? "Cập nhật thông tin sản phẩm"
                                : "Nhập thông tin sản phẩm mới"}
                        </p>
                    </div>

                    {/* Nút đóng */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                        ✕
                    </button>
                </div>


                <ProductForm
                    product={product}
                    categories={categories}
                    brands={brands}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />

            </div>
        </div>
    );
}