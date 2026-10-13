const STORAGE_KEY = 'smkn1cirebon_dropdown_options';

export const DEFAULT_DROPDOWN_OPTIONS = {
  konsentrasi_keahlian: {
    label: "Konsentrasi Keahlian / Jurusan",
    description: "Program keahlian siswa SMK Negeri 1 Cirebon",
    options: [
      "Teknik Komputer dan Jaringan (TKJ)",
      "Rekayasa Perangkat Lunak (RPL)",
      "Desain Komunikasi Visual (DKV)",
      "Teknik Kendaraan Ringan (TKRO)",
      "Teknik Pemesinan (TP)",
      "Teknik Pengelasan (TL)",
      "Teknik Instalasi Tenaga Listrik (TITL)",
      "Teknik Elektronika Industri (TEI)",
      "Teknik Mekatronika",
      "Lainnya"
    ]
  },
  negara_tujuan: {
    label: "Negara Tujuan",
    description: "Daftar negara destinasi penempatan alumni di luar negeri",
    options: [
      "Jepang",
      "Korea Selatan",
      "Jerman",
      "Turki",
      "Taiwan",
      "Eropa",
      "Timur Tengah",
      "Lainnya"
    ]
  },
  skema_keberangkatan: {
    label: "Skema Keberangkatan",
    description: "Jalur atau program yang digunakan alumni untuk ke luar negeri",
    options: [
      "Program Pemerintah (G to G)",
      "Lembaga Pelatihan Kerja (LPK / Sending Org)",
      "Mandiri",
      "Perusahaan / Industri Mitra",
      "Program Magang (Internship)",
      "Beasiswa",
      "Lainnya"
    ]
  },
  status: {
    label: "Status Keberangkatan",
    description: "Status terkini proses keberangkatan atau penempatan alumni",
    options: [
      "Belum Berangkat",
      "Dalam Proses",
      "Sudah Berangkat",
      "Selesai Program"
    ]
  },
  aktivitas: {
    label: "Jenis Aktivitas",
    description: "Aktivitas utama alumni selama berada di luar negeri",
    options: [
      "Bekerja",
      "Magang",
      "Studi",
      "Studi & Bekerja (Ausbildung)",
      "Pelatihan",
      "Lainnya"
    ]
  },
  bulan_keberangkatan: {
    label: "Bulan Keberangkatan",
    description: "Daftar pilihan bulan jadwal keberangkatan",
    options: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ]
  }
};

export const optionsService = {
  // Ambil data terbaru dari MySQL Database Server (/api/options.php)
  async fetchOptionsFromDB() {
    try {
      const res = await fetch('/api/options.php');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          const current = this.getAllOptions();
          const updated = { ...current };

          // Perbarui options array untuk setiap kategori yang ada di MySQL
          for (const catKey of Object.keys(data)) {
            if (updated[catKey] && Array.isArray(data[catKey]) && data[catKey].length > 0) {
              updated[catKey].options = data[catKey];
            }
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event('dropdown-options-updated'));
          return updated;
        }
      }
    } catch (e) {
      // offline / fallback
    }
    return this.getAllOptions();
  },

  // Get all categories and their options (sync from cache / defaults)
  getAllOptions() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DROPDOWN_OPTIONS));
      return { ...DEFAULT_DROPDOWN_OPTIONS };
    }
    try {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_DROPDOWN_OPTIONS, ...parsed };
    } catch (e) {
      return { ...DEFAULT_DROPDOWN_OPTIONS };
    }
  },

  // Get options array for a specific category
  getOptions(categoryKey) {
    const all = this.getAllOptions();
    return all[categoryKey]?.options || DEFAULT_DROPDOWN_OPTIONS[categoryKey]?.options || [];
  },

  // Add a new option to a category (Sinkron ke MySQL dan Local)
  async addOption(categoryKey, newOption) {
    if (!newOption || !newOption.trim()) return false;
    const trimmed = newOption.trim();

    try {
      await fetch('/api/options.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryKey, value: trimmed })
      });
    } catch (e) {
      // fallback
    }

    const all = this.getAllOptions();
    if (!all[categoryKey]) return false;

    if (!all[categoryKey].options.includes(trimmed)) {
      all[categoryKey].options.push(trimmed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('dropdown-options-updated'));
      return true;
    }
    return false;
  },

  // Update an existing option (Sinkron ke MySQL dan Local)
  async updateOption(categoryKey, oldOption, newOption) {
    if (!newOption || !newOption.trim()) return false;
    const trimmed = newOption.trim();

    try {
      await fetch('/api/options.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryKey, old_value: oldOption, new_value: trimmed })
      });
    } catch (e) {
      // fallback
    }

    const all = this.getAllOptions();
    if (!all[categoryKey]) return false;

    const index = all[categoryKey].options.indexOf(oldOption);
    if (index !== -1) {
      all[categoryKey].options[index] = trimmed;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('dropdown-options-updated'));
      return true;
    }
    return false;
  },

  // Delete an option (Sinkron ke MySQL dan Local)
  async deleteOption(categoryKey, optionToDelete) {
    try {
      await fetch('/api/options.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryKey, value: optionToDelete })
      });
    } catch (e) {
      // fallback
    }

    const all = this.getAllOptions();
    if (!all[categoryKey]) return false;

    all[categoryKey].options = all[categoryKey].options.filter(opt => opt !== optionToDelete);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('dropdown-options-updated'));
    return true;
  },

  // Reset to defaults
  resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DROPDOWN_OPTIONS));
    window.dispatchEvent(new Event('dropdown-options-updated'));
    return { ...DEFAULT_DROPDOWN_OPTIONS };
  }
};
