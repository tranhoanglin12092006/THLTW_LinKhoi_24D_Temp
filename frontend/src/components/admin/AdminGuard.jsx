"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * =========================================================================
 * COMPONENT: AdminGuard (Bảo vệ quyền truy cập Admin)
 * Chức năng:
 * - Kiểm tra thông tin người dùng từ localStorage & API
 * - Nếu là Member / Khách (không phải admin):
 *   + Chặn hoàn toàn màn hình, không hiển thị bất kỳ nội dung xem/thêm/sửa/xóa nào
 *   + Hiển thị thông báo sang trọng, rõ ràng ở chính giữa màn hình (Access Denied Modal)
 *   + Cung cấp nút quay về Trang chủ hoặc Đăng nhập bằng tài khoản Quản trị
 * =========================================================================
 */
export default function AdminGuard({ children }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Chỉ chạy trên client-side
        if (typeof window === "undefined") return;

        try {
            const userStr = localStorage.getItem("user");
            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("access_token") ||
                localStorage.getItem("admin_token");

            if (!token || !userStr) {
                // Chưa đăng nhập -> Chặn truy cập
                setIsAuthorized(false);
                setCurrentUser(null);
            } else {
                const user = JSON.parse(userStr);
                setCurrentUser(user);

                // Kiểm tra vai trò: Phải là 'admin'
                if (user && user.vai_tro === "admin") {
                    setIsAuthorized(true);
                } else {
                    // Là member/user thông thường -> Chặn truy cập
                    setIsAuthorized(false);
                }
            }
        } catch (err) {
            console.error("Lỗi kiểm tra quyền truy cập:", err);
            setIsAuthorized(false);
        } finally {
            setChecked(true);
        }
    }, []);

    // 1. Khi đang kiểm tra thông tin phiên đăng nhập
    if (!checked) {
        return (
            <div className="min-h-screen bg-[#090b14] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-4" />
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                    Đang xác minh quyền quản trị...
                </p>
            </div>
        );
    }

    // 2. Nếu ĐÚNG là Admin -> Cho phép hiển thị nội dung trang quản trị
    if (isAuthorized) {
        return <>{children}</>;
    }

    // 3. Nếu KHÔNG PHẢI ADMIN (User/Member thông thường hoặc Chưa đăng nhập)
    // -> CHẶN HOÀN TOÀN KHÔNG CHO XEM, THÊM, SỬA, XÓA & HIỂN THỊ THÔNG BÁO GIỮA MÀN HÌNH
    return (
        <div className="fixed inset-0 z-[99999] min-h-screen w-full bg-[#090b14]/95 backdrop-blur-xl flex items-center justify-center p-4">
            {/* Hiệu ứng hào quang nền */}
            <div className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Hộp thông báo chặn quyền ở chính giữa màn hình */}
            <div className="relative w-full max-w-lg rounded-3xl border border-red-500/20 bg-[#0f1222]/90 p-8 sm:p-10 text-center shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in-95 duration-300">
                {/* Icon Cảnh Báo Khiên Đỏ */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600/20 to-orange-500/10 border border-red-500/30 text-red-400 shadow-inner">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.002A11.959 11.959 0 0112 2.714zm0 14.036a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        />
                    </svg>
                </div>

                {/* Tiêu đề lỗi */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 mb-3">
                    403 - TRUY CẬP BỊ TỪ CHỐI
                </span>
                
                <h2 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
                    Không Có Quyền Quản Trị
                </h2>

                {/* Chi tiết người dùng và thông báo */}
                <div className="mt-4 text-sm text-slate-300 space-y-2 leading-relaxed">
                    <p>
                        Tài khoản hiện tại của bạn là{" "}
                        <span className="font-semibold text-violet-400">
                            {currentUser ? (currentUser.ho_ten || currentUser.name || currentUser.email) : "Khách vãng lai"}
                        </span>{" "}
                        với vai trò{" "}
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {currentUser?.vai_tro === "member" || !currentUser?.vai_tro ? "Khách hàng (Member)" : currentUser.vai_tro}
                        </span>.
                    </p>
                    <p className="text-slate-400 text-xs">
                        Khu vực này chỉ dành riêng cho tài khoản <span className="text-white font-medium">Quản trị viên (Admin)</span>. Bạn không có quyền xem dữ liệu, thêm mới, chỉnh sửa hay xóa bất kỳ nội dung nào trong hệ thống quản trị.
                    </p>
                </div>

                {/* Các nút hành động */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/10 text-sm font-semibold transition-all duration-200"
                    >
                        <span>🛒 Quay về Cửa hàng</span>
                    </Link>

                    <Link
                        href="/login"
                        onClick={() => {
                            // Xóa token cũ để người dùng đăng nhập tài khoản khác
                            localStorage.removeItem("token");
                            localStorage.removeItem("access_token");
                            localStorage.removeItem("admin_token");
                            localStorage.removeItem("user");
                            window.dispatchEvent(new Event("userUpdated"));
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-600/30 transition-all duration-200"
                    >
                        <span>🔑 Đăng nhập Admin</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
