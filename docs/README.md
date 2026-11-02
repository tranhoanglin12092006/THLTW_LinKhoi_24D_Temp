# TECHNOVA - HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH DỰ ÁN

Tài liệu hướng dẫn chi tiết cách thiết lập, cấu hình môi trường, khởi chạy và sử dụng hệ thống Website Thương Mại Điện Tử **TECHNOVA** (Kiến trúc Fullstack: **Backend Laravel 11** & **Frontend Next.js 16 / React 19**).

---

## 📑 MỤC LỤC
1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Cấu Trúc Thư Mục & Các File Cần Thiết Khi Tải Về](#2-cấu-trúc-thư-mục--các-file-cần-thiết-khi-tải-về)
3. [Yêu Cầu Môi Trường (Prerequisites)](#3-yêu-cầu-môi-trường-prerequisites)
4. [Hướng Dẫn Cài Đặt & Khởi Chạy Backend (Laravel)](#4-hướng-dẫn-cài-đặt--khởi-chạy-backend-laravel)
5. [Hướng Dẫn Cài Đặt & Khởi Chạy Frontend (Next.js)](#5-hướng-dẫn-cài-đặt--khởi-chạy-frontend-nextjs)
6. [Tài Khoản Đăng Nhập & Hướng Dẫn Kiểm Thử Chức Năng](#6-tài-khoản-đăng-nhập--hướng-dẫn-kiểm-thử-chức-năng)
7. [Các File Bổ Sung Để Đảm Bảo Tải Về Là Chạy Được](#7-các-file-bổ-sung-để-đảm-bảo-tải-về-là-chạy-được)
8. [Xử Lý Lỗi Thường Gặp (Troubleshooting)](#8-xử-lý-lỗi-thường-gặp-troubleshooting)

---

## 1. TỔNG QUAN HỆ THỐNG

- **Tên dự án:** TECHNOVA - Hệ thống bán lẻ thiết bị điện tử & công nghệ cao cấp.
- **Backend:** 
  - Framework: **Laravel 11** (PHP 8.2+)
  - Xác thực: **Laravel Sanctum** (RESTful API Token)
  - Cơ sở dữ liệu: **MySQL / MariaDB** (với Eloquent ORM, Soft Deletes)
  - Thanh toán: Tích hợp cổng thanh toán trực tuyến **VNPAY Sandbox**
  - Gửi mail: SMTP Gmail thông báo đơn hàng và liên hệ
- **Frontend:**
  - Framework: **Next.js 16** (App Router) + **React 19**
  - Giao diện: **Tailwind CSS v4**, Thiết kế Glassmorphism & Responsive
  - Quản lý trạng thái: React Hooks, Axios, LocalStorage (đồng bộ giỏ hàng khách và tài khoản)
- **Cổng mặc định:**
  - Backend API: `http://127.0.0.1:8000`
  - Frontend Client: `http://localhost:3000`

---

## 2. CẤU TRÚC THƯ MỤC & CÁC FILE CẦN THIẾT KHI TẢI VỀ

```text
THLTW_LinKhoi_24D_Temp/
├── Backend/                 # Mã nguồn Backend Laravel 11
│   ├── app/                 # Controllers, Models, Requests
│   ├── config/              # Cấu hình hệ thống
│   ├── database/            # Migrations, Seeders (DatabaseSeeder.php)
│   ├── routes/              # api.php, web.php, console.php
│   ├── storage/             # Thư mục lưu trữ logs, cache, uploads
│   ├── .env.example         # File mẫu cấu hình môi trường Backend
│   ├── composer.json        # Danh sách thư viện PHP
│   └── artisan              # Công cụ dòng lệnh của Laravel
├── frontend/                # Mã nguồn Frontend Next.js 16
│   ├── src/                 # Giao diện, components, hooks, services
│   │   ├── app/             # App Router: (shop), admin, dashboard
│   │   ├── components/      # UI components (Header, Footer, Cart, ProductCard,...)
│   │   ├── config/          # api.js cấu hình địa chỉ Backend
│   │   └── services/        # Gọi API đăng nhập, sản phẩm, đơn hàng,...
│   ├── .env.example         # File mẫu cấu hình môi trường Frontend
│   ├── .env.local.example   # File mẫu cấu hình biến môi trường cục bộ
│   └── package.json         # Danh sách thư viện Node.js
└── docs/                    # Tài liệu & Dữ liệu khởi tạo
    ├── README.md            # Tài liệu hướng dẫn chi tiết này
    ├── linkhoi_backend.sql  # Toàn bộ cấu trúc CSDL + Dữ liệu mẫu + 2 Tài khoản
    ├── .env.backend.example # Bản sao mẫu .env cho Backend
    └── .env.frontend.example# Bản sao mẫu .env cho Frontend
```

> [!NOTE]
> **Tại sao thư mục `node_modules` và `vendor` không cần đưa vào docs hoặc đính kèm?**
> Thư mục `node_modules` (Node.js) và `vendor` (PHP) chứa các gói phụ thuộc bên thứ ba rất nặng (hàng trăm MB). Theo tiêu chuẩn kỹ thuật phần mềm, các thư mục này được liệt kê trong `.gitignore` và không cần đóng gói vì bất kỳ ai khi tải dự án về chỉ cần chạy lệnh `composer install` (cho Backend) và `npm install` (cho Frontend) là máy sẽ tự động tải về chính xác 100% phiên bản tương thích từ `composer.lock` và `package-lock.json`.

---

## 3. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

Trước khi khởi chạy dự án, hãy đảm bảo máy tính đã cài đặt các công cụ sau:
1. **PHP:** Phiên bản `>= 8.2` (kiểm tra bằng lệnh `php -v`).
   - Cần bật các extension trong file `php.ini`: `pdo_mysql`, `openssl`, `mbstring`, `curl`, `fileinfo`.
2. **Composer:** Quản lý gói PHP phiên bản `>= 2.0` (kiểm tra bằng lệnh `composer -v`).
3. **Node.js:** Phiên bản `>= 18.x` hoặc `20.x` (kiểm tra bằng lệnh `node -v`).
4. **NPM:** Phiên bản `>= 9.x` (kiểm tra bằng lệnh `npm -v` hoặc `npm.cmd -v`).
5. **Cơ sở dữ liệu:** **MySQL >= 8.0** hoặc **MariaDB >= 10.4** (có thể sử dụng XAMPP, Laragon, WampServer hoặc MySQL độc lập).

---

## 4. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY BACKEND (LARAVEL)

Mở một cửa sổ Terminal (PowerShell / Command Prompt / Git Bash) tại thư mục gốc của dự án:

### Bước 4.1: Di chuyển vào thư mục Backend
```bash
cd Backend
```

### Bước 4.2: Cài đặt các gói thư viện PHP
```bash
composer install
```

### Bước 4.3: Thiết lập file cấu hình môi trường `.env`
Sao chép từ file `.env.example` tạo thành file `.env`:
- **Trên Windows (cmd / PowerShell):**
  ```powershell
  copy .env.example .env
  ```
- **Trên macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

Kiểm tra thông số kết nối Database trong file `Backend/.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=linkhoi_backend
DB_USERNAME=root
DB_PASSWORD=
```
*(Nếu MySQL của bạn có mật khẩu root, hãy điền vào `DB_PASSWORD=mật_khẩu_của_bạn`).*

### Bước 4.4: Tạo mã khóa bảo mật ứng dụng (APP_KEY)
```bash
php artisan key:generate
```

### Bước 4.5: Tạo cơ sở dữ liệu và Nhập dữ liệu mẫu
1. Mở công cụ quản trị MySQL (ví dụ **phpMyAdmin** tại `http://localhost/phpmyadmin` hoặc **HeidiSQL / Navicat**).
2. Tạo một Database mới có tên:
   - **Database Name:** `linkhoi_backend`
   - **Collation:** `utf8mb4_unicode_ci`
3. Nhập dữ liệu (Import):
   - Chọn database `linkhoi_backend` vừa tạo -> Chọn tab **Import** (Nhập).
   - Chọn file `docs/linkhoi_backend.sql` trong thư mục `docs/`.
   - Nhấn **Import** (Thực hiện).
   
> [!TIP]
> **Cách thay thế (Dùng Laravel Migrate & Seeder):**
> Nếu không dùng phpMyAdmin để import SQL, bạn có thể chạy trực tiếp lệnh sau để Laravel tự tạo bảng và nạp 2 tài khoản mẫu + thiết lập website:
> ```bash
> php artisan migrate:fresh --seed
> ```

### Bước 4.6: Tạo liên kết thư mục lưu trữ ảnh (Storage Link)
Để hình ảnh sản phẩm và bài viết hiển thị công khai trên website:
```bash
php artisan storage:link
```

### Bước 4.7: Khởi chạy Backend Server
```bash
php artisan serve
```
- Khi màn hình hiển thị:
  ```text
  INFO  Server running on [http://127.0.0.1:8000].
  ```
  => Backend Laravel đã hoạt động thành công! Giữ cửa sổ terminal này chạy ngầm.

---

## 5. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY FRONTEND (NEXT.JS)

Mở một **cửa sổ Terminal mới** (không tắt terminal Backend đang chạy):

### Bước 5.1: Di chuyển vào thư mục Frontend
```bash
cd frontend
```

### Bước 5.2: Cài đặt các gói thư viện Node.js
```bash
npm install
```
*(Trên Windows nếu gặp lỗi ExecutionPolicy với PowerShell, dùng lệnh: `npm.cmd install`)*

### Bước 5.3: Thiết lập file môi trường `.env.local`
Sao chép từ file `.env.example` hoặc `.env.local.example`:
- **Trên Windows:**
  ```powershell
  copy .env.example .env.local
  ```
- **Trên macOS / Linux:**
  ```bash
  cp .env.example .env.local
  ```

Nội dung file `frontend/.env.local` chuẩn:
```env
# Địa chỉ API gọi sang Laravel Backend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Địa chỉ thư mục chứa ảnh upload từ Backend
NEXT_PUBLIC_IMAGE_URL=http://127.0.0.1:8000/storage/
```

### Bước 5.4: Khởi chạy Frontend Server
```bash
npm run dev
```
*(Hoặc `npm.cmd run dev` trên Windows)*

- Khi màn hình hiển thị:
  ```text
  ▲ Next.js 16.3.6
  - Local:        http://localhost:3000
  ✓ Ready in 1500ms
  ```
- Mở trình duyệt web và truy cập vào: **`http://localhost:3000`**

---

## 6. TÀI KHOẢN ĐĂNG NHẬP & HƯỚNG DẪN KIỂM THỬ CHỨC NĂNG

Hệ thống đã tích hợp sẵn cơ chế phân quyền đăng nhập thông minh tại cùng một cổng đăng nhập duy nhất:
👉 **Trang Đăng Nhập:** **`http://localhost:3000/login`**

---

### 👤 6.1. TÀI KHOẢN NGƯỜI DÙNG (USER / MEMBER)

| Thông Tin | Chi Tiết |
| :--- | :--- |
| **Email đăng nhập** | `lin111@gmail.com` |
| **Mật khẩu** | `12345678` |
| **Vai trò (Role)** | `member` (Khách hàng thành viên) |
| **Trang đăng nhập** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Trang chuyển hướng sau khi đăng nhập** | Tự động chuyển hướng về Trang chủ Shop: [http://localhost:3000/](http://localhost:3000/) |

#### Các tính năng kiểm thử của Người dùng:
1. **Xem & Lọc sản phẩm:** Truy cập `/products` để tìm kiếm sản phẩm theo danh mục (Điện thoại, Laptop, Tai nghe, Tablet, Phụ kiện), theo thương hiệu (Apple, Samsung, Sony, Asus), sắp xếp theo giá.
2. **Xem chi tiết sản phẩm & Đánh giá:** Bấm vào sản phẩm (ví dụ `/products/1`), xem thông số kỹ thuật, gửi đánh giá 5 sao kèm bình luận nhận xét.
3. **Giỏ hàng & Đặt hàng:**
   - Thêm sản phẩm vào giỏ hàng (`/cart`).
   - Cập nhật số lượng, xóa sản phẩm, tự động tính tổng tiền.
   - Nhập thông tin nhận hàng, chọn phương thức thanh toán:
     - **Thanh toán khi nhận hàng (COD)**.
     - **Thanh toán trực tuyến qua VNPAY Sandbox** (Chuyển tiếp đến cổng VNPAY an toàn, hỗ trợ test thanh toán thành công và cập nhật trạng thái đơn hàng).
4. **Tin tức công nghệ:** Xem các bài viết công nghệ tại `/posts`.
5. **Gửi liên hệ:** Truy cập `/contact` để gửi tin nhắn thắc mắc, yêu cầu hỗ trợ đến ban quản trị.
6. **Quản lý tài khoản:** Truy cập `/profile` để xem thông tin cá nhân và lịch sử các đơn hàng đã đặt.

---

### 👑 6.2. TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)

| Thông Tin | Chi Tiết |
| :--- | :--- |
| **Email đăng nhập** | `tranhoanglin33@gmail.com` |
| **Mật khẩu** | `12345678` |
| **Vai trò (Role)** | `admin` (Quản trị viên tối cao) |
| **Trang đăng nhập** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Trang chuyển hướng sau khi đăng nhập** | Tự động nhận diện quyền Admin và chuyển thẳng vào Admin Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |

#### Các tính năng kiểm thử của Quản trị viên:
1. **Bảng điều khiển (Dashboard - `/dashboard`):** Thống kê tổng doanh thu, số lượng đơn hàng, số lượng khách hàng, số lượng sản phẩm tồn kho, biểu đồ tăng trưởng.
2. **Quản lý sản phẩm (`/admin/products`):**
   - Thêm sản phẩm mới, upload ảnh đại diện và bộ sưu tập ảnh phụ.
   - Chỉnh sửa thông tin, giá bán, giá khuyến mãi.
   - Xóa sản phẩm (hỗ trợ Soft Delete - Xóa an toàn).
3. **Quản lý danh mục & Thương hiệu (`/admin/categories`, `/admin/brands`):** Thêm mới, chỉnh sửa, bật/tắt hiển thị danh mục và hãng sản xuất.
4. **Quản lý kho hàng (`/admin/stock`):**
   - Tạo phiếu nhập kho khi nhập hàng từ nhà cung cấp (tự động cộng dồn tồn kho).
   - Tạo phiếu xuất kho (xuất trả hoặc xuất hủy).
   - Xem báo cáo chi tiết tồn kho từng sản phẩm.
5. **Quản lý đơn hàng (`/admin/orders`):**
   - Xem danh sách đơn hàng khách đã đặt.
   - Cập nhật tiến độ: *Chờ xác nhận -> Đã xác nhận -> Đang giao hàng -> Đã giao hàng / Đã hủy*.
   - Cập nhật trạng thái thanh toán (*Chưa thanh toán / Đã thanh toán qua VNPAY*).
6. **Quản lý người dùng (`/admin/users`):** Xem danh sách tài khoản, khóa hoặc kích hoạt tài khoản thành viên.
7. **Quản lý bài viết (`/admin/posts`):** Đăng bài viết tin tức công nghệ mới, soạn thảo nội dung phong phú, upload ảnh thumbnail.
8. **Hộp thư liên hệ (`/admin/contacts`):** Đọc các câu hỏi và ý kiến đóng góp của khách hàng gửi từ form liên hệ và viết nội dung phản hồi.
9. **Quản lý Menu & Trang đơn (`/admin/menus`, `/admin/pages`):** Điều chỉnh cấu trúc menu thanh điều hướng và bài viết giới thiệu, chính sách bảo hành.
10. **Cài đặt hệ thống (`/admin/settings`):** Cập nhật Tên Website, Hotline chăm sóc khách hàng, Email, Địa chỉ trụ sở, Link mạng xã hội, Chế độ bảo trì hệ thống.

---

## 7. CÁC FILE BỔ SUNG ĐỂ ĐẢM BẢO TẢI VỀ LÀ CHẠY ĐƯỢC

Để tránh trường hợp người khác tải về từ Git hoặc file Zip bị thiếu các tệp môi trường/dữ liệu do `.gitignore` loại trừ, dự án đã bổ sung đầy đủ:

1. **File cấu hình môi trường mẫu:**
   - `Backend/.env.example`: Đầy đủ cấu hình chuẩn của Laravel, kết nối CSDL `linkhoi_backend`, cấu hình Mail, VNPAY, Session database.
   - `frontend/.env.example` và `frontend/.env.local.example`: Khai báo sẵn API Base URL trỏ vào `http://127.0.0.1:8000/api` và đường dẫn ảnh `http://127.0.0.1:8000/storage/`.
   - `docs/.env.backend.example` & `docs/.env.frontend.example`: Thư mục `docs/` lưu sẵn bản dự phòng để người dùng có thể tham khảo hoặc copy ngay lập tức.
2. **File Cơ sở dữ liệu mẫu hoàn chỉnh (`docs/linkhoi_backend.sql`):**
   - Đã tạo sẵn đầy đủ 33 bảng migrations mới nhất.
   - Đã chèn sẵn 2 tài khoản người dùng (`lin111@gmail.com` và `tranhoanglin33@gmail.com`) với mật khẩu `12345678` mã hóa bằng chuẩn Bcrypt.
   - Đã chèn sẵn danh mục, thương hiệu, sản phẩm công nghệ mẫu và toàn bộ cấu hình hệ thống website.
3. **Thư mục Framework & Storage của Laravel:**
   - Các thư mục `storage/framework/cache`, `storage/framework/sessions`, `storage/framework/views`, `storage/logs`, `bootstrap/cache` đều có tệp `.gitignore` giữ chỗ để khi tải về không bị thiếu thư mục hoặc lỗi quyền ghi file tạm.
4. **File khởi tạo tự động (`Backend/database/seeders/DatabaseSeeder.php`):**
   - Đã lập trình sẵn để nếu người dùng dùng lệnh `php artisan migrate:fresh --seed`, hệ thống sẽ tự động tạo đúng 2 tài khoản trên và cấu hình hệ thống mà không lo lỗi cú pháp.

---

## 8. XỬ LÝ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

### ❓ Lỗi 1: Lỗi Execution Policy trên PowerShell Windows
- **Hiện tượng:** Chạy `npm` hoặc script báo lỗi `File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`.
- **Cách xử lý:** 
  - Cách 1: Sử dụng lệnh `npm.cmd` thay vì `npm` (ví dụ: `npm.cmd install`, `npm.cmd run dev`).
  - Cách 2: Mở PowerShell với quyền **Run as Administrator** và chạy:
    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    ```

### ❓ Lỗi 2: Lỗi "No application encryption key has been specified"
- **Hiện tượng:** Backend Laravel báo lỗi 500 khi vừa cài đặt.
- **Cách xử lý:** Mở thư mục `Backend` và chạy lệnh:
  ```bash
  php artisan key:generate
  php artisan config:clear
  ```

### ❓ Lỗi 3: Lỗi kết nối CSDL (SQLSTATE[HY000] [1049] Unknown database 'linkhoi_backend')
- **Hiện tượng:** Laravel báo lỗi không tìm thấy database khi gọi API hoặc chạy migrate.
- **Cách xử lý:** Đảm bảo MySQL đã bật trong XAMPP/Laragon và bạn đã tạo database `linkhoi_backend` bằng phpMyAdmin hoặc lệnh:
  ```sql
  CREATE DATABASE linkhoi_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

### ❓ Lỗi 4: Lỗi không hiển thị hình ảnh sản phẩm trên Frontend
- **Hiện tượng:** Giao diện hiển thị icon ảnh vỡ hoặc ảnh placeholder.
- **Cách xử lý:** 
  1. Đảm bảo đã chạy lệnh liên kết thư mục ảnh ở Backend:
     ```bash
     cd Backend
     php artisan storage:link
     ```
  2. Kiểm tra file `frontend/.env.local` đã có dòng `NEXT_PUBLIC_IMAGE_URL=http://127.0.0.1:8000/storage/` chưa và khởi động lại `npm run dev`.

### ❓ Lỗi 5: Lỗi CORS khi gọi API giữa Frontend và Backend
- **Hiện tượng:** Trình duyệt báo `Blocked by CORS policy`.
- **Cách xử lý:** Đảm bảo Backend đang chạy đúng cổng `http://127.0.0.1:8000` và Frontend chạy tại `http://localhost:3000`. Cấu hình CORS của Laravel trong `Backend/config/cors.php` đã cho phép `supports_credentials => true` và `allowed_origins => ['*']` hoặc `http://localhost:3000`.

---

## 🚀 TÓM TẮT THAO TÁC NHANH (QUICK START)

```bash
# 1. KHỞI TẠO BACKEND
cd Backend
copy .env.example .env
composer install
php artisan key:generate
# (Tạo DB linkhoi_backend và Import file docs/linkhoi_backend.sql)
php artisan storage:link
php artisan serve

# 2. KHỞI TẠO FRONTEND (Mở tab Terminal thứ 2)
cd frontend
copy .env.example .env.local
npm install
npm run dev

# 3. TRUY CẬP WEBSITE
# - Cửa hàng: http://localhost:3000
# - Đăng nhập User: lin111@gmail.com / 12345678
# - Đăng nhập Admin: tranhoanglin33@gmail.com / 12345678 (tự chuyển về /dashboard)
```
