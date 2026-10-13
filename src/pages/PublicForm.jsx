import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FormInput, FormSelect } from '../components/FormInput';
import { api } from '../services/api';
import { optionsService } from '../services/optionsService';

const PublicForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdAlumni, setCreatedAlumni] = useState(null);

  // Dynamic dropdown options from Master Data
  const [options, setOptions] = useState({
    konsentrasi_keahlian: [],
    negara_tujuan: [],
    skema_keberangkatan: [],
    status: [],
    aktivitas: [],
    bulan_keberangkatan: []
  });

  useEffect(() => {
    const loadedOptions = {
      konsentrasi_keahlian: optionsService.getOptions('konsentrasi_keahlian'),
      negara_tujuan: optionsService.getOptions('negara_tujuan'),
      skema_keberangkatan: optionsService.getOptions('skema_keberangkatan'),
      status: optionsService.getOptions('status'),
      aktivitas: optionsService.getOptions('aktivitas'),
      bulan_keberangkatan: optionsService.getOptions('bulan_keberangkatan')
    };
    setOptions(loadedOptions);

    // Initial default values
    setFormData(prev => ({
      ...prev,
      konsentrasi_keahlian: loadedOptions.konsentrasi_keahlian[0] || '',
      negara_tujuan: loadedOptions.negara_tujuan[0] || '',
      skema_keberangkatan: loadedOptions.skema_keberangkatan[0] || '',
      status: loadedOptions.status[0] || 'Sudah Berangkat',
      aktivitas: loadedOptions.aktivitas[0] || 'Bekerja',
      bulan_keberangkatan: loadedOptions.bulan_keberangkatan[0] || 'Januari'
    }));
  }, []);

  // Form state (No photos or documents)
  const [formData, setFormData] = useState({
    nama: '',
    nisn: '',
    jenis_kelamin: 'Laki-laki',
    konsentrasi_keahlian: '',
    tahun_lulus: '2024',
    kontak: '',
    email: '',
    negara_tujuan: '',
    negara_manual: '',
    skema_keberangkatan: '',
    status: 'Sudah Berangkat',
    aktivitas: 'Bekerja',
    bulan_keberangkatan: 'April',
    tahun_keberangkatan: new Date().getFullYear().toString(),
    perusahaan: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nama.trim()) {
      setErrorMsg('Nama Lengkap wajib diisi.');
      return;
    }
    if (!formData.nisn.trim()) {
      setErrorMsg('NISN wajib diisi.');
      return;
    }
    if (formData.negara_tujuan === 'Lainnya' && !formData.negara_manual.trim()) {
      setErrorMsg('Silakan tuliskan nama negara tujuan Anda.');
      return;
    }

    try {
      setLoading(true);

      const targetCountry = formData.negara_tujuan === 'Lainnya' 
        ? formData.negara_manual.trim() 
        : formData.negara_tujuan;

      const payload = {
        ...formData,
        negara_tujuan: targetCountry,
        sumber: 'Mandiri Tracer Alumni SMKN 1 Cirebon'
      };

      const result = await api.createAlumni(payload);
      setCreatedAlumni(result);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg('Gagal mengirim formulir: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      nama: '',
      nisn: '',
      jenis_kelamin: 'Laki-laki',
      konsentrasi_keahlian: options.konsentrasi_keahlian[0] || '',
      tahun_lulus: '2024',
      kontak: '',
      email: '',
      negara_tujuan: options.negara_tujuan[0] || '',
      negara_manual: '',
      skema_keberangkatan: options.skema_keberangkatan[0] || '',
      status: options.status[0] || 'Sudah Berangkat',
      aktivitas: options.aktivitas[0] || 'Bekerja',
      bulan_keberangkatan: options.bulan_keberangkatan[0] || 'Januari',
      tahun_keberangkatan: new Date().getFullYear().toString(),
      perusahaan: ''
    });
    setSubmitted(false);
    setCreatedAlumni(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white text-slate-800 antialiased py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo-smk.png" 
            alt="Logo SMKN 1 Cirebon" 
            className="w-11 h-11 object-contain shrink-0" 
          />
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              SMK Negeri 1 Cirebon
            </h2>
            <p className="text-xs text-blue-600 font-semibold">Tracer Study Alumni Luar Negeri</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Pendataan Alumni Internasional
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Alumni SMK Negeri 1 Cirebon di Luar Negeri 🌏
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
              Halo rekan alumni SMKN 1 Cirebon! Mohon luangkan waktu 1 menit untuk mengisi pendataan diri bagi rekan alumni yang sedang beraktivitas di luar negeri. Pengisian cepat tanpa perlu upload foto atau berkas.
            </p>
          </div>

          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Success View */}
        {submitted ? (
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-lg p-6 sm:p-8 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Terima Kasih, Data Berhasil Dikirim! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Data Anda telah tersimpan ke sistem database SMK Negeri 1 Cirebon dan otomatis masuk ke rekapitulasi tracer study internasional.
              </p>
            </div>

            {/* Summary Receipt Card */}
            {createdAlumni && (
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-200/80 pb-2 font-bold text-slate-700">
                  <span>Ringkasan Entri Alumni:</span>
                  <span className="text-emerald-600">ID #{createdAlumni.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Lengkap:</span>
                  <span className="font-semibold text-slate-800">{createdAlumni.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NISN:</span>
                  <span className="font-mono text-slate-800">{createdAlumni.nisn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurusan:</span>
                  <span className="font-medium text-slate-800">{createdAlumni.konsentrasi_keahlian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Negara Tujuan:</span>
                  <span className="font-semibold text-blue-600">{createdAlumni.negara_tujuan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aktivitas / Status:</span>
                  <span className="font-medium text-slate-800">{createdAlumni.aktivitas} ({createdAlumni.status})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Instansi / Perusahaan:</span>
                  <span className="font-medium text-slate-800">{createdAlumni.perusahaan || '-'}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={handleResetForm}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all"
              >
                Kirim Tanggapan Lain
              </button>
            </div>
          </div>
        ) : (
          /* Form Input */
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Bagian 1: Identitas Alumni */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Biodata Diri Alumni</h3>
                  <p className="text-[11px] text-slate-400">Data kelulusan di SMK Negeri 1 Cirebon</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormInput
                    label="Nama Lengkap"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap sesuai ijazah"
                    required
                  />
                </div>

                <FormInput
                  label="NISN (Nomor Induk Siswa Nasional)"
                  name="nisn"
                  type="text"
                  value={formData.nisn}
                  onChange={handleInputChange}
                  placeholder="Contoh: 0098765432"
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
                  label="Tahun Kelulusan"
                  name="tahun_lulus"
                  type="number"
                  value={formData.tahun_lulus}
                  onChange={handleInputChange}
                  placeholder="Contoh: 2024"
                  required
                />

                <FormInput
                  label="Nomor WhatsApp Aktif"
                  name="kontak"
                  value={formData.kontak}
                  onChange={handleInputChange}
                  placeholder="Contoh: 08123456789"
                  helper="Untuk keperluan komunikasi tracer study sekolah"
                />

                <FormInput
                  label="Alamat Email (Opsional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alumni@smkn1cirebon.sch.id"
                />
              </div>
            </div>

            {/* Bagian 2: Aktivitas Luar Negeri */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Aktivitas & Penempatan di Luar Negeri</h3>
                  <p className="text-[11px] text-slate-400">Rincian negara, skema, dan status keberangkatan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        label="Sebutkan Nama Negara"
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
                  label="Jenis Aktivitas Utama"
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
                  placeholder="Contoh: 2025"
                  required
                />

                <div className="sm:col-span-2">
                  <FormInput
                    label="Nama Perusahaan / Universitas / Lembaga di Luar Negeri"
                    name="perusahaan"
                    value={formData.perusahaan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Hitachi Systems Ltd (Tokyo) / Ausbildung Hamburg"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 text-sm sm:text-base"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Mengirim Formulir...' : 'Kirim Data Tracer Study'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-3">
                Data Anda dilindungi dan hanya digunakan untuk keperluan resmi SMK Negeri 1 Cirebon.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublicForm;
