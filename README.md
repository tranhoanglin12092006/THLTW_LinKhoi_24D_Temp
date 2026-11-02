# TECHNOVA - HỆ THỐNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ LIN KHOI

Dự án Website thương mại điện tử chuyên cung cấp thiết bị công nghệ và điện tử cao cấp, được xây dựng với kiến trúc hiện đại:
- **Backend:** Laravel 11 (PHP 8.2+), Laravel Sanctum, MySQL, VNPAY Gateway, Gmail SMTP.
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4.

---

## ⚡ KHỞI CHẠY NHANH

### 1. Khởi động Backend (Laravel)
```bash
cd Backend
copy .env.example .env
composer install
php artisan key:generate
# Tạo CSDL linkhoi_backend và Import file docs/linkhoi_backend.sql
php artisan storage:link
php artisan serve
```
Backend chạy tại: `http://127.0.0.1:8000`

### 2. Khởi động Frontend (Next.js)
```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:3000`

---

## 🔐 TÀI KHOẢN ĐĂNG NHẬP MẪU

Đăng nhập tại: **`http://localhost:3000/login`**

| Vai trò | Email | Mật khẩu | Trang chuyển hướng |
| :--- | :--- | :--- | :--- |
| **Người dùng (Member)** | `lin111@gmail.com` | `12345678` | Trang chủ Shop (`/`) |
| **Quản trị viên (Admin)** | `tranhoanglin33@gmail.com` | `12345678` | Bảng điều khiển Quản trị (`/dashboard`) |

---

## 📖 TÀI LIỆU CHI TIẾT
Vui lòng đọc hướng dẫn cài đặt và sử dụng chi tiết tại: **[docs/README.md](docs/README.md)**.
