"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/profile?tab=orders");
    }, [router]);

    return (
        <main className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Đang chuyển đến danh sách đơn hàng...
            </p>
        </main>
    );
}
