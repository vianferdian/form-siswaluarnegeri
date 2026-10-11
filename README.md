# 🌍 Sistem Informasi Pendataan Alumni Bekerja di Luar Negeri

## 📌 Project Overview

Buatkan aplikasi web **Sistem Informasi Pendataan Siswa/Alumni yang Bekerja atau Magang di Luar Negeri** menggunakan **React JS**.

Aplikasi ini digunakan oleh sekolah untuk melakukan pendataan, monitoring, dan pelaporan alumni yang memiliki aktivitas internasional seperti:

- Bekerja di luar negeri
- Magang internasional
- Program pemerintah
- Program lembaga pengirim
- Studi atau pelatihan internasional

---

# 🚀 Tech Stack

Gunakan teknologi berikut:

## Frontend

- React JS
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zustand / Context API
- Recharts
- Lucide React Icons

## Backend Ready

Siapkan struktur agar mudah terhubung dengan:

- Laravel API
- Node.js Express
- Firebase

---

# 🎨 Design Requirement

Buat tampilan modern seperti:

- Dashboard sekolah
- Sistem tracer study alumni
- Sistem informasi akademik

## Style

- Clean UI
- Responsive
- Mobile friendly
- Professional school management system

## Color Theme

Primary:
`Blue`

Secondary:
`White`, `Gray`, `Green Accent`

Gunakan:
- Card layout
- Rounded corner
- Shadow ringan
- Icon modern
- Sidebar navigation

---

# 📂 Project Structure

```
src
│
├── components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── StatCard.jsx
│   ├── DataTable.jsx
│   ├── FormInput.jsx
│   └── Modal.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Alumni.jsx
│   ├── AddAlumni.jsx
│   ├── DetailAlumni.jsx
│   └── Report.jsx
│
├── services
│   └── api.js
│
├── store
│   └── authStore.js
│
├── data
│   └── dummyData.js
│
├── router
│   └── routes.jsx
│
├── App.jsx
└── main.jsx
```

---

# 🔐 Authentication

Buat sistem login admin.

## Role User

### Admin
Hak akses:
- Melihat dashboard
- Menambah data alumni
- Mengedit data
- Menghapus data
- Melihat laporan
- Export data

### Operator
Hak akses:
- Input data
- Melihat data

---

# 📊 Dashboard

Buat halaman dashboard dengan statistik.

## Statistik Card

### Total Alumni
Menampilkan jumlah seluruh alumni.

### Sudah Berangkat
Jumlah alumni yang sudah bekerja/magang.

### Dalam Proses
Jumlah alumni yang sedang proses keberangkatan.

### Negara Tujuan
Jumlah negara tujuan alumni.

---

# 📈 Grafik Dashboard

Gunakan Recharts.

## Grafik 1
Bar Chart: `Jumlah Alumni Berdasarkan Negara Tujuan`
Contoh:
- Jepang: 40
- Korea: 25
- Jerman: 15
- Turki: 10

---

## Grafik 2
Line Chart: `Jumlah Keberangkatan Berdasarkan Tahun`

---

# 👨‍🎓 Data Alumni

Buat halaman tabel data alumni.

## Kolom
| No | Nama | NISN | JK | Konsentrasi | Negara | Status | Aktivitas |

## Fitur
- Search
- Filter
- Sorting
- Pagination
- Export Excel
- Export PDF
- Print

---

# ➕ Form Tambah Alumni

Buat form input data.

## Data Identitas
- **Nama Lengkap**: Text Input
- **NISN**: Number Input
- **Jenis Kelamin**: Dropdown (Laki-laki, Perempuan)
- **Konsentrasi Keahlian**: Dropdown (Teknik Komputer dan Jaringan, Teknik Kendaraan Ringan, Teknik Elektronika, Tata Boga, Tata Busana, Usaha Layanan Pariwisata, Lainnya)
- **Tahun Lulus**: Number

---

# 🌏 Data Keberangkatan

- **Negara Tujuan**: Dropdown (Jepang, Jerman, Korea Selatan, Turki, Eropa, Timur Tengah, Lainnya) — Jika memilih *Lainnya*, munculkan input negara manual.
- **Skema Keberangkatan**: Dropdown (Program Pemerintah, Lembaga Pengirim, Mandiri, Perusahaan, Program Magang, Beasiswa, Lainnya)
- **Status Keberangkatan**: Dropdown (Belum Berangkat, Dalam Proses, Sudah Berangkat, Selesai Program)
- **Aktivitas**: Dropdown (Bekerja, Magang, Studi, Pelatihan)
- **Bulan Keberangkatan**: Dropdown (Januari s.d. Desember)
- **Tahun Keberangkatan**: Number

---

# 📁 Upload Dokumen

Tambahkan fitur upload:
- Foto Alumni
- Sertifikat
- Kontrak Kerja
- Dokumen Keberangkatan

---

# 👤 Detail Alumni

Ketika data dipilih tampilkan:
- **Profil**: Foto, Nama, NISN, Jenis Kelamin, Konsentrasi Keahlian, Tahun Lulus
- **Informasi Luar Negeri**: Negara Tujuan, Skema Keberangkatan, Status, Aktivitas, Bulan Berangkat, Tahun Berangkat

---

# 📑 Laporan

Buat halaman laporan.

Filter:
- Tahun
- Negara
- Jurusan
- Status

Output:
- Ringkasan Jumlah Alumni per Negara & Aktivitas
- Button: Export Excel, Export PDF, Print

---

# 🗄️ Database Structure

## Table Alumni
```sql
id, nama, nisn, jenis_kelamin, konsentrasi_keahlian, tahun_lulus, foto, created_at, updated_at
```

## Table Keberangkatan
```sql
id, alumni_id, negara_tujuan, skema_keberangkatan, status, aktivitas, bulan_keberangkatan, tahun_keberangkatan, created_at, updated_at
```

## Table Dokumen
```sql
id, alumni_id, nama_file, jenis_file, path_file, created_at
```

---

# 🔌 API Endpoint

Service API siap pakai:
- `GET /api/alumni`
- `POST /api/alumni`
- `PUT /api/alumni/:id`
- `DELETE /api/alumni/:id`
- `GET /api/statistik`

---

# Dummy Data
Data awal terisi dan siap digunakan.

---

# ✅ Expected Result

Aplikasi React JS **"International Alumni Tracking System"** yang lengkap, responsif, dan siap dikembangkan.
