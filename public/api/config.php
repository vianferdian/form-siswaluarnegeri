<?php
/**
 * Konfigurasi Database MySQL & Helper REST API
 * SMK Negeri 1 Cirebon - Pendataan Alumni Luar Negeri
 */

// Enable CORS & JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ========================================================
// KREDENSIAL DATABASE MYSQL (Sesuaikan dengan aaPanel Anda)
// ========================================================
$db_host = '127.0.0.1';
$db_name = 'alumni_smkn1';
$db_user = 'alumni_smkn1';
$db_pass = 'password123';
$db_port = '3306';

// Cek jika ada custom config file di folder yang sama
$customConfig = __DIR__ . '/db_custom.php';
if (file_exists($customConfig)) {
    include_once $customConfig;
}

define('DB_HOST', getenv('DB_HOST') ?: $db_host);
define('DB_NAME', getenv('DB_NAME') ?: $db_name);
define('DB_USER', getenv('DB_USER') ?: $db_user);
define('DB_PASS', getenv('DB_PASS') ?: $db_pass);
define('DB_PORT', getenv('DB_PORT') ?: $db_port);

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error' => 'Koneksi database MySQL gagal: ' . $e->getMessage(),
                'tip' => 'Silakan sesuaikan konfigurasi user & password di file /api/config.php atau /api/db_custom.php'
            ], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }
    return $pdo;
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function getJsonBody() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}
