<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonBody();
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    jsonResponse(['success' => false, 'error' => 'Email dan Password wajib diisi!'], 400);
}

// Cari user di tabel users
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['success' => false, 'error' => 'Email atau Password salah!'], 401);
}

// Verifikasi password (bcrypt atau password123 default)
$valid = false;
if (password_verify($password, $user['password'])) {
    $valid = true;
} else if ($password === $user['password']) {
    $valid = true;
} else if ($password === 'password123') {
    // Default fallback untuk instalasi awal
    $valid = true;
}

if (!$valid) {
    jsonResponse(['success' => false, 'error' => 'Email atau Password salah!'], 401);
}

// Login berhasil
jsonResponse([
    'success' => true,
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'] ?? 'Admin'
    ],
    'token' => bin2hex(random_bytes(24))
]);
