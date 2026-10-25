"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// Tên event dùng để phát thông báo toàn cục
const TOAST_EVENT = "technova:show_toast";

/**
 * Hàm gọi hiển thị Toast từ bất cứ đâu trong ứng dụng (Client Component hoặc hàm JS)
 * Ví dụ:
 *   showToast("Đã thêm vào giỏ hàng!", "success");
 *   showToast.success("Thành công!");
 *   showToast.error("Đã xảy ra lỗi!");
 *   showToast.warning("Vui lòng đăng nhập!");
 *   showToast.info("Thông tin cập nhật mới");
 */
export function showToast(message, type = "success", duration = 3500, title = "") {
    if (typeof window === "undefined") return;

    const event = new CustomEvent(TOAST_EVENT, {
        detail: {
            id: Date.now() + Math.random().toString(36).substring(2, 7),
            message,
            type, // "success" | "error" | "warning" | "info"
            duration,
            title,
        },
    });
    window.dispatchEvent(event);
}

showToast.success = (msg, duration = 3500, title = "Thành công") =>
    showToast(msg, "success", duration, title);

showToast.error = (msg, duration = 4000, title = "Lỗi") =>
    showToast(msg, "error", duration, title);

showToast.warning = (msg, duration = 4000, title = "Cảnh báo") =>
    showToast(msg, "warning", duration, title);

showToast.info = (msg, duration = 3500, title = "Thông báo") =>
    showToast(msg, "info", duration, title);

// Gắn vào window để có thể gọi nhanh từ bất cứ đâu (kể cả hàm cũ)
if (typeof window !== "undefined") {
    window.showToast = showToast;
}

// Cấu hình icon và màu sắc cho từng loại thông báo
const TOAST_CONFIG = {
    success: {
        badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        borderHover: "border-emerald-500/40 shadow-emerald-500/10",
        progressBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
        defaultTitle: "Thành công",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
    error: {
        badgeBg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        borderHover: "border-rose-500/40 shadow-rose-500/10",
        progressBar: "bg-gradient-to-r from-rose-500 to-red-400",
        defaultTitle: "Đã có lỗi",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    warning: {
        badgeBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        borderHover: "border-amber-500/40 shadow-amber-500/10",
        progressBar: "bg-gradient-to-r from-amber-500 to-yellow-400",
        defaultTitle: "Chú ý",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    info: {
        badgeBg: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20",
        borderHover: "border-blue-500/40 shadow-blue-500/10",
        progressBar: "bg-gradient-to-r from-blue-500 to-cyan-400",
        defaultTitle: "Thông báo",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    },
};

/**
 * Component hiển thị từng Toast đơn lẻ với animation và thanh tiến trình thời gian
 */
function ToastItem({ toast, onRemove }) {
    const { id, message, type = "success", duration = 3500, title } = toast;
    const config = TOAST_CONFIG[type] || TOAST_CONFIG.success;
    const displayTitle = title || config.defaultTitle;

    const [isClosing, setIsClosing] = useState(false);
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const remainingTimeRef = useRef(duration);

    const handleDismiss = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onRemove(id);
        }, 250); // Đợi hiệu ứng trượt ra hoàn tất
    }, [id, onRemove]);

    // Xử lý countdown và thanh progress
    useEffect(() => {
        if (duration <= 0) return;

        let frameId;
        const totalDuration = duration;

        const updateProgress = () => {
            if (!isPaused) {
                const elapsed = Date.now() - startTimeRef.current;
                const remaining = Math.max(0, remainingTimeRef.current - elapsed);
                const pct = (remaining / totalDuration) * 100;
                setProgress(pct);

                if (remaining <= 0) {
                    handleDismiss();
                    return;
                }
            }
            frameId = requestAnimationFrame(updateProgress);
        };

        startTimeRef.current = Date.now();
        frameId = requestAnimationFrame(updateProgress);

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [duration, isPaused, handleDismiss]);

    // Tạm dừng khi di chuột vào toast
    const handleMouseEnter = () => {
        setIsPaused(true);
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - (Date.now() - startTimeRef.current));
    };

    const handleMouseLeave = () => {
        startTimeRef.current = Date.now();
        setIsPaused(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`pointer-events-auto relative group overflow-hidden rounded-2xl border bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-xl shadow-slate-900/10 dark:shadow-black/40 transition-all duration-300 ease-out select-none ${
                config.borderHover
            } ${
                isClosing
                    ? "opacity-0 translate-x-12 scale-95"
                    : "opacity-100 translate-x-0 scale-100 animate-slide-in"
            }`}
            style={{
                minWidth: "320px",
                maxWidth: "420px",
            }}
        >
            <div className="flex items-start gap-3.5">
                {/* Icon loại thông báo */}
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${config.badgeBg}`}>
                    {config.icon}
                </div>

                {/* Nội dung thông báo */}
                <div className="flex-1 min-w-0 pt-0.5">
                    {displayTitle && (
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-1">
                            {displayTitle}
                        </h4>
                    )}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words font-medium">
                        {message}
                    </p>
                </div>

                {/* Nút đóng (X) */}
                <button
                    onClick={handleDismiss}
                    type="button"
                    title="Đóng thông báo"
                    className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Thanh tiến trình thời gian mượt mà ở đáy */}
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/80">
                    <div
                        className={`h-full transition-all duration-75 ease-linear ${config.progressBar}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * ToastContainer: Đặt ở Layout chính (góc trên cùng bên phải màn hình)
 */
export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleNewToast = (e) => {
            const detail = e.detail;
            if (!detail || !detail.message) return;

            setToasts((prev) => {
                // Giữ tối đa 5 toast cùng lúc để tránh tràn màn hình
                const next = [...prev, detail];
                return next.slice(-5);
            });
        };

        window.addEventListener(TOAST_EVENT, handleNewToast);
        return () => {
            window.removeEventListener(TOAST_EVENT, handleNewToast);
        };
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    if (toasts.length === 0) return null;

    return (
        <aside
            aria-live="polite"
            aria-label="Thông báo hệ thống"
            className="fixed top-5 right-5 z-[999999] flex flex-col gap-3 pointer-events-none w-auto max-w-[calc(100vw-2.5rem)]"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </aside>
    );
}
