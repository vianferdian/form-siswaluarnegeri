<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();

// Total & Status counts
$total = (int)$pdo->query("SELECT COUNT(*) FROM alumni")->fetchColumn();
$sudahBerangkat = (int)$pdo->query("SELECT COUNT(*) FROM alumni WHERE status = 'Sudah Berangkat'")->fetchColumn();
$dalamProses = (int)$pdo->query("SELECT COUNT(*) FROM alumni WHERE status = 'Dalam Proses'")->fetchColumn();
$selesaiProgram = (int)$pdo->query("SELECT COUNT(*) FROM alumni WHERE status = 'Selesai Program'")->fetchColumn();
$belumBerangkat = (int)$pdo->query("SELECT COUNT(*) FROM alumni WHERE status = 'Belum Berangkat'")->fetchColumn();

// Unique countries
$totalNegara = (int)$pdo->query("SELECT COUNT(DISTINCT negara_tujuan) FROM alumni WHERE negara_tujuan != ''")->fetchColumn();

// Country chart
$stmtCountry = $pdo->query("
    SELECT negara_tujuan AS name, COUNT(*) AS alumni 
    FROM alumni 
    WHERE negara_tujuan != '' 
    GROUP BY negara_tujuan 
    ORDER BY alumni DESC
");
$countryChart = $stmtCountry->fetchAll();

// Year chart
$stmtYear = $pdo->query("
    SELECT tahun_keberangkatan AS year, COUNT(*) AS total 
    FROM alumni 
    WHERE tahun_keberangkatan != '' 
    GROUP BY tahun_keberangkatan 
    ORDER BY year ASC
");
$yearChart = $stmtYear->fetchAll();

// Activity counts
$stmtAct = $pdo->query("
    SELECT aktivitas, COUNT(*) as cnt 
    FROM alumni 
    WHERE aktivitas != '' 
    GROUP BY aktivitas
");
$activityCounts = [];
while ($row = $stmtAct->fetch()) {
    $activityCounts[$row['aktivitas']] = (int)$row['cnt'];
}

jsonResponse([
    'total' => $total,
    'sudahBerangkat' => $sudahBerangkat,
    'dalamProses' => $dalamProses,
    'selesaiProgram' => $selesaiProgram,
    'belumBerangkat' => $belumBerangkat,
    'totalNegara' => $totalNegara,
    'countryChart' => $countryChart,
    'yearChart' => $yearChart,
    'activityCounts' => $activityCounts
]);
