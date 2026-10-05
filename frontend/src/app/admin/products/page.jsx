"use client";

import { useEffect, useState } from "react";

import {
    getAllProducts,
    getDeletedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    restoreProduct,
    forceDeleteProduct,
} from "@/services/productServices";

import { getAllCategories } from "@/services/categoryServices";
import { getAllBrands } from "@/services/brandServices";

import Pagination from "@/components/common/Pagination";
import ProductTable from "@/components/dashboard/products/ProductTable";
import ProductModal from "@/components/dashboard/products/ProductModal";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [showTrash, setShowTrash] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const pageSize = 10;

    // Lấy danh sách sản phẩm
    const loadProducts = async () => {
        setLoading(true);

        try {
            const res = await getAllProducts();

            const data = Array.isArray(res)
                ? res
                : res?.data || [];

            setProducts(data);
        } catch (error) {
            console.error(error);
            alert("Không thể lấy danh sách sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách sản phẩm đã xóa mềm
    const loadDeletedProducts = async () => {
        setLoading(true);

        try {
            const res = await getDeletedProducts();

            const data = Array.isArray(res)
                ? res
                : res?.data || [];

            setProducts(data);
        } catch (error) {
            console.error(error);
            alert("Không thể lấy danh sách sản phẩm trong thùng rác!");
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh mục và thương hiệu
    const loadData = async () => {
        try {
            const [categoryRes, brandRes] = await Promise.all([
                getAllCategories(),
                getAllBrands(),
            ]);

            setCategories(
                Array.isArray(categoryRes)
                    ? categoryRes
                    : categoryRes?.data || []
            );

            setBrands(
                Array.isArray(brandRes)
                    ? brandRes
                    : brandRes?.data || []
            );
        } catch (error) {
            console.error(error);
        }
    };

    // Chạy khi mở trang
    useEffect(() => {
        loadProducts();
        loadData();
    }, []);

    // Mở form thêm sản phẩm
    const handleAdd = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    // Mở form sửa sản phẩm
    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    // Thêm hoặc sửa sản phẩm
    const handleSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                alert("✓ Cập nhật sản phẩm thành công!");
            } else {
                await createProduct(formData);
                alert("✓ Thêm sản phẩm thành công!");
            }

            setShowModal(false);
            setEditingProduct(null);
            await loadProducts();
        } catch (error) {
            console.error("LỖI CẬP NHẬT:", error);
            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);
            console.error("ERRORS:", error.response?.data?.errors);

            const message =
                error.response?.data?.message ||
                Object.values(error.response?.data?.errors || {})
                    .flat()
                    .join("\n") ||
                "Không thể lưu sản phẩm!";

            alert(message);
        }
    };

    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            return;
        }

        try {
            await deleteProduct(id);

            alert("✓ Xóa sản phẩm thành công!");

            await loadProducts();
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                "Không thể xóa sản phẩm!";

            alert(message);
        }
    };

    const handleRestore = async (id) => {
        if (!confirm("Bạn có chắc muốn khôi phục sản phẩm này?")) return;

        try {
            await restoreProduct(id);

            alert("✓ Khôi phục sản phẩm thành công!");

            // Tải lại danh sách trong thùng rác.
            await loadDeletedProducts();
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Khôi phục sản phẩm thất bại!"
            );
        }
    };

    const handleForceDelete = async (id) => {
        if (
            !confirm(
                "Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?\n\nSản phẩm và hình ảnh sẽ bị xóa hoàn toàn và không thể khôi phục!"
            )
        ) {
            return;
        }

        try {
            await forceDeleteProduct(id);

            alert("✓ Xóa vĩnh viễn sản phẩm thành công!");

            // Tải lại danh sách trong thùng rác.
            await loadDeletedProducts();
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Xóa vĩnh viễn sản phẩm thất bại!"
            );
        }
    };

    // Tìm kiếm sản phẩm
    const filteredProducts = products.filter((product) =>
        product.ten
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    // Tính số trang
    const totalItems = filteredProducts.length;

    const totalPages = Math.ceil(
        totalItems / pageSize
    );

    // Lấy sản phẩm của trang hiện tại
    const startIndex =
        (currentPage - 1) * pageSize;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + pageSize
    );

    // Chuyển giữa danh sách sản phẩm và thùng rác
    const handleToggleTrash = async () => {
        const nextShowTrash = !showTrash;

        setShowTrash(nextShowTrash);
        setSearch("");
        setCurrentPage(1);

        if (nextShowTrash) {
            await loadDeletedProducts();
        } else {
            await loadProducts();
        }
    };

    return (

        <div className="space-y-6">
            {/* Tiêu đề + tìm kiếm + nút thêm */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Tiêu đề */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {showTrash ? "Thùng rác sản phẩm" : "Quản lý sản phẩm"}
                    </h1>

                    <p className="mt-1 text-xs text-slate-400">
                        {showTrash
                            ? "Danh sách các sản phẩm đã xóa"
                            : "Quản lý danh sách sản phẩm trong hệ thống"}
                    </p>
                </div>

                {/* Tìm kiếm + nút thêm */}
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder={
                            showTrash
                                ? "Tìm sản phẩm đã xóa..."
                                : "Tìm kiếm sản phẩm..."
                        }
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-56 rounded-xl border border-white/[0.08] bg-[#151728] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 transition-colors focus:border-violet-500 focus:outline-none sm:w-64"
                    />

                    <button
                        type="button"
                        onClick={handleToggleTrash}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/[0.08] bg-[#151728] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1c1f35]"
                    >
                        {showTrash ? "← Sản phẩm" : "🗑️ Thùng rác"}
                    </button>

                    {!showTrash && (
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition-colors hover:bg-violet-500"
                        >
                            <span className="text-base leading-none">
                                +
                            </span>

                            Thêm sản phẩm
                        </button>
                    )}
                </div>
            </div>



            {/* Bảng sản phẩm */}
            <ProductTable
                products={currentProducts}
                categories={categories}
                brands={brands}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onForceDelete={handleForceDelete}
                showTrash={showTrash}
            />

            {/* Phân trang */}
            {totalPages > 0 && (
                <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 shadow-xl backdrop-blur-sm">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal thêm / sửa */}
            {showModal && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    brands={brands}
                    onClose={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}