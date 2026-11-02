-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2026 at 03:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `linkhoi_backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `danh_muc_bai_viet_id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_dang` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bai_viet`
--

INSERT INTO `bai_viet` (`id`, `danh_muc_bai_viet_id`, `tieu_de`, `duong_dan`, `noi_dung`, `anh_dai_dien`, `trang_thai`, `ngay_dang`, `created_at`, `updated_at`, `deleted_at`) VALUES
(16, 1, 'Ban do cong nghe hien dai', 'ban-do-cong-nghe-hien-dai', 'Kham pha ban do cong nghe hien dai voi cac linh vuc noi bat nhu tri tue nhan tao, dien toan dam may, Internet van vat va an ninh mang.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(17, 2, 'Tri tue nhan tao AI dang thay doi the gioi', 'tri-tue-nhan-tao-ai-thay-doi-the-gioi', 'Tri tue nhan tao AI duoc ung dung trong giao duc, y te, san xuat va kinh doanh. Cong nghe nay giup tu dong hoa cong viec va phan tich du lieu nhanh chong.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(18, 2, 'Ung dung AI trong doi song hang ngay', 'ung-dung-ai-trong-doi-song', 'AI xuat hien trong tro ly ao, nhan dien khuon mat, dich ngon ngu, goi y noi dung va nhieu ung dung thong minh khac.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(19, 3, 'Ban do phat trien dien thoai thong minh', 'ban-do-phat-trien-dien-thoai-thong-minh', 'Dien thoai thong minh lien tuc duoc cai tien ve hieu nang, camera, pin, man hinh va cac tinh nang AI.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(20, 3, 'Kien thuc co ban ve linh kien may tinh', 'kien-thuc-linh-kien-may-tinh', 'May tinh gom cac linh kien quan trong nhu CPU, RAM, SSD, bo mach chu va card do hoa. Moi linh kien dam nhan mot vai tro rieng trong he thong.', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(21, 3, 'Cach chon laptop phu hop nhu cau', 'cach-chon-laptop-phu-hop', 'Khi chon laptop, can xem xet CPU, RAM, dung luong SSD, kich thuoc man hinh, thoi luong pin va muc dich su dung nhu hoc tap, van phong hay gaming.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(22, 1, 'Ban do cong nghe dien toan dam may', 'ban-do-cong-nghe-dien-toan-dam-may', 'Dien toan dam may cho phep luu tru, quan ly va xu ly du lieu qua Internet, giup doanh nghiep linh hoat hon trong viec su dung tai nguyen.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(23, 1, 'Internet van vat IoT va nha thong minh', 'internet-van-vat-iot-nha-thong-minh', 'IoT ket noi cac thiet bi nhu den, camera, dieu hoa va khoa cua thong minh de nguoi dung co the dieu khien va giam sat tu xa.', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(24, 5, 'Cong nghe mang 5G va ket noi tuong lai', 'cong-nghe-mang-5g-ket-noi-tuong-lai', 'Mang 5G mang lai toc do ket noi cao va do tre thap, tao dieu kien phat trien cac ung dung nhu xe tu hanh, nha may thong minh va thuc te ao.', 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(25, 4, 'Thuc te ao VR trong giai tri va giao duc', 'thuc-te-ao-vr-giai-tri-giao-duc', 'Cong nghe VR tao ra moi truong ao de nguoi dung trai nghiem tro choi, mo phong dao tao va cac khong gian tuong tac ba chieu.', 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(26, 4, 'Thuc te tang cuong AR trong mua sam', 'thuc-te-tang-cuong-ar-mua-sam', 'AR ket hop hinh anh ky thuat so voi the gioi that. Cong nghe nay giup khach hang thu do ao, xem noi that trong khong gian va tuong tac voi san pham.', 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(27, 1, 'Blockchain va ung dung trong luu tru du lieu', 'blockchain-ung-dung-luu-tru-du-lieu', 'Blockchain la cong nghe luu tru thong tin theo cac khoi du lieu lien ket. Cong nghe nay co the duoc ung dung trong truy xuat nguon goc va xac minh giao dich.', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(28, 5, 'Bao mat thong tin trong thoi dai so', 'bao-mat-thong-tin-thoi-dai-so', 'Bao mat thong tin giup bao ve tai khoan va du lieu ca nhan. Nguoi dung nen su dung mat khau manh, xac thuc hai lop va can than voi cac lien ket la.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(29, 4, 'Robot thong minh trong san xuat hien dai', 'robot-thong-minh-san-xuat-hien-dai', 'Robot thong minh ket hop cam bien, phan mem dieu khien va AI de ho tro lap rap, kiem tra chat luong va van chuyen hang hoa.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-10 04:35:14', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(30, 4, 'Xu huong cong nghe trong tuong lai', 'xu-huong-cong-nghe-trong-tuong-lai', 'Nhieu xu huong dang phat trien gom AI tao sinh, robot, thiet bi deo thong minh, nang luong sach va cac he thong ket noi tu dong.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-09 12:35:00', '2026-10-10 04:35:14', '2026-10-09 20:53:13', NULL),
(31, 1, 'Bai viet moi cong nghe 2026', 'bai-viet-moi-cong-nghe-2026', 'Noi dung bai viet thu nghiem...', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80', 1, '2026-10-09 20:44:17', '2026-10-09 20:44:17', '2026-10-11 03:47:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `hinh_anh` varchar(255) NOT NULL,
  `duong_dan_lien_ket` varchar(255) DEFAULT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_hinh`
--

CREATE TABLE `cau_hinh` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `khoa` varchar(255) NOT NULL,
  `gia_tri` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cau_hinh`
--

INSERT INTO `cau_hinh` (`id`, `khoa`, `gia_tri`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'TECHNOVA - Siêu Thị Thiết Bị Điện Tử', '2026-10-12 00:57:48', '2026-10-12 02:10:25'),
(2, 'site_logo', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&q=80', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(3, 'hotline', '1800 6868', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(4, 'email_contact', 'cskh@technova.vn', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(5, 'address', 'Tầng 5, Tòa nhà Bitexco, Bến Nghé, Quận 1, TP. Hồ Chí Minh', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(6, 'facebook', 'https://facebook.com/technovavn', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(7, 'youtube', 'https://youtube.com/@technova', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(8, 'tiktok', 'https://tiktok.com/@technova', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(9, 'meta_description', 'TECHNOVA - Hệ thống bán lẻ thiết bị điện tử, smartphone, laptop, phụ kiện chính hãng giá tốt nhất.', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(10, 'meta_keywords', 'technova, dien thoai, laptop, tai nghe, phu kien, cong nghe', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(11, 'copyright', '© 2026 TECHNOVA. Tất cả các quyền được bảo lưu.', '2026-10-12 00:57:48', '2026-10-12 00:57:48'),
(12, 'maintenance_mode', '0', '2026-10-12 00:57:48', '2026-10-12 02:06:57'),
(13, 'site_slogan', NULL, '2026-10-12 02:06:37', '2026-10-12 02:06:37'),
(14, 'site_favicon', NULL, '2026-10-12 02:06:37', '2026-10-12 02:06:37'),
(15, 'work_time', NULL, '2026-10-12 02:06:37', '2026-10-12 02:06:37'),
(16, 'zalo', NULL, '2026-10-12 02:06:37', '2026-10-12 02:06:37'),
(17, 'order_enabled', '1', '2026-10-12 02:06:37', '2026-10-12 02:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `don_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `so_luong` int(11) NOT NULL,
  `gia` decimal(15,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id`, `don_hang_id`, `san_pham_id`, `so_luong`, `gia`, `created_at`, `updated_at`) VALUES
(28, 1, 1, 7, 150000, '2026-09-28 01:32:39', '2026-09-27 18:02:59'),
(29, 1, 2, 1, 250000, '2026-09-28 01:32:39', '2026-09-28 01:32:39'),
(30, 8, 36, 1, 1590000, '2026-10-24 16:48:12', '2026-10-24 16:48:12'),
(31, 8, 35, 1, 13990000, '2026-10-24 16:48:12', '2026-10-24 16:48:12'),
(32, 9, 36, 1, 1590000, '2026-10-24 17:38:34', '2026-10-24 17:38:34'),
(33, 10, 36, 1, 1590000, '2026-10-30 17:42:52', '2026-10-30 17:42:52'),
(34, 11, 36, 1, 1590000, '2026-10-30 18:11:17', '2026-10-30 18:11:17'),
(35, 12, 1, 1, 32990000, '2026-10-30 18:15:51', '2026-10-30 18:15:51'),
(36, 13, 36, 2, 1590000, '2026-10-30 18:16:51', '2026-10-30 18:16:51'),
(37, 14, 36, 1, 1590000, '2026-10-30 18:17:53', '2026-10-30 18:17:53'),
(38, 15, 36, 1, 1590000, '2026-10-30 18:26:08', '2026-10-30 18:26:08'),
(39, 16, 36, 1, 1590000, '2026-10-30 18:34:24', '2026-10-30 18:34:24'),
(40, 17, 36, 1, 1590000, '2026-10-31 01:41:17', '2026-10-31 01:41:17'),
(41, 18, 36, 1, 1590000, '2026-10-31 01:47:07', '2026-10-31 01:47:07'),
(42, 19, 35, 2, 13990000, '2026-10-31 01:49:47', '2026-10-31 01:49:47'),
(43, 20, 36, 1, 1590000, '2026-11-01 23:35:58', '2026-11-01 23:35:58'),
(44, 21, 36, 1, 1590000, '2026-11-02 00:18:02', '2026-11-02 00:18:02'),
(45, 22, 36, 1, 1590000, '2026-11-02 00:30:58', '2026-11-02 00:30:58');

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_gio_hang`
--

CREATE TABLE `chi_tiet_gio_hang` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `gio_hang_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chi_tiet_gio_hang`
--

INSERT INTO `chi_tiet_gio_hang` (`id`, `gio_hang_id`, `san_pham_id`, `so_luong`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, '2026-09-28 01:34:01', '2026-09-28 01:34:01'),
(2, 1, 2, 1, '2026-09-28 01:34:01', '2026-09-28 01:34:01'),
(3, 1, 3, 4, '2026-09-28 01:34:01', '2026-09-28 01:34:01'),
(4, 1, 4, 1, '2026-09-28 01:34:01', '2026-09-28 01:34:01'),
(5, 1, 5, 3, '2026-09-28 01:34:01', '2026-09-28 01:34:01'),
(8, 3, 36, 3, '2026-10-24 16:49:19', '2026-10-24 17:16:55');

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_phieu_nhap_kho`
--

CREATE TABLE `chi_tiet_phieu_nhap_kho` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phieu_nhap_kho_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `so_luong` int(11) NOT NULL,
  `gia` decimal(15,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_phieu_xuat_kho`
--

CREATE TABLE `chi_tiet_phieu_xuat_kho` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phieu_xuat_kho_id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `so_luong` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danh_gia`
--

CREATE TABLE `danh_gia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `san_pham_id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_sao` tinyint(3) UNSIGNED NOT NULL DEFAULT 5,
  `noi_dung` text NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc`
--

CREATE TABLE `danh_muc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ten` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danh_muc`
--

INSERT INTO `danh_muc` (`id`, `parent_id`, `ten`, `duong_dan`, `trang_thai`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, NULL, 'Thời Trang', 'thoi-trang', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(3, NULL, 'Gia Dụng', 'gia-dung', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(4, NULL, 'Điện Thoại & Tablet', 'dien-thoai-tablet', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(5, NULL, 'Laptop & Máy Tính', 'laptop-may-tinh', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(6, 2, 'Thời Trang Nam', 'thoi-trang-nam', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(7, 2, 'Thời Trang Nữ', 'thoi-trang-nu', 1, '2026-09-20 01:17:00', '2026-10-12 01:59:05', NULL),
(8, 3, 'Đồ Dùng Nhà Bếp', 'do-dung-nha-bep', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(9, 4, 'Phụ Kiện Điện Thoại', 'phu-kien-dien-thoai', 1, '2026-09-20 01:17:00', '2026-09-20 01:17:00', NULL),
(13, 9, 'Iphone 18 Pro Max', 'iphone-18-pro-max', 1, '2026-10-03 03:47:54', '2026-10-12 01:53:18', NULL),
(14, 9, 'Iphone 17 Pro Max', 'iphone-17-pro-max', 1, '2026-10-03 03:48:39', '2026-10-03 03:48:39', NULL),
(15, 9, 'Iphone 14 Pro Max', 'iphone-14-pro-max', 1, '2026-10-03 03:48:55', '2026-10-04 18:56:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc_bai_viet`
--

CREATE TABLE `danh_muc_bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danh_muc_bai_viet`
--

INSERT INTO `danh_muc_bai_viet` (`id`, `ten`, `duong_dan`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 'Bản đồ công nghệ', 'ban-do-cong-nghe', 1, '2026-10-10 04:34:26', '2026-10-10 04:34:26'),
(2, 'Trí tuệ nhân tạo AI', 'tri-tue-nhan-tao-ai', 1, '2026-10-10 04:34:26', '2026-10-10 04:34:26'),
(3, 'Điện thoại và máy tính', 'dien-thoai-may-tinh', 1, '2026-10-10 04:34:26', '2026-10-10 04:34:26'),
(4, 'Công nghệ tương lai', 'cong-nghe-tuong-lai', 1, '2026-10-10 04:34:26', '2026-10-10 04:34:26'),
(5, 'Tin tức công nghệ', 'tin-tuc-cong-nghe', 1, '2026-10-10 04:34:26', '2026-10-10 04:34:26');

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nguoi_dung_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ma_don_hang` varchar(255) NOT NULL,
  `ten_nguoi_nhan` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(255) NOT NULL,
  `dia_chi` varchar(255) NOT NULL,
  `phuong_thuc_thanh_toan` varchar(255) NOT NULL,
  `khuyen_mai_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tong_tien` decimal(15,0) NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'cho_xu_ly',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `don_hang`
--

INSERT INTO `don_hang` (`id`, `nguoi_dung_id`, `ma_don_hang`, `ten_nguoi_nhan`, `so_dien_thoai`, `dia_chi`, `phuong_thuc_thanh_toan`, `khuyen_mai_id`, `tong_tien`, `trang_thai`, `created_at`, `updated_at`) VALUES
(1, 5, 'ABC', 'Phat', '123456789', 'XYZ', 'ATM', NULL, 200000, 'cho_xu_ly', '2026-09-28 01:32:39', '2026-09-27 17:56:35'),
(2, 1, 'DH001', 'Nguyễn Văn A', '0901234567', '123 Đường Lê Lợi, Quận 1, TP.HCM', 'COD', NULL, 400000, 'cho_xu_ly', '2026-09-28 01:41:21', '2026-09-28 01:41:21'),
(3, 1, 'DH002', 'Trần Thị B', '0909876543', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'Banking', NULL, 1200000, 'dang_giao', '2026-09-28 01:41:21', '2026-09-28 01:41:21'),
(5, 1, 'DH005', 'Nguyễn Văn A', '0901234567', '123 Đường Lê Lợi, Quận 1, TP.HCM', 'ATM', NULL, 500000, 'cho_xu_ly', '2026-09-27 17:50:20', '2026-09-27 17:50:20'),
(8, 14, 'DH000008', 'Tran Hoang Lin', '03385152703', 'dsads', 'cod', NULL, 15580000, '4', '2026-10-24 16:48:12', '2026-10-24 16:48:48'),
(9, 14, 'DH000009', 'Tran Hoang Lin', '0385152704', '12312', 'cod', NULL, 1590000, '0', '2026-10-24 17:38:34', '2026-10-24 17:38:34'),
(10, 15, 'DH000010', 'Tran Hoang Lin', '0385152703', 'dd', 'cod', NULL, 1590000, '0', '2026-10-30 17:42:52', '2026-10-30 17:42:52'),
(11, 15, 'DH000011', 'Tran Hoang Lin', '0385152703', 'ddd', 'vnpay', NULL, 1590000, '0', '2026-10-30 18:11:17', '2026-10-30 18:11:17'),
(12, NULL, 'DH000012', 'Tran Hoang Lin', '0385152703', 'bbbb', 'vnpay', NULL, 32990000, '0', '2026-10-30 18:15:51', '2026-10-30 18:15:51'),
(13, 15, 'DH000013', 'Tran Hoang Lin', '0385152703', 'bbbb', 'vnpay', NULL, 3180000, '0', '2026-10-30 18:16:51', '2026-10-30 18:16:51'),
(14, 15, 'DH000014', 'Tran Hoang Lin', '0385152703', 'tttt', 'vnpay', NULL, 1590000, '0', '2026-10-30 18:17:53', '2026-10-30 18:17:53'),
(15, 15, 'DH000015', 'Tran Hoang Lin', '0385152703', 'dd', 'vnpay', NULL, 1590000, '0', '2026-10-30 18:26:08', '2026-10-30 18:26:08'),
(16, 15, 'DH000016', 'Tran Hoang Lin', '0385152703', 'dddd', 'vnpay', NULL, 1590000, '0', '2026-10-30 18:34:24', '2026-10-30 18:34:24'),
(17, 15, 'DH000017', 'Tran Hoang Lin', '0385152703', 'mmmm', 'vnpay', NULL, 1590000, '1', '2026-10-31 01:41:17', '2026-10-31 01:45:19'),
(18, 15, 'DH000018', 'Tran Hoang Lin', '0385152703', 'ddd', 'cod', NULL, 1590000, '0', '2026-10-31 01:47:07', '2026-10-31 01:47:07'),
(19, 15, 'DH000019', 'Tran Hoang Lin', '0385152703', 'ddd', 'vnpay', NULL, 27980000, '1', '2026-10-31 01:49:47', '2026-10-31 01:50:24'),
(20, 15, 'DH000020', 'Tran Hoang Lin', '0385152703', 'ddd', 'vnpay', NULL, 1590000, '1', '2026-11-01 23:35:58', '2026-11-01 23:36:31'),
(21, 15, 'DH000021', 'Tran Hoang Lin', '0385152703', 'dd', 'vnpay', NULL, 1590000, '0', '2026-11-02 00:18:02', '2026-11-02 00:18:02'),
(22, 13, 'DH000022', 'Tran Hoang Lin', '0385152702', 'ddd', 'vnpay', NULL, 1590000, '1', '2026-11-02 00:30:58', '2026-11-02 00:32:59');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gio_hang`
--

CREATE TABLE `gio_hang` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nguoi_dung_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gio_hang`
--

INSERT INTO `gio_hang` (`id`, `nguoi_dung_id`, `session_id`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, '2026-09-28 01:34:01', '2026-09-27 17:43:41'),
(2, 4, NULL, '2026-09-27 17:44:14', '2026-09-27 17:44:14'),
(3, 14, NULL, '2026-10-24 16:43:11', '2026-10-24 16:45:57'),
(8, 15, NULL, '2026-10-25 15:47:16', '2026-11-01 23:42:05'),
(10, NULL, '199cedf5cd794e299fbdfd1216c42d2f', '2026-11-02 00:34:28', '2026-11-02 00:34:28');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khuyen_mai`
--

CREATE TABLE `khuyen_mai` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ma_khuyen_mai` varchar(255) NOT NULL,
  `loai_giam_gia` enum('percent','amount') NOT NULL,
  `gia_tri_giam` decimal(15,0) NOT NULL,
  `gia_tri_don_toi_thieu` decimal(15,0) DEFAULT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `gioi_han_su_dung` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(255) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `trang_thai` varchar(255) NOT NULL DEFAULT 'chua_xu_ly',
  `noi_dung_phan_hoi` text DEFAULT NULL,
  `ngay_phan_hoi` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lien_he`
--

INSERT INTO `lien_he` (`id`, `ten`, `email`, `tieu_de`, `so_dien_thoai`, `noi_dung`, `trang_thai`, `noi_dung_phan_hoi`, `ngay_phan_hoi`, `created_at`, `updated_at`) VALUES
(2, 'Tran Hoang Lin', 'tranhoanglin33@gmail.com', 'Góp ý chất lượng dịch vụ & sản phẩm', '0385152703', 'fix', 'da_xu_ly', 'tôi sẽ làm lại', '2026-11-01 23:41:16', '2026-11-01 23:37:49', '2026-11-01 23:41:16');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000000_create_nguoi_dung_table', 1),
(5, '2024_01_01_000100_create_danh_muc_table', 1),
(6, '2024_01_01_000200_create_thuong_hieu_table', 1),
(7, '2024_01_01_000300_create_san_pham_table', 1),
(8, '2024_01_01_000400_create_khuyen_mai_table', 1),
(9, '2024_01_01_000500_create_gio_hang_table', 1),
(10, '2024_01_01_000600_create_chi_tiet_gio_hang_table', 1),
(11, '2024_01_01_000700_create_don_hang_table', 1),
(12, '2024_01_01_000800_create_chi_tiet_don_hang_table', 1),
(13, '2024_01_01_000900_create_danh_muc_bai_viet_table', 1),
(14, '2024_01_01_001000_create_bai_viet_table', 1),
(15, '2024_01_01_001100_create_trang_don_table', 1),
(16, '2024_01_01_001200_create_menu_table', 1),
(17, '2024_01_01_001300_create_banner_table', 1),
(18, '2024_01_01_001400_create_lien_he_table', 1),
(19, '2024_01_01_001500_create_phieu_nhap_kho_table', 1),
(20, '2024_01_01_001600_create_chi_tiet_phieu_nhap_kho_table', 1),
(21, '2024_01_01_001700_create_phieu_xuat_kho_table', 1),
(22, '2024_01_01_001800_create_chi_tiet_phieu_xuat_kho_table', 1),
(23, '2024_01_01_001900_create_cau_hinh_table', 1),
(24, '2026_09_14_023847_create_personal_access_tokens_table', 1),
(25, '2026_10_05_013400_add_deleted_at_to_danh_muc_and_thuong_hieu_table', 2),
(26, '2026_10_05_024527_add_deleted_at_to_san_pham_table', 3),
(27, '2026_10_10_031800_add_deleted_at_to_nguoi_dung_table', 4),
(28, '2026_10_10_043000_add_deleted_at_to_bai_viet_table', 5),
(29, '2026_10_11_155445_add_deleted_at_to_menu_table', 6),
(30, '2026_10_12_085027_add_deleted_at_to_trang_don_table', 7),
(31, '2026_10_12_021257_create_product_images_table', 8),
(32, '2026_11_02_080000_add_tieu_de_to_lien_he_table', 9),
(33, '2026_11_02_083000_create_danh_gia_table', 10);

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(255) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `vai_tro` enum('member','admin') NOT NULL DEFAULT 'member',
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `ho_ten`, `email`, `so_dien_thoai`, `dia_chi`, `mat_khau`, `vai_tro`, `trang_thai`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Trần Hoàng Lin', 'lin.tran@gmail.com', '0901234567', 'Quận 1, TP. Hồ Chí Minh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, NULL, '2026-09-21 00:33:57', '2026-09-21 00:33:57', NULL),
(2, 'Nguyễn Văn An', 'an.nguyen@gmail.com', '0912345678', 'Quận 3, TP. Hồ Chí Minh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 1, NULL, '2026-09-21 00:33:57', '2026-09-21 00:33:57', NULL),
(3, 'Lê Thị Bình', 'binh.le@gmail.com', '0923456789', 'Quận 7, TP. Hồ Chí Minh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 1, NULL, '2026-09-21 00:33:57', '2026-09-21 00:33:57', NULL),
(4, 'Phạm Văn Cường', 'cuong.pham@gmail.com', '0934567890', 'Thủ Đức, TP. Hồ Chí Minh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 1, NULL, '2026-09-21 00:33:57', '2026-09-21 00:33:57', NULL),
(5, 'Hoàng Thị Dung', 'dung.hoang@gmail.com', '0945678901', 'Đà Nẵng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 0, NULL, '2026-09-21 00:33:57', '2026-09-27 18:30:02', NULL),
(6, 'Nguyen Van B', 'nguyenvana@gmail.com', '0912345678', 'Ha Noi', '$2y$12$/afrW3HnDoL26Nfd8vBrKefx6SP0JUIgRyHMlbEGh8Cr4KlwpIG9q', 'admin', 1, NULL, '2026-09-20 18:45:33', '2026-09-27 18:25:09', NULL),
(7, 'Tran Hoang Lin', 'tranthib@gmail.com', NULL, NULL, '$2y$12$tAleqnflbTT7c19cd8BymekS8X5juzN/6mqUnzowk5q/LVEBEn6Hm', 'member', 1, NULL, '2026-09-20 19:06:25', '2026-09-21 03:02:42', NULL),
(8, 'Nguyen Van Test', 'test@gmail.com', '0901234567', '123 Nguyen Trai, TP.HCM', '$2y$12$ScUJ5rCEwodH42srMMlJV.d/KCiv24PypU.Ld.CxsaTTnAHP1VRu.', 'member', 1, NULL, '2026-09-21 03:54:43', '2026-09-21 03:54:43', NULL),
(9, 'Nguyen Van C', 'nguyenvanc@gmail.com', '0901234567', 'Ho Chi Minh', '$2y$12$L/FxbTyjXBaOLrpnEAFCWeQDg6AXBLBw2THIJC/oPmPDbQkfFnyTa', 'member', 1, NULL, '2026-09-27 18:14:41', '2026-10-09 19:39:54', NULL),
(10, 'Nguyen Van c', 'lin12345@gmail.com', '1232132131', '12321das', '$2y$12$Y4GsHKYeY4oFPm6PsT2h0uEkHz6TUSNf6LUkTAK3alnKxHazM8Y4O', 'member', 1, NULL, '2026-10-09 19:40:25', '2026-10-09 19:41:45', NULL),
(11, 'Tran Hoang Lin Test', 'tranhoanglin_reg_542588018@gmail.com', '0987654321', NULL, '$2y$12$sTG68g9isn0TFO4IUsy2WuW7rH4NmWMqqeUUvfP73txy0/YnbfkaG', 'member', 1, NULL, '2026-10-11 16:05:47', '2026-10-11 16:05:47', NULL),
(12, 'Tran Hoang Lin', 'lin12345678@gmail.com', '0385152703', NULL, '$2y$12$3c4k5/2v/aEcO5upixtOBOBD5rs0eNCRTtPHnVTLqYiufKNV1Vnti', 'member', 1, NULL, '2026-10-11 16:20:32', '2026-10-11 16:20:32', NULL),
(13, 'Tran Hoang Lin', 'lin1234@gmail.com', '0385152702', NULL, '$2y$12$2xpOt8mnrAUcK.EYWDou7uNvcluG4O.0njlK1kHGfIOWfvfVs9AaC', 'admin', 1, NULL, '2026-10-11 16:31:02', '2026-10-11 17:26:30', NULL),
(14, 'Tran Hoang Lin', 'lin111@gmail.com', '0385152704', '12312', '$2y$12$Gy5cgPH3Pz5XT3iG2JkiCeWo.S04oAcc9qK1yRdS1BL6PkctkzzgO', 'member', 1, NULL, '2026-10-18 16:01:25', '2026-10-18 18:47:21', NULL),
(15, 'Tran Hoang Lin', 'tranhoanglin33@gmail.com', '0385152703', NULL, '$2y$12$LId4Cjk/AbV9rLLjqdpXXeRV9CKe.aCgIHNeExBlza4qxAVe730JG', 'admin', 1, NULL, '2026-10-30 17:38:23', '2026-10-30 17:38:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 6, 'web', '0df23849c8cf4dc02947e4d0d544ad4e0572a072cf7472edf40d5c706f5437a8', '[\"*\"]', NULL, NULL, '2026-09-20 18:45:33', '2026-09-20 18:45:33'),
(2, 'App\\Models\\User', 6, 'web', 'ed38c308ba8b90b78337f998827b214e2d5deb8d203944503af024815f678741', '[\"*\"]', NULL, NULL, '2026-09-20 19:01:54', '2026-09-20 19:01:54'),
(3, 'App\\Models\\User', 6, 'web', '0be9d325ea471921ced614337f82d3ec8acdd25137c3f51411b32073ec8b3a20', '[\"*\"]', NULL, NULL, '2026-09-20 19:04:08', '2026-09-20 19:04:08'),
(4, 'App\\Models\\User', 7, 'web', 'debded90e7e8328dce4d029fc6cfa749e6cf2309c4b3223e401dd5d8fcf00eb1', '[\"*\"]', NULL, NULL, '2026-09-20 19:06:25', '2026-09-20 19:06:25'),
(5, 'App\\Models\\User', 7, 'web', '4da22f0ded5dd09a3f597c0c57416870957e6b912cc78ec64bd90b373616754b', '[\"*\"]', NULL, NULL, '2026-09-20 19:07:08', '2026-09-20 19:07:08'),
(6, 'App\\Models\\User', 7, 'web', 'be90e25a61bb0a1cc2cb6275c76c396ae38d32a16679ae6c84cf7a158a187caa', '[\"*\"]', NULL, NULL, '2026-09-21 01:34:43', '2026-09-21 01:34:43'),
(7, 'App\\Models\\User', 7, 'web', 'd99aa16601d205130e34003971d67661333359341eafc24a1e2d23ce2b61eac4', '[\"*\"]', NULL, NULL, '2026-09-21 01:38:53', '2026-09-21 01:38:53'),
(8, 'App\\Models\\User', 6, 'web', '3a9f311da342d6766fca070123ea52bc284748c20c57edf043d09197be42258e', '[\"*\"]', '2026-09-21 01:49:05', NULL, '2026-09-21 01:46:03', '2026-09-21 01:49:05'),
(9, 'App\\Models\\User', 7, 'web', '9e07a75ccbff7b2c9420e86a10458a1618f6d3ea52d704c8252595f5c2da5bed', '[\"*\"]', NULL, NULL, '2026-09-21 01:52:12', '2026-09-21 01:52:12'),
(10, 'App\\Models\\User', 7, 'web', 'd75c9f100f5e6e9fc518e263bee2278aabd8798b632eb07d241fd3cfec58200f', '[\"*\"]', '2026-09-21 02:11:36', NULL, '2026-09-21 02:10:59', '2026-09-21 02:11:36'),
(12, 'App\\Models\\User', 7, 'web', '8d8ae246c4d57197018df1fd3da932abee7a4a0dc3039a3d859b7ce73e1aefd3', '[\"*\"]', NULL, NULL, '2026-09-21 02:22:16', '2026-09-21 02:22:16'),
(14, 'App\\Models\\User', 7, 'web', 'dbde03cb919fe5bf67460638370c9fc627874b50715c90e16ba3d6622ecae224', '[\"*\"]', NULL, NULL, '2026-09-21 02:27:39', '2026-09-21 02:27:39'),
(15, 'App\\Models\\User', 7, 'web', '5ee48dfb31b843646d298d5ce5e2a71922c8884e263dc790a0de807b1ef3a8e2', '[\"*\"]', '2026-09-21 02:47:54', NULL, '2026-09-21 02:32:07', '2026-09-21 02:47:54'),
(16, 'App\\Models\\User', 6, 'web', 'f4c6daeae47e9fab33a18b70f5cc4c27b44027fc3f59acff2ae20c5a3ea368c0', '[\"*\"]', '2026-09-21 03:02:42', NULL, '2026-09-21 02:49:21', '2026-09-21 03:02:42'),
(17, 'App\\Models\\User', 8, 'web', '1cf36d949cf354118e03d57a26e340e6df6606b374c3e78c8560a5c53a719bc7', '[\"*\"]', NULL, NULL, '2026-09-21 03:54:43', '2026-09-21 03:54:43'),
(18, 'App\\Models\\User', 9, 'web', '9e15976df5b8a706918288a331b93c0a45b0718039639729d5270c61f6786b5a', '[\"*\"]', NULL, NULL, '2026-09-27 18:14:42', '2026-09-27 18:14:42'),
(20, 'App\\Models\\User', 6, 'web', 'b1e6162c223705cb82dadf7ce2276cce783e279a0b7b66da8fbeb555d0d5294f', '[\"*\"]', '2026-09-27 18:30:02', NULL, '2026-09-27 18:26:58', '2026-09-27 18:30:02'),
(21, 'App\\Models\\User', 8, 'web', 'df9d2497d30ef296cfaec1178139ecfad847397537bc04643c647ffe04647e00', '[\"*\"]', '2026-09-27 18:30:48', NULL, '2026-09-27 18:30:38', '2026-09-27 18:30:48'),
(22, 'App\\Models\\User', 11, 'web', 'bc286bfa172d8f2bc9d98bed1cb90d144a57cac43dab1bd238d94192102b37e8', '[\"*\"]', NULL, NULL, '2026-10-11 16:05:48', '2026-10-11 16:05:48'),
(23, 'App\\Models\\User', 12, 'web', '36b197f21a05cc161fd2ac348f0d9e293282bf44aadb08dc2ddfcf935183f92e', '[\"*\"]', NULL, NULL, '2026-10-11 16:20:32', '2026-10-11 16:20:32'),
(24, 'App\\Models\\User', 13, 'web', '2cd4e7565317fc86fc903524209df13a068a9b52961e8d8daebb0eebcbc80f3d', '[\"*\"]', NULL, NULL, '2026-10-11 16:31:02', '2026-10-11 16:31:02'),
(33, 'App\\Models\\User', 14, 'web', '376cb0a26bc3d293a6d296a905867f08f28932dca192aa0dedcc11a3ac5afea7', '[\"*\"]', '2026-10-18 17:12:24', NULL, '2026-10-18 17:12:06', '2026-10-18 17:12:24'),
(45, 'App\\Models\\User', 15, 'web', '7d18359edbc2d2382e251a4f68bc26036ef13e34d8b82daec5dc62c380497e02', '[\"*\"]', '2026-11-02 00:27:31', NULL, '2026-11-01 23:42:03', '2026-11-02 00:27:31'),
(48, 'App\\Models\\User', 15, 'web', '555d90a8eb5b8ce57346edb015642338d6f3469d2ba6d66e2655b8bce8da1b3d', '[\"*\"]', '2026-11-02 00:42:06', NULL, '2026-11-02 00:35:30', '2026-11-02 00:42:06');

-- --------------------------------------------------------

--
-- Table structure for table `phieu_nhap_kho`
--

CREATE TABLE `phieu_nhap_kho` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_nha_cung_cap` varchar(255) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `nguoi_tao` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phieu_xuat_kho`
--

CREATE TABLE `phieu_xuat_kho` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ly_do` varchar(255) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `nguoi_tao` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

CREATE TABLE `san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `danh_muc_id` bigint(20) UNSIGNED NOT NULL,
  `thuong_hieu_id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `gia` decimal(15,0) NOT NULL,
  `gia_khuyen_mai` decimal(15,0) DEFAULT NULL,
  `so_luong_ton` int(11) NOT NULL DEFAULT 0,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `san_pham`
--

INSERT INTO `san_pham` (`id`, `danh_muc_id`, `thuong_hieu_id`, `ten`, `duong_dan`, `gia`, `gia_khuyen_mai`, `so_luong_ton`, `mo_ta`, `hinh_anh`, `trang_thai`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 4, 1, 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 34990000, 32990000, 49, 'Điện thoại thông minh cao cấp nhất của Apple với khung titan và chip A17 Pro mạnh mẽ.', 'products/yzMUJZzoykSYQZPgaSCcWlLqToPNYzxE8MEZCeIV.png', 1, '2026-09-30 00:32:47', '2026-10-30 18:15:51', NULL),
(2, 4, 2, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 33990000, 31490000, 40, 'Smartphone tích hợp AI toàn diện, bút S-Pen tiện lợi và camera sắc nét 200MP.', 's24-ultra.jpg', 1, '2026-09-21 00:32:47', '2026-09-21 00:32:47', NULL),
(3, 5, 9, 'Laptop Dell XPS 13 OLED', 'laptop-dell-xps-13-oled', 42990000, 39990000, 15, 'Laptop mỏng nhẹ sang trọng, màn hình OLED sắc nét phục vụ tốt cho công việc và đồ họa.', 'dell-xps-13.jpg', 1, '2026-09-21 00:32:47', '2026-10-12 01:58:08', NULL),
(4, 6, 4, 'Giày thể thao nam Nike Air Force 1', 'giay-the-thao-nam-nike-air-force-1', 2990000, 2590000, 100, 'Giày thể thao năng động, thiết kế trẻ trung dễ dàng phối đồ hằng ngày.', 'nike-af1.jpg', 1, '2026-09-21 00:32:47', '2026-09-21 00:32:47', NULL),
(5, 5, 10, 'Laptop Asus ROG Zephyrus G14', 'laptop-asus-rog-zephyrus-g14', 38990000, 36990000, 20, 'Laptop gaming hiệu năng cực mạnh, thiết kế nhỏ gọn, tản nhiệt tốt.', 'asus-rog-g14.jpg', 1, '2026-09-30 00:32:47', '2026-09-21 00:32:47', NULL),
(22, 5, 9, 'MacBook Pro 16 M3 Max', 'macbook-pro-16-m3-max', 79990000, 74990000, 15, 'Laptop chuyên nghiệp cấu hình cực mạnh dành cho nhà sáng tạo nội dung và lập trình viên.', 'macbook-pro-16.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(23, 4, 1, 'iPad Pro 13 M4 Wifi Cellular', 'ipad-pro-13-m4-wifi-cellular', 38990000, 36990000, 25, 'Máy tính bảng siêu mỏng nhẹ trang bị màn hình Tandem OLED tiên tiến và chip M4 mạnh mẽ.', 'ipad-pro-13.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(24, 9, 3, 'Tai nghe Sony WH-1000XM5', 'tai-nghe-sony-wh-1000xm5', 8490000, 7490000, 50, 'Tai nghe chống ồn chủ động hàng đầu với chất âm chi tiết và thời lượng pin ấn tượng.', 'sony-xm5.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(25, 9, 1, 'Đồng hồ thông minh Apple Watch Series 9', 'apple-watch-series-9', 11990000, 10490000, 40, 'Smartwatch thời trang tích hợp tính năng chạm hai lần tiện lợi và cảm biến sức khỏe tối tân.', 'apple-watch-9.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(26, 5, 8, 'Màn hình UltraWide LG 38WN95C', 'man-hinh-ultrawide-lg-38wn95c', 31990000, 29990000, 10, 'Màn hình cong tỷ lệ 21:9 hiển thị sắc nét, tần số quét cao phục vụ công việc đồ họa đa nhiệm.', 'lg-monitor.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(27, 9, 3, 'Loa Bluetooth JBL Charge 5', 'loa-bluetooth-jbl-charge-5', 3990000, 3490000, 70, 'Loa di động chống nước chuẩn IP67, âm bass mạnh mẽ đi kèm tính năng sạc dự phòng.', 'jbl-charge-5.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(28, 5, 2, 'Ổ cứng SSD Samsung 990 Pro 2TB NVMe', 'ssd-samsung-990-pro-2tb', 5490000, 4790000, 60, 'Ổ cứng thể rắn tốc độ đọc ghi cực cao chuyên dụng cho game thủ và máy trạm đồ họa.', 'samsung-990-pro.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(29, 9, 9, 'Bàn phím cơ không gian Logitech MX Mechanical', 'ban-phim-co-logitech-mx-mechanical', 4290000, 3890000, 45, 'Bàn phím cơ không dây thiết kế công thái học, gõ êm và hỗ trợ đa thiết bị mượt mà.', 'logitech-mx.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(30, 9, 9, 'Chuột không dây Logitech Master 3S', 'chuot-khong-day-logitech-master-3s', 2690000, 2390000, 80, 'Chuột văn phòng cao cấp cảm biến 8000 DPI, click siêu yên tĩnh và cuộn chuột MagSpeed.', 'mx-master-3s.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(31, 9, 10, 'Router Wifi 6 Mesh TP-Link Deco X60', 'router-wifi-6-mesh-tp-link-deco-x60', 5990000, 5290000, 30, 'Hệ thống phát sóng wifi phủ sóng toàn bộ ngôi nhà với tốc độ cao và độ trễ thấp.', 'deco-x60.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(32, 4, 1, 'Kính thực tế hỗn hợp Apple Vision Pro', 'apple-vision-pro', 95000000, 89000000, 5, 'Thiết bị điện toán không gian mang tính cách mạng kết hợp thế giới thực và nội dung số.', 'vision-pro.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(33, 5, 3, 'Máy ảnh Sony Alpha A7 IV', 'may-anh-sony-alpha-a7-iv', 58990000, 55990000, 12, 'Máy ảnh mirrorless Full-frame xuất sắc cho cả chụp ảnh tĩnh lẫn quay phim chuyên nghiệp.', 'sony-a7iv.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(34, 9, 1, 'Bút cảm ứng Apple Pencil Pro', 'apple-pencil-pro', 3490000, 3190000, 55, 'Bút stylus thông minh tích hợp phản hồi lực ấn và thao tác bóp đổi công cụ linh hoạt.', 'apple-pencil-pro.jpg', 1, '2026-10-04 09:34:15', '2026-10-04 09:34:15', NULL),
(35, 5, 2, 'Bộ vi xử lý Intel Core i9-14900K', 'cpu-intel-core-i9-14900k', 14990000, 13990000, 18, 'Chip máy tính hiệu năng cực đỉnh phục vụ chơi game nặng và render đồ họa 3D.', 'i9-14900k.jpg', 1, '2026-10-04 09:34:15', '2026-10-31 01:49:47', NULL),
(36, 9, 3, 'Thẻ nhớ SanDisk Extreme Pro 256GB SDXC123', 'the-nho-sandisk-extreme-pro-256gb-sdxc123', 1890000, 1590000, 110, 'Thẻ nhớ tốc độ cao chuẩn V30 chuyên dùng cho quay video 4K trên máy ảnh và flycam.', 'sandisk-256gb.jpg', 1, '2026-10-04 09:34:15', '2026-11-02 00:30:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('aUa6yKTcbyFH4uv1eQhG5xgagjMygNvHCViE5kwc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9549', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRHVuMG15Q1RZUkZzaHdaZnRFTG5JcUN3bXFLWlVwUjExNmY1TjN0cCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791607326),
('lgXtnYXS4VzA04vGlY3lW2E8oQsRYFyilQhGyBR2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9549', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibjY3OUJiY3UxN2ZaaXhIdmFNdjVWaGF3NDBWdklVazhIM2c0cHY2cyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791607292),
('NO8TeSLKtYhj6tKRNOuCFfwpURwxHa8YBGivvH9E', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieTFVUUxGa2dHWGJEYmg4SmFKSzlvV3h1MVZJRVR3YUlOY3RRMUtsZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1792367988);

-- --------------------------------------------------------

--
-- Table structure for table `thuong_hieu`
--

CREATE TABLE `thuong_hieu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id`, `ten`, `duong_dan`, `trang_thai`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Apple', 'apple', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(2, 'Samsung', 'samsung', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(3, 'Sony', 'sony', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(4, 'Nike', 'nike', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(5, 'Adidas', 'adidas', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(6, 'Xiaomi', 'xiaomi', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(7, 'Uniqlo', 'uniqlo', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(8, 'LG', 'lg', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(9, 'Dell', 'dell', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(10, 'Asus', 'asus', 1, '2026-09-20 01:47:44', '2026-09-20 01:47:44', NULL),
(12, 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 1, '2026-09-20 17:35:08', '2026-09-20 17:36:56', NULL),
(13, 'Iphone 18 promax', 'ip', 1, '2026-09-20 17:47:51', '2026-09-20 17:47:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trang_don`
--

CREATE TABLE `trang_don` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trang_don`
--

INSERT INTO `trang_don` (`id`, `tieu_de`, `duong_dan`, `noi_dung`, `trang_thai`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Giới thiệu về TECHNOVA', 'gioi-thieu', '<h2>Chào mừng bạn đến với TECHNOVA</h2><p>TECHNOVA tự hào là hệ thống bán lẻ công nghệ tiên phong hàng đầu tại Việt Nam, mang đến hệ sinh thái sản phẩm điện tử chính hãng từ Apple, Samsung, Sony, Asus và hàng chục thương hiệu quốc tế uy tín khác.</p><h3>Tầm nhìn & Sứ mệnh</h3><p>Đem lại trải nghiệm mua sắm công nghệ an tâm tuyệt đối với chế độ hậu mãi vượt trội, chính sách 1 đổi 1 và dịch vụ giao hàng hỏa tốc trong 2 giờ.</p>', 1, '2026-10-12 00:57:48', '2026-10-12 00:57:48', NULL),
(2, 'Chính sách bảo hành và đổi trả', 'chinh-sach-bao-hanh', '<h2>Chính sách bảo hành Kim Cương tại TECHNOVA</h2><p>1. Tất cả sản phẩm chính hãng đều được bảo hành tiêu chuẩn từ 12 đến 24 tháng theo đúng quy định của nhà sản xuất.</p><p>2. Đổi mới 1 đổi 1 trong vòng 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng do nhà sản xuất.</p><p>3. Hỗ trợ mượn máy tương đương dùng tạm trong thời gian tiếp nhận thẩm định bảo hành.</p>', 1, '2026-10-12 00:57:48', '2026-10-12 00:57:48', NULL),
(3, 'Chính sách bảo mật thông tin', 'chinh-sach-bao-mat', '<h2>Chính sách bảo mật thông tin khách hàng</h2><p>TECHNOVA cam kết bảo mật 100% dữ liệu cá nhân của quý khách theo các tiêu chuẩn an toàn an ninh mạng SSL 256-bit cao nhất.</p><p>Mọi thông tin như họ tên, số điện thoại, địa chỉ và lịch sử đơn hàng chỉ phục vụ công tác giao hàng và chăm sóc hậu mãi.</p>', 1, '2026-10-12 00:57:48', '2026-10-12 00:57:48', NULL),
(4, 'Hướng dẫn mua hàng & thanh toán', 'huong-dan-thanh-toan', '<h2>Các phương thức thanh toán linh hoạt tại TECHNOVA</h2><ul><li>Thanh toán khi nhận hàng (COD) tận nơi trên toàn quốc.</li><li>Chuyển khoản ngân hàng qua mã QR VietQR tự động xác nhận đơn trong 30 giây.</li><li>Trả góp 0% lãi suất qua thẻ tín dụng hoặc các công ty tài chính đối tác uy tín.</li></ul>', 1, '2026-10-12 00:57:48', '2026-10-12 00:57:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bai_viet_duong_dan_unique` (`duong_dan`),
  ADD KEY `bai_viet_danh_muc_bai_viet_id_foreign` (`danh_muc_bai_viet_id`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cau_hinh`
--
ALTER TABLE `cau_hinh`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cau_hinh_khoa_unique` (`khoa`);

--
-- Indexes for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chi_tiet_don_hang_don_hang_id_foreign` (`don_hang_id`),
  ADD KEY `chi_tiet_don_hang_san_pham_id_foreign` (`san_pham_id`);

--
-- Indexes for table `chi_tiet_gio_hang`
--
ALTER TABLE `chi_tiet_gio_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chi_tiet_gio_hang_gio_hang_id_foreign` (`gio_hang_id`),
  ADD KEY `chi_tiet_gio_hang_san_pham_id_foreign` (`san_pham_id`);

--
-- Indexes for table `chi_tiet_phieu_nhap_kho`
--
ALTER TABLE `chi_tiet_phieu_nhap_kho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chi_tiet_phieu_nhap_kho_phieu_nhap_kho_id_foreign` (`phieu_nhap_kho_id`),
  ADD KEY `chi_tiet_phieu_nhap_kho_san_pham_id_foreign` (`san_pham_id`);

--
-- Indexes for table `chi_tiet_phieu_xuat_kho`
--
ALTER TABLE `chi_tiet_phieu_xuat_kho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chi_tiet_phieu_xuat_kho_phieu_xuat_kho_id_foreign` (`phieu_xuat_kho_id`),
  ADD KEY `chi_tiet_phieu_xuat_kho_san_pham_id_foreign` (`san_pham_id`);

--
-- Indexes for table `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `danh_gia_san_pham_id_foreign` (`san_pham_id`);

--
-- Indexes for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `danh_muc_duong_dan_unique` (`duong_dan`),
  ADD KEY `danh_muc_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `danh_muc_bai_viet`
--
ALTER TABLE `danh_muc_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `danh_muc_bai_viet_duong_dan_unique` (`duong_dan`);

--
-- Indexes for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `don_hang_ma_don_hang_unique` (`ma_don_hang`),
  ADD KEY `don_hang_nguoi_dung_id_foreign` (`nguoi_dung_id`),
  ADD KEY `don_hang_khuyen_mai_id_foreign` (`khuyen_mai_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gio_hang_nguoi_dung_id_foreign` (`nguoi_dung_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `khuyen_mai_ma_khuyen_mai_unique` (`ma_khuyen_mai`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nguoi_dung_email_unique` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `phieu_nhap_kho`
--
ALTER TABLE `phieu_nhap_kho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phieu_nhap_kho_nguoi_tao_foreign` (`nguoi_tao`);

--
-- Indexes for table `phieu_xuat_kho`
--
ALTER TABLE `phieu_xuat_kho`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phieu_xuat_kho_nguoi_tao_foreign` (`nguoi_tao`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_images_product_id_foreign` (`product_id`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `san_pham_duong_dan_unique` (`duong_dan`),
  ADD KEY `san_pham_danh_muc_id_foreign` (`danh_muc_id`),
  ADD KEY `san_pham_thuong_hieu_id_foreign` (`thuong_hieu_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `thuong_hieu_duong_dan_unique` (`duong_dan`);

--
-- Indexes for table `trang_don`
--
ALTER TABLE `trang_don`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trang_don_duong_dan_unique` (`duong_dan`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cau_hinh`
--
ALTER TABLE `cau_hinh`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `chi_tiet_gio_hang`
--
ALTER TABLE `chi_tiet_gio_hang`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `chi_tiet_phieu_nhap_kho`
--
ALTER TABLE `chi_tiet_phieu_nhap_kho`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chi_tiet_phieu_xuat_kho`
--
ALTER TABLE `chi_tiet_phieu_xuat_kho`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `danh_muc_bai_viet`
--
ALTER TABLE `danh_muc_bai_viet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `phieu_nhap_kho`
--
ALTER TABLE `phieu_nhap_kho`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phieu_xuat_kho`
--
ALTER TABLE `phieu_xuat_kho`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `trang_don`
--
ALTER TABLE `trang_don`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_danh_muc_bai_viet_id_foreign` FOREIGN KEY (`danh_muc_bai_viet_id`) REFERENCES `danh_muc_bai_viet` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_don_hang_id_foreign` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_don_hang_san_pham_id_foreign` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chi_tiet_gio_hang`
--
ALTER TABLE `chi_tiet_gio_hang`
  ADD CONSTRAINT `chi_tiet_gio_hang_gio_hang_id_foreign` FOREIGN KEY (`gio_hang_id`) REFERENCES `gio_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_gio_hang_san_pham_id_foreign` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chi_tiet_phieu_nhap_kho`
--
ALTER TABLE `chi_tiet_phieu_nhap_kho`
  ADD CONSTRAINT `chi_tiet_phieu_nhap_kho_phieu_nhap_kho_id_foreign` FOREIGN KEY (`phieu_nhap_kho_id`) REFERENCES `phieu_nhap_kho` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_phieu_nhap_kho_san_pham_id_foreign` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chi_tiet_phieu_xuat_kho`
--
ALTER TABLE `chi_tiet_phieu_xuat_kho`
  ADD CONSTRAINT `chi_tiet_phieu_xuat_kho_phieu_xuat_kho_id_foreign` FOREIGN KEY (`phieu_xuat_kho_id`) REFERENCES `phieu_xuat_kho` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_phieu_xuat_kho_san_pham_id_foreign` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD CONSTRAINT `danh_gia_san_pham_id_foreign` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD CONSTRAINT `danh_muc_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_khuyen_mai_id_foreign` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `don_hang_nguoi_dung_id_foreign` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD CONSTRAINT `gio_hang_nguoi_dung_id_foreign` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `phieu_nhap_kho`
--
ALTER TABLE `phieu_nhap_kho`
  ADD CONSTRAINT `phieu_nhap_kho_nguoi_tao_foreign` FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `phieu_xuat_kho`
--
ALTER TABLE `phieu_xuat_kho`
  ADD CONSTRAINT `phieu_xuat_kho_nguoi_tao_foreign` FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoi_dung` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `san_pham` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_danh_muc_id_foreign` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `san_pham_thuong_hieu_id_foreign` FOREIGN KEY (`thuong_hieu_id`) REFERENCES `thuong_hieu` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
