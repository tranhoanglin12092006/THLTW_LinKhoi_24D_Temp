
import axiosClient from "@/lib/axiosClient";

// Lay du lieu thong ke tu Laravel
export async function getDashboardData() {
    const res = await axiosClient.get("/dashboard");
    return res;
}
