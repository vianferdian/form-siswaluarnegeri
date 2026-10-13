import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Globe2, 
  AlertCircle,
  School,
  Sliders
} from 'lucide-react';
import { FormInput, FormSelect } from '../components/FormInput';
import { api } from '../services/api';
import { optionsService } from '../services/optionsService';

const AddAlumni = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic dropdown options from Master Data
  const [options, setOptions] = useState({
    konsentrasi_keahlian: [],
    negara_tujuan: [],
    skema_keberangkatan: [],
    status: [],
    aktivitas: [],
    bulan_keberangkatan: []
  });

  const loadDropdownOptions = async () => {
    const all = await optionsService.fetchOptionsFromDB();
    setOptions({
      konsentrasi_keahlian: all.konsentrasi_keahlian?.options || [],
      negara_tujuan: all.negara_tujuan?.options || [],
      skema_keberangkatan: all.skema_keberangkatan?.options || [],
      status: all.status?.options || [],
      aktivitas: all.aktivitas?.options || [],
      bulan_keberangkatan: all.bulan_keberangkatan?.options || []
    });
  };

  useEffect(() => {
    loadDropdownOptions();
    const handleUpdate = () => loadDropdownOptions();
    window.addEventListener('dropdown-options-updated', handleUpdate);
    return () => window.removeEventListener('dropdown-options-updated', handleUpdate);
  }, []);

  // Form State (No documents or photo upload)
  const [formData, setFormData] = useState({
    nama: '',
    nisn: '',
    jenis_kelamin: 'Laki-laki',
    konsentrasi_keahlian: '',
    tahun_lulus: '2025',
    negara_tujuan: '',
    negara_manual: '',
    skema_keberangkatan: '',
    status: 'Dalam Proses',
    aktivitas: 'Bekerja',
    bulan_keberangkatan: 'April',
    tahun_keberangkatan: new Date().getFullYear().toString(),
    perusahaan: '',
    kontak: '',
    email: ''
  });

  // Set default values once options load if in create mode
  useEffect(() => {
    if (!isEditMode && options.konsentrasi_keahlian.length > 0) {
      setFormData(prev => ({
        ...prev,
        konsentrasi_keahlian: prev.konsentrasi_keahlian || options.konsentrasi_keahlian[0],
        negara_tujuan: prev.negara_tujuan || options.negara_tujuan[0],
        skema_keberangkatan: prev.skema_keberangkatan || options.skema_keberangkatan[0],
        status: prev.status || options.status[0],
        aktivitas: prev.aktivitas || options.aktivitas[0],
        bulan_keberangkatan: prev.bulan_keberangkatan || options.bulan_keberangkatan[0]
      }));
    }
  }, [options, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      loadAlumniForEdit();
    }
  }, [id]);

  const loadAlumniForEdit = async () => {
    try {
      setInitialLoading(true);
      const data = await api.getAlumniById(id);
      
      const availableCountries = optionsService.getOptions('negara_tujuan');
      const isKnownCountry = availableCountries.includes(data.negara_tujuan);
      
      setFormData({
        ...data,
        negara_tujuan: isKnownCountry ? data.negara_tujuan : 'Lainnya',
        negara_manual: isKnownCountry ? '' : data.negara_tujuan,
      });
    } catch (err) {
      setErrorMsg('Gagal memuat data alumni: ' + err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nama.trim()) {
      setErrorMsg('Nama Lengkap wajib diisi');
      return;
    }
    if (!formData.nisn.trim()) {
      setErrorMsg('NISN wajib diisi');
      return;
    }
    if (formData.negara_tujuan === 'Lainnya' && !formData.negara_manual.trim()) {
      setErrorMsg('Silakan sebutkan nama Negara Tujuan manual');
      return;
    }

    try {
      setLoading(true);

      const targetCountry = formData.negara_tujuan === 'Lainnya' 
        ? formData.negara_manual.trim() 
        : formData.negara_tujuan;

      const payload = {
        ...formData,
        negara_tujuan: targetCountry
      };

      if (isEditMode) {
        await api.updateAlumni(id, payload);
      } else {
        await api.createAlumni(payload);
      }

      navigate('/alumni');
    } catch (err) {
      setErrorMsg('Gagal menyimpan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/alumni"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Alumni</span>
        </Link>

        <Link
          to="/master-options"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Kelola Pilihan Dropdown</span>
        </Link>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {isEditMode ? 'Edit Data Alumni' : 'Tambah Data Alumni'} — SMK Negeri 1 Cirebon
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pendataan alumni yang beraktivitas di luar negeri. Seluruh opsi isian dropdown dapat dikelola di menu Master Dropdown.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Data Identitas Alumni */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Biodata Siswa / Alumni</h2>
              <p className="text-[11px] text-slate-400">Identitas kelulusan SMK Negeri 1 Cirebon</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nama Lengkap"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Contoh: Ahmad Fauzan"
              required
            />

            <FormInput
              label="NISN (Nomor Induk Siswa Nasional)"
              name="nisn"
              type="text"
              value={formData.nisn}
              onChange={handleInputChange}
              placeholder="10 Digit NISN (Contoh: 0098765432)"
              required
            />

            <FormSelect
              label="Jenis Kelamin"
              name="jenis_kelamin"
              value={formData.jenis_kelamin}
              onChange={handleInputChange}
              options={["Laki-laki", "Perempuan"]}
              required
            />

            <FormSelect
              label="Konsentrasi Keahlian / Jurusan"
              name="konsentrasi_keahlian"
              value={formData.konsentrasi_keahlian}
              onChange={handleInputChange}
              options={options.konsentrasi_keahlian}
              required
            />

            <FormInput
              label="Tahun Lulus"
              name="tahun_lulus"
              type="number"
              value={formData.tahun_lulus}
              onChange={handleInputChange}
              placeholder="Contoh: 2024"
              required
            />

            <FormInput
              label="No. Kontak / WhatsApp"
              name="kontak"
              value={formData.kontak}
              onChange={handleInputChange}
              placeholder="Contoh: 08123456789"
            />

            <div className="md:col-span-2">
              <FormInput
                label="Email (Opsional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alumni@smkn1cirebon.sch.id"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Data Keberangkatan Luar Negeri */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Aktivitas & Penempatan Luar Negeri</h2>
              <p className="text-[11px] text-slate-400">Rincian negara tujuan, skema, dan status keberangkatan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Negara Tujuan */}
            <div>
              <FormSelect
                label="Negara Tujuan"
                name="negara_tujuan"
                value={formData.negara_tujuan}
                onChange={handleInputChange}
                options={options.negara_tujuan}
                required
              />

              {formData.negara_tujuan === 'Lainnya' && (
                <div className="mt-2.5 animate-fade-in">
                  <FormInput
                    label="Tuliskan Nama Negara"
                    name="negara_manual"
                    value={formData.negara_manual}
                    onChange={handleInputChange}
                    placeholder="Contoh: Australia, Taiwan, Inggris..."
                    required
                  />
                </div>
              )}
            </div>

            <FormSelect
              label="Skema Keberangkatan"
              name="skema_keberangkatan"
              value={formData.skema_keberangkatan}
              onChange={handleInputChange}
              options={options.skema_keberangkatan}
              required
            />

            <FormSelect
              label="Status Keberangkatan"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={options.status}
              required
            />

            <FormSelect
              label="Jenis Aktivitas"
              name="aktivitas"
              value={formData.aktivitas}
              onChange={handleInputChange}
              options={options.aktivitas}
              required
            />

            <FormSelect
              label="Bulan Keberangkatan"
              name="bulan_keberangkatan"
              value={formData.bulan_keberangkatan}
              onChange={handleInputChange}
              options={options.bulan_keberangkatan}
              required
            />

            <FormInput
              label="Tahun Keberangkatan"
              name="tahun_keberangkatan"
              type="number"
              value={formData.tahun_keberangkatan}
              onChange={handleInputChange}
              placeholder="Contoh: 2026"
              required
            />

            <div className="md:col-span-2">
              <FormInput
                label="Perusahaan / Kampus / Lembaga di Luar Negeri"
                name="perusahaan"
                value={formData.perusahaan}
                onChange={handleInputChange}
                placeholder="Contoh: Hitachi Systems Ltd (Tokyo) / Ausbildung Hamburg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/alumni"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Data Alumni')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlumni;
