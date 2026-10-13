<?php
require_once __DIR__ . '/config.php';

try {
    $pdo = getDB();
    $totalAlumni = (int)$pdo->query("SELECT COUNT(*) FROM alumni")->fetchColumn();
    $totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    jsonResponse([
        'status' => 'OK',
        'message' => 'Koneksi ke database MySQL berhasil!',
        'database' => DB_NAME,
        'host' => DB_HOST,
        'alumni_count' => $totalAlumni,
        'users_count' => $totalUsers,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    jsonResponse([
        'status' => 'ERROR',
        'message' => 'Gagal terkoneksi ke MySQL: ' . $e->getMessage(),
        'tip' => 'Periksa nama database, user, dan password di api/config.php'
    ], 500);
}
