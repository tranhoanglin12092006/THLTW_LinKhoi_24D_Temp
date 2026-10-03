// Component StatCard dùng để hiển thị một ô thống kê trên Dashboard
export default function StatCard({
    title,
    value,
    description,
    color,
    icon
}) {

    // Ánh xạ tên màu sang Tailwind classes
    const colorMap = {
        purple: {
            gradient: "from-violet-500 to-purple-600",
            glow: "shadow-violet-500/20",
            bg: "bg-violet-500/10",
            text: "text-violet-400",
            ring: "ring-violet-500/20",
        },
        blue: {
            gradient: "from-blue-500 to-indigo-600",
            glow: "shadow-blue-500/20",
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            ring: "ring-blue-500/20",
        },
        pink: {
            gradient: "from-pink-500 to-rose-600",
            glow: "shadow-pink-500/20",
            bg: "bg-pink-500/10",
            text: "text-pink-400",
            ring: "ring-pink-500/20",
        },
        cyan: {
            gradient: "from-cyan-400 to-teal-500",
            glow: "shadow-cyan-500/20",
            bg: "bg-cyan-500/10",
            text: "text-cyan-400",
            ring: "ring-cyan-500/20",
        },
    };

    const c = colorMap[color] || colorMap.purple;

    return (
        // Mỗi StatCard sẽ có màu khác nhau
        // Ví dụ: purple, blue, pink, cyan
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111328]/80 backdrop-blur-sm p-5 flex justify-between items-start group hover:border-white/[0.12] transition-all duration-300 hover:shadow-xl ${c.glow}`}>

            {/* Hiệu ứng sáng nhẹ phía sau card */}
            <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${c.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />

            {/* =========================
                NỘI DUNG THỐNG KÊ
            ========================= */}
            <div className="relative z-10">

                {/* Tên của thông tin thống kê */}
                <p className={`m-0 mb-3 text-xs font-semibold uppercase tracking-wider ${c.text}`}>
                    {title}
                </p>

                {/* Số liệu chính */}
                <h2 className="m-0 mb-1.5 text-3xl font-bold text-white">
                    {value}
                </h2>

                {/* Mô tả ngắn của số liệu */}
                <span className="text-[11px] text-slate-500">
                    {description}
                </span>

            </div>


            {/* =========================
                KHU VỰC ICON
            ========================= */}
            <div className={`relative z-10 w-11 h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>

        </div>
    );
}