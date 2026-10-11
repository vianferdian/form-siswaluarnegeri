import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Edit3, 
  Printer, 
  Building2, 
  Mail, 
  Phone,
  Globe2,
  School,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../store/authStore';

const DetailAlumni = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await api.getAlumniById(id);
      setAlumni(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper for initials avatar
  const getInitials = (name) => {
    if (!name) return 'AL';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500">Data alumni tidak ditemukan.</p>
        <Link to="/alumni" className="text-sm font-semibold text-blue-600 underline">
          Kembali ke tabel alumni
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 print-area">
      {/* Top back navigation */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/alumni"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Alumni</span>
        </Link>

        <div className="flex items-center gap-2">
          {role === 'Admin' && (
            <Link
              to={`/alumni/edit/${alumni.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </Link>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Biodata</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Initials Avatar (No photo) */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-50">
              {getInitials(alumni.nama)}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-white shadow">
              {alumni.tahun_lulus}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {alumni.nama}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                alumni.status === 'Sudah Berangkat' ? 'bg-emerald-100 text-emerald-800' :
                alumni.status === 'Dalam Proses' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {alumni.status}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
              NISN: <span className="font-mono text-slate-700 font-semibold">{alumni.nisn}</span> • {alumni.konsentrasi_keahlian}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="font-semibold text-slate-800">{alumni.negara_tujuan}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span>{alumni.aktivitas}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>{alumni.perusahaan || 'Mitra Internasional'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Cards: Biodata & Overseas Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom 1: Profil Identitas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>Biodata Siswa / Alumni</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Nama Lengkap</span>
              <span className="font-semibold text-slate-800">{alumni.nama}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">NISN</span>
              <span className="font-mono font-semibold text-slate-800">{alumni.nisn}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Jenis Kelamin</span>
              <span className="font-semibold text-slate-800">{alumni.jenis_kelamin}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Konsentrasi Keahlian</span>
              <span className="font-semibold text-slate-800 text-right">{alumni.konsentrasi_keahlian}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Tahun Kelulusan</span>
              <span className="font-semibold text-slate-800">{alumni.tahun_lulus}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Asal Sekolah</span>
              <span className="font-semibold text-slate-800">SMK Negeri 1 Cirebon</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">No. WhatsApp / HP</span>
              <span className="font-semibold text-slate-800">{alumni.kontak || '-'}</span>
            </div>
          </div>
        </div>

        {/* Kolom 2: Informasi Luar Negeri */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>Informasi Luar Negeri</span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Negara Tujuan</span>
              <span className="font-semibold text-blue-600 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                {alumni.negara_tujuan}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Skema Keberangkatan</span>
              <span className="font-semibold text-slate-800">{alumni.skema_keberangkatan}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Status Keberangkatan</span>
              <span className="font-semibold text-slate-800">{alumni.status}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Jenis Aktivitas</span>
              <span className="font-semibold text-slate-800">{alumni.aktivitas}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Bulan Keberangkatan</span>
              <span className="font-semibold text-slate-800">{alumni.bulan_keberangkatan}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-400">Tahun Keberangkatan</span>
              <span className="font-semibold text-slate-800">{alumni.tahun_keberangkatan}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Mitra / Perusahaan</span>
              <span className="font-semibold text-slate-800">{alumni.perusahaan || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAlumni;
