"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe, updateProfile, changePassword, logoutUser } from "@/services/authServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { getMyOrders, cancelMyOrder } from "@/services/orderServices";


// Bảng chuyển mã trạng thái (số) thành chữ + màu hiển thị
// Mã số phải khớp backend và trang quản trị: 0..4
const ORDER_STATUS = {
    0: { text: "Chờ xử lý", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
    1: { text: "Đang xử lý", cls: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
    2: { text: "Đang giao", cls: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20", dot: "bg-violet-500" },
    3: { text: "Đã giao", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    4: { text: "Đã hủy", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
};

// Lấy danh sách sản phẩm trong một đơn.
// Tên field tùy OrderResource của bạn, nên thử lần lượt từng tên.
function getOrderDetails(order) {
    return (
        order.chi_tiet_don_hang ||
        order.chi_tiet_don_hangs ||
        order.chiTietDonHangs ||
        []
    );
}

/**
 * =========================================================================
 * TRANG QUẢN LÝ THÔNG TIN TÀI KHOẢN & CẬP NHẬT PROFILE
 * Bám sát cấu trúc folder tranhoanglin-frontend
 * 
 * Chức năng:
 * 1. Lấy thông tin user đăng nhập từ API Backend (GET /api/me)
 * 2. Cập nhật hồ sơ cá nhân (PUT /api/profile): Họ tên, số điện thoại, địa chỉ
 * 3. Đồng bộ lại dữ liệu user lưu trong localStorage & kích hoạt sự kiện Header
 * 4. Đổi mật khẩu tài khoản (POST /api/change-password)
 * 5. Đăng xuất tài khoản an toàn
 * =========================================================================
 */
export default function ProfilePage() {
    const router = useRouter();

    // 1. Quản lý tab hoạt động: "info" | "orders" | "security" | "vip"
    const [activeTab, setActiveTab] = useState("info");

    // 2. Trạng thái tải dữ liệu
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // 3. State thông tin người dùng
    const [formData, setFormData] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        dia_chi: "",
        vai_tro: "member",
    });

    // 4. State đổi mật khẩu
    const [passwordForm, setPasswordForm] = useState({
        mat_khau_cu: "",
        mat_khau_moi: "",
        mat_khau_moi_confirmation: "",
    });

    // 5. Thông báo Toast Popup
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
    };

    // 6. Lấy thông tin user khi vừa vào trang (GET /api/me)
    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Kiểm tra token trước, nếu chưa đăng nhập thì chuyển về trang login
            const token = localStorage.getItem("token") || localStorage.getItem("access_token");
            if (!token) {
                router.push("/login");
                return;
            }

            // Gọi API lấy dữ liệu user mới nhất từ máy chủ
            const res = await getMe();
            const user = res?.user || res?.data || res;

            if (user) {
                setFormData({
                    ho_ten: user.ho_ten || user.name || "",
                    email: user.email || "",
                    so_dien_thoai: user.so_dien_thoai || user.phone || "",
                    dia_chi: user.dia_chi || user.address || "",
                    vai_tro: user.vai_tro || "member",
                });

                // Cập nhật lại localStorage để các component khác (như Header) đồng bộ
                localStorage.setItem("user", JSON.stringify(user));
                window.dispatchEvent(new Event("userUpdated"));
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin user:", error);

            // Nếu token hết hạn hoặc lỗi 401 thì yêu cầu đăng nhập lại
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("access_token");
                localStorage.removeItem("admin_token");
                localStorage.removeItem("user");
                router.push("/login");
            } else {
                // Thử đọc từ localStorage dự phòng nếu mất mạng
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const u = JSON.parse(storedUser);
                    setFormData({
                        ho_ten: u.ho_ten || u.name || "",
                        email: u.email || "",
                        so_dien_thoai: u.so_dien_thoai || u.phone || "",
                        dia_chi: u.dia_chi || u.address || "",
                        vai_tro: u.vai_tro || "member",
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // 7. Xử lý lưu cập nhật hồ sơ cá nhân (PUT /api/profile)
    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!formData.ho_ten.trim()) {
            showToast("Vui lòng nhập họ và tên của bạn!", "error");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ho_ten: formData.ho_ten.trim(),
                so_dien_thoai: formData.so_dien_thoai?.trim() || null,
                dia_chi: formData.dia_chi?.trim() || null,
            };

            // Gọi API cập nhật thông tin cá nhân
            const res = await updateProfile(payload);
            const updatedUser = res?.user || res?.data || res;

            // Cập nhật lại state & localStorage
            if (updatedUser) {
                // Giữ lại email và các trường khác
                const newUserData = {
                    ...JSON.parse(localStorage.getItem("user") || "{}"),
                    ...updatedUser,
                };
                localStorage.setItem("user", JSON.stringify(newUserData));
                window.dispatchEvent(new Event("userUpdated"));
            }

            showToast("✓ Cập nhật thông tin cá nhân thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            const errMsg = error.response?.data?.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại!";
            showToast(errMsg, "error");
        } finally {
            setSaving(false);
        }
    };

    // 8. Xử lý đổi mật khẩu (POST /api/change-password)
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordForm.mat_khau_cu) {
            showToast("Vui lòng nhập mật khẩu hiện tại!", "error");
            return;
        }

        if (passwordForm.mat_khau_moi.length < 8) {
            showToast("Mật khẩu mới phải có ít nhất 8 ký tự!", "error");
            return;
        }

        if (passwordForm.mat_khau_moi !== passwordForm.mat_khau_moi_confirmation) {
            showToast("Mật khẩu mới và xác nhận mật khẩu không khớp!", "error");
            return;
        }

        try {
            setPasswordLoading(true);

            const payload = {
                mat_khau_cu: passwordForm.mat_khau_cu,
                mat_khau_moi: passwordForm.mat_khau_moi,
                mat_khau_moi_confirmation: passwordForm.mat_khau_moi_confirmation,
            };

            const res = await changePassword(payload);
            showToast(res?.message || "✓ Đổi mật khẩu thành công!", "success");

            // Xóa trắng form đổi mật khẩu
            setPasswordForm({
                mat_khau_cu: "",
                mat_khau_moi: "",
                mat_khau_moi_confirmation: "",
            });
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            const errMsg = error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!";
            showToast(errMsg, "error");
        } finally {
            setPasswordLoading(false);
        }
    };

    // 9. Xử lý đăng xuất
    const handleLogout = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) return;

        try {
            await logoutUser();
        } catch (err) {
            console.error("Lỗi khi gọi logout:", err);
        } finally {
            // Xóa sạch token và dữ liệu trong localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("user");

            window.dispatchEvent(new Event("userUpdated"));
            router.push("/login");
        }
    };



    const [orders, setOrders] = useState([]);              // danh sách đơn lấy từ API
    const [ordersLoading, setOrdersLoading] = useState(false); // đang tải đơn?
    const [ordersError, setOrdersError] = useState("");        // lỗi khi tải đơn
    const [cancelingId, setCancelingId] = useState(null);      // id đơn đang bấm hủy

    // Gọi API lấy đơn hàng của người dùng đang đăng nhập
    const loadOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrdersError("");

            const res = await getMyOrders();

            // axiosClient trả về response.data, nên res có dạng { data: [...] }
            const body = res?.data ?? res;
            setOrders(Array.isArray(body) ? body : body?.data || []);
        } catch (err) {
            setOrdersError(
                err?.response?.data?.message ||
                "Không thể tải đơn hàng. Vui lòng thử lại."
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    // Chỉ tải đơn khi người dùng mở tab "Đơn hàng của tôi"
    useEffect(() => {
        if (activeTab === "orders") loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Bấm "Hủy đơn hàng"
    const handleCancelOrder = async (order) => {
        if (!confirm(`Bạn chắc chắn muốn hủy đơn ${order.ma_don_hang}?`)) return;

        try {
            setCancelingId(order.id);      // khóa nút trong lúc chờ
            await cancelMyOrder(order.id);
            await loadOrders();            // tải lại để thấy trạng thái mới
        } catch (err) {
            alert(err?.response?.data?.message || "Không thể hủy đơn hàng.");
        } finally {
            setCancelingId(null);
        }
    };

    // Màn hình chờ khi đang tải thông tin ban đầu
    if (loading) {
        return (
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-600 animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Đang tải dữ liệu hồ sơ cá nhân...
                </p>
            </main>
        );
    }

    return (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* =========================================================
                1. BREADCRUMBS
            ========================================================= */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Trang chủ
                </Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                    Tài khoản cá nhân
                </span>
            </nav>

            {/* Thông báo Toast Popup */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                    <div className={`px-5 py-3 rounded-2xl text-white font-semibold text-xs shadow-2xl flex items-center gap-2 ${toast.type === "error" ? "bg-red-600 shadow-red-600/30" : "bg-emerald-600 shadow-emerald-600/30"
                        }`}>
                        {toast.type === "error" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        )}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* =========================================================
                    2. SIDEBAR HỒ SƠ NGƯỜI DÙNG (4 CỘT)
                ========================================================= */}
                <aside className="lg:col-span-4 space-y-6">
                    {/* Thẻ User Mini Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-4">

                        {/* Avatar chữ cái hoặc hình ảnh */}
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="w-full h-full rounded-full border-4 border-blue-100 dark:border-blue-900/60 shadow-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center uppercase select-none">
                                {(formData.ho_ten || formData.email || "U").charAt(0)}
                            </div>
                        </div>

                        {/* Tên & Vai trò */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {formData.ho_ten || "Chưa đặt tên"}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {formData.email}
                            </p>

                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border">
                                {formData.vai_tro === "admin" ? (
                                    <span className="text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20 px-2 py-0.5 rounded-full">
                                        🛡️ Quản trị viên (Admin)
                                    </span>
                                ) : (
                                    <span className="text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 px-2 py-0.5 rounded-full">
                                        👤 Thành viên (Member)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thống kê nhanh */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="block text-[11px] text-slate-400 font-medium">Đơn hàng</span>
                                <span className="text-base font-extrabold text-slate-900 dark:text-white">{orders.length} đơn </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="block text-[11px] text-slate-400 font-medium">Điểm thưởng</span>
                                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">1.250 pts</span>
                            </div>
                        </div>

                        {/* Danh sách Tab chuyển đổi */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-left font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab("info")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === "info"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                <span>Thông tin tài khoản</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${activeTab === "orders"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
                                    <span>Đơn hàng của tôi</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                    }`}>
                                    {orders.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === "security"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <span>Bảo mật & Mật khẩu</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("vip")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === "vip"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                <span>Đặc quyền Hội viên</span>
                            </button>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                {/* =========================================================
                    3. NỘI DUNG CHÍNH (8 CỘT)
                ========================================================= */}
                <section className="lg:col-span-8 space-y-6">

                    {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                    {activeTab === "info" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Hồ sơ thông tin tài khoản
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Quản lý tên hiển thị, số điện thoại và địa chỉ nhận hàng mặc định của bạn
                                    </p>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Tài khoản đã kích hoạt
                                </span>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Họ và tên */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.ho_ten}
                                            onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                                            placeholder="Nhập họ và tên..."
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>

                                    {/* Địa chỉ Email */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Địa chỉ Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                readOnly
                                                value={formData.email}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                                            />
                                            <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                                Đã xác thực
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Số điện thoại liên hệ
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.so_dien_thoai || ""}
                                            onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                                            placeholder="Ví dụ: 0987654321"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>

                                    {/* Vai trò */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Loại tài khoản
                                        </label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={formData.vai_tro === "admin" ? "Quản trị viên (Admin)" : "Khách hàng (Member)"}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Địa chỉ chi tiết */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Địa chỉ nhận hàng chi tiết
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.dia_chi || ""}
                                        onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    />
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Đang lưu...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                <span>Lưu thay đổi thông tin</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 2: ĐƠN HÀNG CỦA TÔI */}
                    {activeTab === "orders" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            {/* Tiêu đề tab */}
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Lịch sử đơn hàng
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Xem lại và theo dõi trạng thái các đơn hàng bạn đã mua
                                    </p>
                                </div>
                                <Link
                                    href="/products"
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    + Mua sắm thêm
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {/* Trường hợp 1: đang tải */}
                                {ordersLoading ? (
                                    <p className="py-10 text-center text-sm text-slate-500">
                                        Đang tải đơn hàng...
                                    </p>

                                    /* Trường hợp 2: có lỗi */
                                ) : ordersError ? (
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-700">
                                        {ordersError}
                                        <button
                                            type="button"
                                            onClick={loadOrders}
                                            className="ml-3 font-semibold underline"
                                        >
                                            Thử lại
                                        </button>
                                    </div>

                                    /* Trường hợp 3: chưa có đơn nào */
                                ) : orders.length === 0 ? (
                                    <p className="py-10 text-center text-sm text-slate-500">
                                        Bạn chưa có đơn hàng nào.
                                    </p>

                                    /* Trường hợp 4: vẽ từng đơn */
                                ) : (
                                    orders.map((order) => {
                                        // Lấy chữ + màu theo mã trạng thái; mã lạ thì hiện "Không xác định"
                                        const status = ORDER_STATUS[Number(order.trang_thai)] || {
                                            text: "Không xác định",
                                            cls: "bg-slate-500/10 text-slate-500 border-slate-500/20",
                                            dot: "bg-slate-400",
                                        };

                                        const details = getOrderDetails(order);
                                        // Chỉ đơn "Chờ xử lý" (0) mới được hủy
                                        const canCancel = Number(order.trang_thai) === 0;

                                        return (
                                            <div
                                                key={order.id}
                                                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/30 transition-all space-y-3"
                                            >
                                                {/* Dòng đầu: mã đơn, ngày đặt, nhãn trạng thái */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                                            {order.ma_don_hang}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            • Ngày đặt:{" "}
                                                            {order.created_at
                                                                ? new Date(order.created_at).toLocaleDateString("vi-VN")
                                                                : "—"}
                                                        </span>
                                                    </div>

                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.cls}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                        {status.text}
                                                    </span>
                                                </div>

                                                {/* Các sản phẩm trong đơn */}
                                                <div className="space-y-2">
                                                    {details.map((d) => {
                                                        // Thông tin sản phẩm đi kèm dòng chi tiết đơn
                                                        const p = d.san_pham || d.sanPham || {};

                                                        return (
                                                            <div key={d.id} className="flex items-center gap-3">
                                                                <div className="w-12 h-12 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                                                                    <img
                                                                        src={p.hinh_anh_url || p.hinh_anh || "/images/no-image.png"}
                                                                        alt={p.ten || "Sản phẩm"}
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                                                        {p.ten || "Sản phẩm"}
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-500">
                                                                        {formatCurrency(Number(d.gia))} × {d.so_luong}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Dòng cuối: tổng tiền + nút hủy */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-slate-500">Tổng thanh toán:</span>
                                                        <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                                                            {formatCurrency(Number(order.tong_tien) || 0)}
                                                        </span>
                                                    </div>

                                                    {/* Nút hủy chỉ hiện khi đơn đang chờ xử lý */}
                                                    {canCancel && (
                                                        <button
                                                            type="button"
                                                            disabled={cancelingId === order.id}
                                                            onClick={() => handleCancelOrder(order)}
                                                            className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50 transition"
                                                        >
                                                            {cancelingId === order.id ? "Đang hủy..." : "Hủy đơn hàng"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: BẢO MẬT & MẬT KHẨU */}
                    {activeTab === "security" && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Đổi mật khẩu bảo mật
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Khuyên dùng mật khẩu mạnh từ 8 ký tự trở lên để bảo vệ tài khoản tốt nhất
                                </p>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Nhập mật khẩu đang dùng..."
                                        value={passwordForm.mat_khau_cu}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, mat_khau_cu: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Ít nhất 8 ký tự..."
                                            value={passwordForm.mat_khau_moi}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, mat_khau_moi: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Nhập lại mật khẩu mới..."
                                            value={passwordForm.mat_khau_moi_confirmation}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, mat_khau_moi_confirmation: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        {passwordLoading ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Đang cập nhật...</span>
                                            </>
                                        ) : (
                                            <span>Cập nhật mật khẩu mới</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 4: ĐẶC QUYỀN HỘI VIÊN VIP */}
                    {activeTab === "vip" && (
                        <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-black tracking-widest text-amber-500 uppercase">
                                        Hạng Thẻ Đặc Quyền
                                    </span>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                                        <span>VIP Member Club</span>
                                        <span className="text-amber-500">💎</span>
                                    </h2>
                                </div>
                                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25">
                                    Đang Kích Hoạt
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Chúc mừng bạn là khách hàng thân thiết tại TECHNOVA. Dưới đây là các đặc quyền dành riêng cho bạn:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🎁</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Giảm thêm 5% Mọi Đơn Hàng</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Áp dụng cộng dồn với mọi khuyến mãi hiện hành.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🚀</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Freeship Toàn Quốc</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Miễn phí giao hàng hỏa tốc cho mọi đơn hàng.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">🔄</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">1 Đổi 1 Trong 30 Ngày</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Đổi mới thiết bị miễn phí nếu phát sinh lỗi nhà sản xuất.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-amber-500/20 backdrop-blur-sm space-y-1">
                                    <span className="text-xl">👑</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Hỗ Trợ Kỹ Thuật VIP 24/7</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ưu tiên xử lý bởi đội ngũ chuyên gia hàng đầu.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </section>
            </div>
        </main>
    );
}