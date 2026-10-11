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
      "Pelatihan"
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
  // Get all categories and their options
  getAllOptions() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DROPDOWN_OPTIONS));
      return { ...DEFAULT_DROPDOWN_OPTIONS };
    }
    try {
      const parsed = JSON.parse(data);
      // Ensure all keys exist
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

  // Add a new option to a category
  addOption(categoryKey, newOption) {
    if (!newOption || !newOption.trim()) return false;
    const all = this.getAllOptions();
    if (!all[categoryKey]) return false;

    const trimmed = newOption.trim();
    if (!all[categoryKey].options.includes(trimmed)) {
      all[categoryKey].options.push(trimmed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('dropdown-options-updated'));
      return true;
    }
    return false;
  },

  // Update an existing option
  updateOption(categoryKey, oldOption, newOption) {
    if (!newOption || !newOption.trim()) return false;
    const all = this.getAllOptions();
    if (!all[categoryKey]) return false;

    const index = all[categoryKey].options.indexOf(oldOption);
    if (index !== -1) {
      all[categoryKey].options[index] = newOption.trim();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new Event('dropdown-options-updated'));
      return true;
    }
    return false;
  },

  // Delete an option
  deleteOption(categoryKey, optionToDelete) {
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
