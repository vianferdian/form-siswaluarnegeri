<?php
require_once __DIR__ . '/config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: Ambil data alumni
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM alumni WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            jsonResponse(['success' => false, 'error' => 'Data alumni tidak ditemukan'], 404);
        }
        jsonResponse($row);
    }

    // List all
    $stmt = $pdo->query("SELECT * FROM alumni ORDER BY id DESC");
    $list = $stmt->fetchAll();
    jsonResponse($list);
}

// 2. POST: Tambah data alumni baru
if ($method === 'POST') {
    $data = getJsonBody();

    if (empty($data['nama']) || empty($data['nisn'])) {
        jsonResponse(['success' => false, 'error' => 'Nama dan NISN wajib diisi!'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO alumni (
            nama, nisn, jenis_kelamin, konsentrasi_keahlian, tahun_lulus,
            kontak, email, negara_tujuan, skema_keberangkatan, status,
            aktivitas, bulan_keberangkatan, tahun_keberangkatan, perusahaan, sumber
        ) VALUES (
            :nama, :nisn, :jenis_kelamin, :konsentrasi_keahlian, :tahun_lulus,
            :kontak, :email, :negara_tujuan, :skema_keberangkatan, :status,
            :aktivitas, :bulan_keberangkatan, :tahun_keberangkatan, :perusahaan, :sumber
        )
    ");

    $stmt->execute([
        ':nama' => $data['nama'],
        ':nisn' => $data['nisn'],
        ':jenis_kelamin' => $data['jenis_kelamin'] ?? 'Laki-laki',
        ':konsentrasi_keahlian' => $data['konsentrasi_keahlian'] ?? '',
        ':tahun_lulus' => $data['tahun_lulus'] ?? date('Y'),
        ':kontak' => $data['kontak'] ?? null,
        ':email' => $data['email'] ?? null,
        ':negara_tujuan' => $data['negara_tujuan'] ?? 'Lainnya',
        ':skema_keberangkatan' => $data['skema_keberangkatan'] ?? '',
        ':status' => $data['status'] ?? 'Sudah Berangkat',
        ':aktivitas' => $data['aktivitas'] ?? 'Bekerja',
        ':bulan_keberangkatan' => $data['bulan_keberangkatan'] ?? 'Januari',
        ':tahun_keberangkatan' => $data['tahun_keberangkatan'] ?? date('Y'),
        ':perusahaan' => $data['perusahaan'] ?? null,
        ':sumber' => $data['sumber'] ?? 'Mandiri Tracer Alumni SMKN 1 Cirebon'
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM alumni WHERE id = ?");
    $stmt->execute([$newId]);
    $newRow = $stmt->fetch();

    jsonResponse($newRow, 201);
}

// 3. PUT: Update data alumni
if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $data = getJsonBody();
    if (!$id && !empty($data['id'])) {
        $id = (int)$data['id'];
    }

    if (!$id) {
        jsonResponse(['success' => false, 'error' => 'ID alumni wajib disertakan'], 400);
    }

    $stmt = $pdo->prepare("
        UPDATE alumni SET
            nama = :nama,
            nisn = :nisn,
            jenis_kelamin = :jenis_kelamin,
            konsentrasi_keahlian = :konsentrasi_keahlian,
            tahun_lulus = :tahun_lulus,
            kontak = :kontak,
            email = :email,
            negara_tujuan = :negara_tujuan,
            skema_keberangkatan = :skema_keberangkatan,
            status = :status,
            aktivitas = :aktivitas,
            bulan_keberangkatan = :bulan_keberangkatan,
            tahun_keberangkatan = :tahun_keberangkatan,
            perusahaan = :perusahaan
        WHERE id = :id
    ");

    $stmt->execute([
        ':nama' => $data['nama'],
        ':nisn' => $data['nisn'],
        ':jenis_kelamin' => $data['jenis_kelamin'] ?? 'Laki-laki',
        ':konsentrasi_keahlian' => $data['konsentrasi_keahlian'] ?? '',
        ':tahun_lulus' => $data['tahun_lulus'] ?? date('Y'),
        ':kontak' => $data['kontak'] ?? null,
        ':email' => $data['email'] ?? null,
        ':negara_tujuan' => $data['negara_tujuan'] ?? 'Lainnya',
        ':skema_keberangkatan' => $data['skema_keberangkatan'] ?? '',
        ':status' => $data['status'] ?? 'Sudah Berangkat',
        ':aktivitas' => $data['aktivitas'] ?? 'Bekerja',
        ':bulan_keberangkatan' => $data['bulan_keberangkatan'] ?? 'Januari',
        ':tahun_keberangkatan' => $data['tahun_keberangkatan'] ?? date('Y'),
        ':perusahaan' => $data['perusahaan'] ?? null,
        ':id' => $id
    ]);

    $stmt = $pdo->prepare("SELECT * FROM alumni WHERE id = ?");
    $stmt->execute([$id]);
    $updatedRow = $stmt->fetch();

    jsonResponse($updatedRow);
}

// 4. DELETE: Hapus data alumni
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    if (!$id) {
        $data = getJsonBody();
        $id = $data['id'] ?? null;
    }

    if (!$id) {
        jsonResponse(['success' => false, 'error' => 'ID alumni wajib disertakan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM alumni WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Data alumni berhasil dihapus']);
}

jsonResponse(['error' => 'Method not allowed'], 405);
