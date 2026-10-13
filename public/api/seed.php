<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();

$count = (int)$pdo->query("SELECT COUNT(*) FROM alumni")->fetchColumn();

if ($count === 0) {
    $seedSql = "
    INSERT INTO alumni (id, nama, nisn, jenis_kelamin, konsentrasi_keahlian, tahun_lulus, negara_tujuan, skema_keberangkatan, status, aktivitas, bulan_keberangkatan, tahun_keberangkatan, perusahaan, kontak, email, sumber) VALUES
    (1, 'Ahmad Fauzan', '0098765432', 'Laki-laki', 'Teknik Komputer dan Jaringan (TKJ)', '2025', 'Jepang', 'Program Pemerintah (G to G)', 'Sudah Berangkat', 'Bekerja', 'April', '2026', 'Hitachi Systems Ltd. (Tokyo)', '081234567891', 'fauzan.ahmad@example.com', 'Mandiri Tracer Alumni'),
    (2, 'Siti Rahmawati', '0098765433', 'Perempuan', 'Rekayasa Perangkat Lunak (RPL)', '2024', 'Jepang', 'Lembaga Pelatihan Kerja (LPK / Sending Org)', 'Sudah Berangkat', 'Magang', 'Oktober', '2024', 'Kyoto Software Solutions Co., Ltd', '081298765432', 'siti.rahma@example.com', 'Mandiri Tracer Alumni'),
    (3, 'Budi Santoso', '0098765434', 'Laki-laki', 'Teknik Kendaraan Ringan (TKRO)', '2023', 'Korea Selatan', 'Program Pemerintah (G to G)', 'Sudah Berangkat', 'Bekerja', 'Maret', '2024', 'Hyundai Motor Manufacturing Asan', '081345678901', 'budi.santoso@example.com', 'Mandiri Tracer Alumni'),
    (4, 'Nadia Utami', '0098765435', 'Perempuan', 'Desain Komunikasi Visual (DKV)', '2024', 'Jerman', 'Perusahaan / Industri Mitra', 'Sudah Berangkat', 'Studi & Bekerja (Ausbildung)', 'September', '2024', 'Berlin Creative Media GmbH', '081456789012', 'nadia.utami@example.com', 'Mandiri Tracer Alumni'),
    (5, 'Rian Hidayat', '0098765436', 'Laki-laki', 'Teknik Pemesinan (TP)', '2024', 'Jepang', 'Lembaga Pelatihan Kerja (LPK / Sending Org)', 'Dalam Proses', 'Bekerja', 'Desember', '2026', 'Denso Corporation (Aichi)', '081567890123', 'rian.h@example.com', 'Mandiri Tracer Alumni'),
    (6, 'Dewi Lestari', '0098765437', 'Perempuan', 'Teknik Instalasi Tenaga Listrik (TITL)', '2023', 'Taiwan', 'Perusahaan / Industri Mitra', 'Sudah Berangkat', 'Bekerja', 'Januari', '2024', 'Formosa Plastics Group', '081678901234', 'dewi.lestari@example.com', 'Mandiri Tracer Alumni'),
    (7, 'Dimas Pratama', '0098765438', 'Laki-laki', 'Teknik Pengelasan (TL)', '2024', 'Korea Selatan', 'Program Pemerintah (G to G)', 'Dalam Proses', 'Bekerja', 'November', '2026', 'HD Hyundai Heavy Industries Ulsan', '081789012345', 'dimas.p@example.com', 'Mandiri Tracer Alumni'),
    (8, 'Fitri Handayani', '0098765439', 'Perempuan', 'Teknik Elektronika Industri (TEI)', '2022', 'Jepang', 'Program Magang (Internship)', 'Selesai Program', 'Bekerja', 'Februari', '2023', 'Panasonic Industrial Solutions Osaka', '081890123456', 'fitri.h@example.com', 'Mandiri Tracer Alumni')
    ";
    $pdo->exec($seedSql);
    $newCount = (int)$pdo->query("SELECT COUNT(*) FROM alumni")->fetchColumn();
    jsonResponse([
        'success' => true,
        'message' => 'Data awal alumni berhasil di-seed ke tabel alumni MySQL!',
        'alumni_count' => $newCount
    ]);
}

jsonResponse([
    'success' => true,
    'message' => 'Tabel alumni sudah memiliki data.',
    'alumni_count' => $count
]);
