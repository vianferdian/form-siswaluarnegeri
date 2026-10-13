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
// KREDENSIAL DEFAULT DATABASE MYSQL
// ========================================================
$db_host = '127.0.0.1';
$db_name = 'alumni_smkn1';
$db_user = 'alumni_smkn1';
$db_pass = 'password123';
$db_port = '3306';

// 1. Coba baca file .env jika ada (di root folder website atau di folder saat ini)
$envPaths = [
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__) . '/.env',
    __DIR__ . '/.env'
];

foreach ($envPaths as $envFile) {
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim($val, " \t\n\r\0\x0B\"'");
                if ($key === 'DB_HOST') $db_host = $val;
                if ($key === 'DB_NAME') $db_name = $val;
                if ($key === 'DB_USER') $db_user = $val;
                if ($key === 'DB_PASS' || $key === 'DB_PASSWORD') $db_pass = $val;
                if ($key === 'DB_PORT') $db_port = $val;
            }
        }
        break;
    }
}

// 2. Cek jika ada custom config PHP
$customConfig = __DIR__ . '/db_custom.php';
if (file_exists($customConfig)) {
    include_once $customConfig;
}

define('DB_HOST', getenv('DB_HOST') ?: $db_host);
define('DB_NAME', getenv('DB_NAME') ?: $db_name);
define('DB_USER', getenv('DB_USER') ?: $db_user);
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : $db_pass);
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
                'tip' => 'Periksa nama database, username, dan password di aaPanel menu Database atau file dist/api/config.php'
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
