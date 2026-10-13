import { INITIAL_ALUMNI } from '../data/dummyData';

const STORAGE_KEY = 'smkn1cirebon_alumni_db';

const getLocalData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ALUMNI));
    return [...INITIAL_ALUMNI];
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [...INITIAL_ALUMNI];
  }
};

const saveLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const isLocalDev = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// API Service: Terkoneksi ke MySQL Backend (/api/alumni.php)
export const api = {
  // GET /api/alumni.php
  async getAlumni() {
    try {
      const res = await fetch('/api/alumni.php');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveLocalData(data);
          return data;
        }
      } else {
        const err = await res.json().catch(() => null);
        if (err && err.error) {
          throw new Error(err.error);
        }
      }
    } catch (e) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
    }

    if (isLocalDev()) {
      return getLocalData();
    }
    throw new Error('Database server belum terhubung. Silakan buka /api/setup.php untuk menghubungkan MySQL.');
  },

  // GET /api/alumni.php?id=:id
  async getAlumniById(id) {
    try {
      const res = await fetch(`/api/alumni.php?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return data;
        }
      }
    } catch (e) {
      if (e.message && !e.message.includes('fetch')) {
        throw e;
      }
    }

    const list = getLocalData();
    const found = list.find((item) => String(item.id) === String(id));
    if (!found) {
      throw new Error('Alumni tidak ditemukan');
    }
    return found;
  },

  // POST /api/alumni.php (Tambah dari formulir atau admin)
  async createAlumni(alumniData) {
    try {
      const res = await fetch('/api/alumni.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumniData)
      });
      if (res.ok) {
        const created = await res.json();
        const list = getLocalData();
        saveLocalData([created, ...list]);
        return created;
      } else {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Gagal menyimpan ke server MySQL (HTTP ${res.status}).`);
      }
    } catch (e) {
      if (isLocalDev() && e.message.includes('fetch')) {
        const list = getLocalData();
        const newId = list.length > 0 ? Math.max(...list.map(a => Number(a.id) || 0)) + 1 : 1;
        const newRecord = {
          ...alumniData,
          id: newId,
          created_at: new Date().toISOString()
        };
        const updated = [newRecord, ...list];
        saveLocalData(updated);
        return newRecord;
      }
      throw e;
    }
  },

  // PUT /api/alumni.php?id=:id
  async updateAlumni(id, updatedFields) {
    try {
      const res = await fetch(`/api/alumni.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedFields, id })
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocalData();
        const idx = list.findIndex(i => String(i.id) === String(id));
        if (idx !== -1) list[idx] = updated;
        saveLocalData(list);
        return updated;
      } else {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Gagal mengupdate data alumni di database server.');
      }
    } catch (e) {
      if (isLocalDev()) {
        const list = getLocalData();
        const index = list.findIndex((item) => String(item.id) === String(id));
        if (index === -1) throw new Error('Alumni tidak ditemukan');
        const updated = { ...list[index], ...updatedFields, updated_at: new Date().toISOString() };
        list[index] = updated;
        saveLocalData(list);
        return updated;
      }
      throw e;
    }
  },

  // DELETE /api/alumni.php?id=:id
  async deleteAlumni(id) {
    try {
      const res = await fetch(`/api/alumni.php?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const list = getLocalData().filter(i => String(i.id) !== String(id));
        saveLocalData(list);
        return { success: true };
      } else {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Gagal menghapus data alumni di database server.');
      }
    } catch (e) {
      if (isLocalDev()) {
        const list = getLocalData().filter((item) => String(item.id) !== String(id));
        saveLocalData(list);
        return { success: true };
      }
      throw e;
    }
  },

  // GET /api/stats.php (Statistik Dashboard & Laporan)
  async getStatistik() {
    try {
      const res = await fetch('/api/stats.php');
      if (res.ok) {
        const stats = await res.json();
        if (stats && stats.total !== undefined) {
          return stats;
        }
      }
    } catch (e) {
      // fallback
    }

    // Client-side fallback calculation
    const list = getLocalData();
    const total = list.length;
    const sudahBerangkat = list.filter(a => a.status === 'Sudah Berangkat').length;
    const dalamProses = list.filter(a => a.status === 'Dalam Proses').length;
    const selesaiProgram = list.filter(a => a.status === 'Selesai Program').length;
    const belumBerangkat = list.filter(a => a.status === 'Belum Berangkat').length;

    const uniqueCountries = new Set(list.map(a => a.negara_tujuan).filter(Boolean));
    const totalNegara = uniqueCountries.size;

    const countryCounts = {};
    list.forEach(a => {
      const c = a.negara_tujuan || 'Lainnya';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });
    const countryChart = Object.entries(countryCounts).map(([name, count]) => ({
      name,
      alumni: count
    })).sort((a, b) => b.alumni - a.alumni);

    const yearCounts = {};
    list.forEach(a => {
      const yr = a.tahun_keberangkatan || a.tahun_lulus || '2024';
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    });
    const yearChart = Object.entries(yearCounts).map(([year, total]) => ({
      year,
      total
    })).sort((a, b) => a.year.localeCompare(b.year));

    const activityCounts = {};
    list.forEach(a => {
      const act = a.aktivitas || 'Bekerja';
      activityCounts[act] = (activityCounts[act] || 0) + 1;
    });

    return {
      total,
      sudahBerangkat,
      dalamProses,
      selesaiProgram,
      belumBerangkat,
      totalNegara,
      countryChart,
      yearChart,
      activityCounts
    };
  },

  // Reset database back to default initial data
  resetDatabase() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ALUMNI));
    return [...INITIAL_ALUMNI];
  }
};
