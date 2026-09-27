// Component StatCard dùng để hiển thị một ô thống kê trên Dashboard
export default function StatCard({
    title,
    value,
    description,
    color
}) {
    return (
        // Mỗi StatCard sẽ có màu khác nhau
        // Ví dụ: purple, blue, pink, cyan
        <div className={`stat-card ${color}`}>

            {/* =========================
                NỘI DUNG THỐNG KÊ
            ========================= */}
            <div className="stat-content">

                {/* Tên của thông tin thống kê */}
                <p>{title}</p>

                {/* Số liệu chính */}
                <h2>{value}</h2>

                {/* Mô tả ngắn của số liệu */}
                <span>{description}</span>

            </div>


            {/* =========================
                KHU VỰC ICON
                Để trống để bạn tự thêm icon
            ========================= */}
            <div className="stat-icon">
                {/* ICON SẼ THÊM SAU */}
            </div>

        </div>
    );
}