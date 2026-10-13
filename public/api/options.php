<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    if ($category) {
        $stmt = $pdo->prepare("SELECT value FROM master_options WHERE category = ? ORDER BY sort_order ASC, id ASC");
        $stmt->execute([$category]);
        $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
        jsonResponse($rows);
    }

    // Return grouped by category
    $stmt = $pdo->query("SELECT category, value FROM master_options ORDER BY sort_order ASC, id ASC");
    $all = $stmt->fetchAll();
    $grouped = [];
    foreach ($all as $row) {
        $grouped[$row['category']][] = $row['value'];
    }
    jsonResponse($grouped);
}

if ($method === 'POST') {
    $data = getJsonBody();
    $category = $data['category'] ?? '';
    $value = trim($data['value'] ?? '');

    if (empty($category) || empty($value)) {
        jsonResponse(['success' => false, 'error' => 'Kategori dan Opsi wajib diisi'], 400);
    }

    $stmt = $pdo->prepare("INSERT INTO master_options (category, value) VALUES (?, ?)");
    $stmt->execute([$category, $value]);

    jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()], 201);
}

if ($method === 'DELETE') {
    $data = getJsonBody();
    $category = $data['category'] ?? ($_GET['category'] ?? '');
    $value = $data['value'] ?? ($_GET['value'] ?? '');

    if (empty($category) || empty($value)) {
        jsonResponse(['success' => false, 'error' => 'Kategori dan Nilai wajib diisi'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM master_options WHERE category = ? AND value = ?");
    $stmt->execute([$category, $value]);

    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
