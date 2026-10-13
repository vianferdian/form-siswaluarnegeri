import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, School, Globe2, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login gagal! Periksa email dan kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* SISI KIRI: Full Screen Hero Showcase (50% - 55% screen) */}
      <div className="lg:w-1/2 xl:w-7/12 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Glow & Mesh Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center gap-3.5">
          <img 
            src="/logo-smk.png" 
            alt="Logo SMKN 1 Cirebon" 
            className="w-12 h-12 object-contain shrink-0" 
          />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight leading-tight">
              SMK Negeri 1 Cirebon
            </h2>
            <p className="text-xs text-blue-400 font-semibold">Tracer Study & Hubungan Industri</p>
          </div>
        </div>

        {/* Center Hero Information */}
        <div className="relative z-10 my-10 lg:my-0 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-bold text-blue-300">
            <Globe2 className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>International Career & Alumni Tracer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Sistem Informasi Pendataan Alumni Luar Negeri
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Platform monitoring dan rekapitulasi data alumni SMK Negeri 1 Cirebon yang berkarir, magang, studi, atau mengikuti program resmi di berbagai belahan dunia.
          </p>

          {/* Destinasi Populer Badges */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Destinasi Penempatan Utama:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-medium">
                🇯🇵 Jepang (Hitachi, Panasonic, dll)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-medium">
                🇰🇷 Korea Selatan (G to G)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-medium">
                🇩🇪 Jerman (Ausbildung)
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-medium">
                🇹🇼 Taiwan
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Info Note */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span>Portal Resmi SMK Negeri 1 Cirebon</span>
          <span>© 2026 Hak Cipta Terpelihara</span>
        </div>
      </div>

      {/* SISI KANAN: Full Screen Clean Form (No floating card, edge-to-edge container) */}
      <div className="lg:w-1/2 xl:w-5/12 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        
        {/* Top spacer or quick link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
          >
            <span>← Kembali ke Formulir Siswa</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/60 transition-colors flex items-center gap-1.5"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Form Mandiri Alumni</span>
          </Link>
        </div>

        {/* Main Form Center Box */}
        <div className="w-full max-w-sm mx-auto my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Masuk Sistem Admin
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Masuk menggunakan akun petugas untuk mengelola database alumni.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.sch.id"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 text-sm"
            >
              <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Section Khusus Alumni */}
          <div className="pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Apakah Anda alumni yang sedang di luar negeri?
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span>Isi Formulir Pendataan Mandiri di Sini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer Note */}
        <div className="text-center text-[11px] text-slate-400">
          Sistem Pendataan Alumni Luar Negeri • SMK Negeri 1 Cirebon
        </div>
      </div>

    </div>
  );
};

export default Login;
