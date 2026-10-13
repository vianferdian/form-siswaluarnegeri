-- ========================================================
-- Database Schema: Sistem Informasi Pendataan Alumni Luar Negeri
-- SMK Negeri 1 Cirebon
-- ========================================================

CREATE DATABASE IF NOT EXISTS `alumni_smkn1` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `alumni_smkn1`;

-- --------------------------------------------------------
-- 1. Tabel users (Admin & Petugas)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Operator') NOT NULL DEFAULT 'Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin User: admin@smkn1cirebon.sch.id / password123
-- Password hash menggunakan MD5 / bcrypt (API mendukung password123)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin SMKN 1 Cirebon', 'admin@smkn1cirebon.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin'),
(2, 'Petugas Hubin SMKN 1', 'operator@smkn1cirebon.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Operator')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- --------------------------------------------------------
-- 2. Tabel alumni
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `alumni` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `nisn` VARCHAR(30) NOT NULL,
  `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') NOT NULL DEFAULT 'Laki-laki',
  `konsentrasi_keahlian` VARCHAR(150) NOT NULL,
  `tahun_lulus` VARCHAR(10) NOT NULL,
  `kontak` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `negara_tujuan` VARCHAR(100) NOT NULL,
  `skema_keberangkatan` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Sudah Berangkat',
  `aktivitas` VARCHAR(50) NOT NULL DEFAULT 'Bekerja',
  `bulan_keberangkatan` VARCHAR(30) DEFAULT 'Januari',
  `tahun_keberangkatan` VARCHAR(10) DEFAULT '2024',
  `perusahaan` VARCHAR(200) DEFAULT NULL,
  `sumber` VARCHAR(150) DEFAULT 'Mandiri Tracer Alumni SMKN 1 Cirebon',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_nisn` (`nisn`),
  INDEX `idx_negara` (`negara_tujuan`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Data Awal Alumni (Dummy Seed)
-- --------------------------------------------------------
INSERT INTO `alumni` (`id`, `nama`, `nisn`, `jenis_kelamin`, `konsentrasi_keahlian`, `tahun_lulus`, `negara_tujuan`, `skema_keberangkatan`, `status`, `aktivitas`, `bulan_keberangkatan`, `tahun_keberangkatan`, `perusahaan`, `kontak`, `email`) VALUES
(1, 'Ahmad Fauzan', '0098765432', 'Laki-laki', 'Teknik Komputer dan Jaringan (TKJ)', '2025', 'Jepang', 'Program Pemerintah (G to G)', 'Sudah Berangkat', 'Bekerja', 'April', '2026', 'Hitachi Systems Ltd. (Tokyo)', '081234567891', 'fauzan.ahmad@example.com'),
(2, 'Siti Rahmawati', '0098765433', 'Perempuan', 'Rekayasa Perangkat Lunak (RPL)', '2024', 'Jepang', 'Lembaga Pelatihan Kerja (LPK / Sending Org)', 'Sudah Berangkat', 'Magang', 'Oktober', '2024', 'Kyoto Software Solutions Co., Ltd', '081298765432', 'siti.rahma@example.com'),
(3, 'Budi Santoso', '0098765434', 'Laki-laki', 'Teknik Kendaraan Ringan (TKRO)', '2023', 'Korea Selatan', 'Program Pemerintah (G to G)', 'Sudah Berangkat', 'Bekerja', 'Maret', '2024', 'Hyundai Motor Manufacturing Asan', '081345678901', 'budi.santoso@example.com'),
(4, 'Nadia Utami', '0098765435', 'Perempuan', 'Desain Komunikasi Visual (DKV)', '2024', 'Jerman', 'Perusahaan / Industri Mitra', 'Sudah Berangkat', 'Studi & Bekerja (Ausbildung)', 'September', '2024', 'Berlin Creative Media GmbH', '081456789012', 'nadia.utami@example.com'),
(5, 'Rian Hidayat', '0098765436', 'Laki-laki', 'Teknik Pemesinan (TP)', '2024', 'Jepang', 'Lembaga Pelatihan Kerja (LPK / Sending Org)', 'Dalam Proses', 'Bekerja', 'Desember', '2026', 'Denso Corporation (Aichi)', '081567890123', 'rian.h@example.com'),
(6, 'Dewi Lestari', '0098765437', 'Perempuan', 'Teknik Instalasi Tenaga Listrik (TITL)', '2023', 'Taiwan', 'Perusahaan / Industri Mitra', 'Sudah Berangkat', 'Bekerja', 'Januari', '2024', 'Formosa Plastics Group', '081678901234', 'dewi.lestari@example.com'),
(7, 'Dimas Pratama', '0098765438', 'Laki-laki', 'Teknik Pengelasan (TL)', '2024', 'Korea Selatan', 'Program Pemerintah (G to G)', 'Dalam Proses', 'Bekerja', 'November', '2026', 'HD Hyundai Heavy Industries Ulsan', '081789012345', 'dimas.p@example.com'),
(8, 'Fitri Handayani', '0098765439', 'Perempuan', 'Teknik Elektronika Industri (TEI)', '2022', 'Jepang', 'Program Magang (Internship)', 'Selesai Program', 'Bekerja', 'Februari', '2023', 'Panasonic Industrial Solutions Osaka', '081890123456', 'fitri.h@example.com')
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);

-- --------------------------------------------------------
-- 4. Tabel master_options
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `master_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(50) NOT NULL,
  `value` VARCHAR(150) NOT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Master Options
INSERT INTO `master_options` (`category`, `value`, `sort_order`) VALUES
('konsentrasi_keahlian', 'Teknik Komputer dan Jaringan (TKJ)', 1),
('konsentrasi_keahlian', 'Rekayasa Perangkat Lunak (RPL)', 2),
('konsentrasi_keahlian', 'Desain Komunikasi Visual (DKV)', 3),
('konsentrasi_keahlian', 'Teknik Kendaraan Ringan (TKRO)', 4),
('konsentrasi_keahlian', 'Teknik Pemesinan (TP)', 5),
('konsentrasi_keahlian', 'Teknik Pengelasan (TL)', 6),
('konsentrasi_keahlian', 'Teknik Instalasi Tenaga Listrik (TITL)', 7),
('konsentrasi_keahlian', 'Teknik Elektronika Industri (TEI)', 8),
('konsentrasi_keahlian', 'Teknik Mekatronika', 9),
('konsentrasi_keahlian', 'Lainnya', 10),

('negara_tujuan', 'Jepang', 1),
('negara_tujuan', 'Korea Selatan', 2),
('negara_tujuan', 'Jerman', 3),
('negara_tujuan', 'Turki', 4),
('negara_tujuan', 'Taiwan', 5),
('negara_tujuan', 'Eropa', 6),
('negara_tujuan', 'Timur Tengah', 7),
('negara_tujuan', 'Lainnya', 8),

('skema_keberangkatan', 'Program Pemerintah (G to G)', 1),
('skema_keberangkatan', 'Lembaga Pelatihan Kerja (LPK / Sending Org)', 2),
('skema_keberangkatan', 'Mandiri', 3),
('skema_keberangkatan', 'Perusahaan / Industri Mitra', 4),
('skema_keberangkatan', 'Program Magang (Internship)', 5),
('skema_keberangkatan', 'Beasiswa', 6),
('skema_keberangkatan', 'Lainnya', 7),

('status', 'Belum Berangkat', 1),
('status', 'Dalam Proses', 2),
('status', 'Sudah Berangkat', 3),
('status', 'Selesai Program', 4),

('aktivitas', 'Bekerja', 1),
('aktivitas', 'Magang', 2),
('aktivitas', 'Studi / Kuliah', 3),
('aktivitas', 'Studi & Bekerja (Ausbildung)', 4),
('aktivitas', 'Lainnya', 5),

('bulan_keberangkatan', 'Januari', 1),
('bulan_keberangkatan', 'Februari', 2),
('bulan_keberangkatan', 'Maret', 3),
('bulan_keberangkatan', 'April', 4),
('bulan_keberangkatan', 'Mei', 5),
('bulan_keberangkatan', 'Juni', 6),
('bulan_keberangkatan', 'Juli', 7),
('bulan_keberangkatan', 'Agustus', 8),
('bulan_keberangkatan', 'September', 9),
('bulan_keberangkatan', 'Oktober', 10),
('bulan_keberangkatan', 'November', 11),
('bulan_keberangkatan', 'Desember', 12)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`);
