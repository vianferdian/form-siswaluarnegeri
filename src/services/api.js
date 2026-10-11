import { INITIAL_ALUMNI } from '../data/dummyData';

const STORAGE_KEY = 'smkn1cirebon_alumni_db';

// Helper to get local data
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

// API Service: Simulated backend with ready-to-plug Axios configuration
export const api = {
  // GET /api/alumni
  async getAlumni() {
    await new Promise((res) => setTimeout(res, 150)); // simulate brief network latency
    return getLocalData();
  },

  // GET /api/alumni/:id
  async getAlumniById(id) {
    await new Promise((res) => setTimeout(res, 100));
    const list = getLocalData();
    const found = list.find((item) => String(item.id) === String(id));
    if (!found) {
      throw new Error('Alumni tidak ditemukan');
    }
    return found;
  },

  // POST /api/alumni
  async createAlumni(alumniData) {
    await new Promise((res) => setTimeout(res, 200));
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
  },

  // PUT /api/alumni/:id
  async updateAlumni(id, updatedFields) {
    await new Promise((res) => setTimeout(res, 200));
    const list = getLocalData();
    const index = list.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
      throw new Error('Alumni tidak ditemukan untuk diupdate');
    }
    const updated = {
      ...list[index],
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    list[index] = updated;
    saveLocalData(list);
    return updated;
  },

  // DELETE /api/alumni/:id
  async deleteAlumni(id) {
    await new Promise((res) => setTimeout(res, 200));
    const list = getLocalData();
    const filtered = list.filter((item) => String(item.id) !== String(id));
    saveLocalData(filtered);
    return { success: true };
  },

  // GET /api/statistik
  async getStatistik() {
    const list = getLocalData();
    const total = list.length;
    const sudahBerangkat = list.filter(a => a.status === 'Sudah Berangkat').length;
    const dalamProses = list.filter(a => a.status === 'Dalam Proses').length;
    const selesaiProgram = list.filter(a => a.status === 'Selesai Program').length;
    const belumBerangkat = list.filter(a => a.status === 'Belum Berangkat').length;

    const uniqueCountries = new Set(list.map(a => a.negara_tujuan).filter(Boolean));
    const totalNegara = uniqueCountries.size;

    // Distribution by Country
    const countryCounts = {};
    list.forEach(a => {
      const c = a.negara_tujuan || 'Lainnya';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });
    const countryChart = Object.entries(countryCounts).map(([name, count]) => ({
      name,
      alumni: count
    })).sort((a, b) => b.alumni - a.alumni);

    // Distribution by Year
    const yearCounts = {};
    list.forEach(a => {
      const yr = a.tahun_keberangkatan || a.tahun_lulus || '2024';
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    });
    const yearChart = Object.entries(yearCounts).map(([year, total]) => ({
      year,
      total
    })).sort((a, b) => a.year.localeCompare(b.year));

    // Distribution by Activity
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
