<?php
/**
 * Setup & Diagnostik Database MySQL
 * SMK Negeri 1 Cirebon - Tracer Alumni Luar Negeri
 */

$msg = '';
$msgType = '';

// Load custom config jika ada
$customConfigFile = __DIR__ . '/db_custom.php';
$envFile = dirname(__DIR__, 2) . '/.env';

// Tangani form submit
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = trim($_POST['db_host'] ?? '127.0.0.1');
    $port = trim($_POST['db_port'] ?? '3306');
    $name = trim($_POST['db_name'] ?? 'alumni_smkn1');
    $user = trim($_POST['db_user'] ?? 'alumni_smkn1');
    $pass = trim($_POST['db_pass'] ?? '');

    try {
        // Coba koneksi PDO
        $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // Simpan konfigurasi ke db_custom.php
        $configContent = "<?php\n"
            . "// Konfigurasi Database Tersimpan Otomatis\n"
            . "\$db_host = " . var_export($host, true) . ";\n"
            . "\$db_port = " . var_export($port, true) . ";\n"
            . "\$db_name = " . var_export($name, true) . ";\n"
            . "\$db_user = " . var_export($user, true) . ";\n"
            . "\$db_pass = " . var_export($pass, true) . ";\n";
        file_put_contents($customConfigFile, $configContent);

        // Simpan juga ke .env
        $envContent = "DB_HOST={$host}\nDB_PORT={$port}\nDB_NAME={$name}\nDB_USER={$user}\nDB_PASS={$pass}\n";
        @file_put_contents($envFile, $envContent);

        // Import schema jika tabel belum ada
        $sqlFile = __DIR__ . '/../database.sql';
        if (file_exists($sqlFile)) {
            $sql = file_get_contents($sqlFile);
            $pdo->exec($sql);
        }

        $msg = "✅ Sukses! Database MySQL berhasil terhubung dan tabel siap digunakan. Data di Laptop dan HP sekarang akan tersinkron otomatis!";
        $msgType = "success";
    } catch (Exception $e) {
        $msg = "❌ Gagal Terkoneksi: " . $e->getMessage() . "<br><small>Periksa kembali nama database, username, dan password yang dibuat di aaPanel.</small>";
        $msgType = "error";
    }
}

// Cek koneksi saat ini
require_once __DIR__ . '/config.php';
$currentStatus = false;
$currentError = '';
$alumniCount = 0;
$userCount = 0;

try {
    $db = getDB();
    $alumniCount = (int)$db->query("SELECT COUNT(*) FROM alumni")->fetchColumn();
    $userCount = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $currentStatus = true;
} catch (Exception $e) {
    $currentError = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Setup Database MySQL - SMKN 1 Cirebon</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen py-10 px-4">
  <div class="max-w-xl mx-auto space-y-6">
    
    <!-- Header -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center">
      <img src="/logo-smk.png" alt="Logo" class="w-14 h-14 mx-auto mb-3 object-contain">
      <h1 class="text-xl font-extrabold text-slate-900">Setup Database MySQL Terpusat</h1>
      <p class="text-xs text-slate-500 mt-1">SMK Negeri 1 Cirebon • Sinkronisasi Data Laptop & HP</p>
    </div>

    <!-- Alert Status -->
    <?php if ($msg): ?>
      <div class="p-4 rounded-2xl text-xs sm:text-sm font-semibold <?php echo $msgType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'; ?>">
        <?php echo $msg; ?>
      </div>
    <?php endif; ?>

    <!-- Status Koneksi Saat Ini -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">Status Koneksi Saat Ini:</h2>
      <?php if ($currentStatus): ?>
        <div class="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <p class="text-sm font-bold">MySQL Terhubung Sempurna! ✅</p>
            <p class="text-xs text-emerald-700 mt-0.5">Database: <strong><?php echo htmlspecialchars(DB_NAME); ?></strong> (Host: <?php echo htmlspecialchars(DB_HOST); ?>)</p>
            <p class="text-xs text-emerald-700">Jumlah Data Alumni: <strong><?php echo $alumniCount; ?></strong> record | Akun Admin: <strong><?php echo $userCount; ?></strong></p>
          </div>
        </div>
        <div class="pt-2 flex gap-2">
          <a href="/" class="flex-1 text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">Buka Formulir Alumni</a>
          <a href="/admin" class="flex-1 text-center py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition">Buka Panel Admin</a>
        </div>
      <?php else: ?>
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
          <p class="text-xs font-bold">Koneksi Database Belum Terhubung ❌</p>
          <p class="text-[11px] font-mono break-all"><?php echo htmlspecialchars($currentError); ?></p>
          <p class="text-[11px] text-rose-600 mt-2 font-medium">Ini penyebab kenapa data di HP dan laptop belum sinkron. Silakan masukkan username & password database yang Anda buat di aaPanel pada form di bawah.</p>
        </div>
      <?php endif; ?>
    </div>

    <!-- Form Setting Kredensial aaPanel -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
      <h2 class="text-base font-extrabold text-slate-900">Konfigurasi Database aaPanel</h2>
      <p class="text-xs text-slate-500">Masukkan nama database, username, dan password yang dibuat di menu <strong>Databases</strong> aaPanel.</p>

      <form method="POST" class="space-y-4 pt-2">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Host Database</label>
            <input type="text" name="db_host" value="<?php echo htmlspecialchars(DB_HOST); ?>" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Port</label>
            <input type="text" name="db_port" value="<?php echo htmlspecialchars(DB_PORT); ?>" required class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Database</label>
          <input type="text" name="db_name" value="<?php echo htmlspecialchars(DB_NAME); ?>" required placeholder="alumni_smkn1" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Username Database</label>
          <input type="text" name="db_user" value="<?php echo htmlspecialchars(DB_USER); ?>" required placeholder="alumni_smkn1" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password Database (dari aaPanel)</label>
          <input type="password" name="db_pass" placeholder="Ketik kata sandi database aaPanel" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition">
          Test & Simpan Koneksi Database
        </button>
      </form>
    </div>

    <!-- Petunjuk Singkat -->
    <div class="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed space-y-1">
      <p class="font-bold text-slate-700">💡 Tips aaPanel:</p>
      <p>1. Di aaPanel > menu <strong>Databases</strong>, lihat nama database & username yang telah dibuat.</p>
      <p>2. Jika lupa passwordnya, klik ikon kunci di aaPanel untuk mengganti password baru, lalu masukkan di form atas.</p>
      <p>3. Setelah terhubung, semua input data dari <strong>HP</strong> atau <strong>Laptop</strong> akan langsung masuk ke database MySQL yang sama.</p>
    </div>

  </div>
</body>
</html>
