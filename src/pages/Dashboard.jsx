import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  PlaneTakeoff, 
  Clock, 
  Globe2, 
  ArrowUpRight, 
  ChevronRight,
  ExternalLink,
  School,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, allAlumni] = await Promise.all([
        api.getStatistik(),
        api.getAlumni()
      ]);
      setStats(statsData);
      setRecentAlumni(allAlumni.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AL';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activityData = Object.entries(stats.activityCounts || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-blue-600/20">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
            <School className="w-3.5 h-3.5 text-blue-200" />
            <span>SMK Negeri 1 Cirebon • Tracer Study Luar Negeri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Monitoring Penempatan Internasional Alumni
          </h1>
          <p className="text-sm text-blue-100 font-normal leading-relaxed">
            Pantau sebaran alumni SMK Negeri 1 Cirebon yang berkiprah di kancah global melalui program kerja, magang, beasiswa, dan kemitraan luar negeri.
          </p>
        </div>

        {/* Quick action buttons on top banner */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          <Link
            to="/alumni"
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-semibold rounded-xl shadow transition-all hover:scale-[1.02] flex items-center gap-1.5"
          >
            <span>Buka Data Alumni</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/master-options"
            className="px-4 py-2 bg-blue-800/60 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Kelola Master Dropdown</span>
          </Link>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Alumni Terdata"
          value={stats.total}
          icon={Users}
          subtitle="Siswa & lulusan SMKN 1 Cirebon"
          theme="blue"
          trend="100% Aktif"
        />

        <StatCard
          title="Sudah Berangkat"
          value={stats.sudahBerangkat}
          icon={PlaneTakeoff}
          subtitle="Bekerja / magang di LN"
          theme="emerald"
          trend={`${Math.round((stats.sudahBerangkat / (stats.total || 1)) * 100)}% dari total`}
        />

        <StatCard
          title="Dalam Proses"
          value={stats.dalamProses}
          icon={Clock}
          subtitle="Pelatihan / proses visa"
          theme="amber"
          trend="Menanti Berangkat"
        />

        <StatCard
          title="Negara Tujuan"
          value={stats.totalNegara}
          icon={Globe2}
          subtitle="Destinasi internasional"
          theme="purple"
          trend="Jepang, Korea, Jerman, dll"
        />
      </div>

      {/* 2 Primary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik 1: Bar Chart Negara Tujuan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Alumni Berdasarkan Negara Tujuan
              </h3>
              <p className="text-xs text-slate-500">
                Distribusi destinasi utama alumni SMKN 1 Cirebon di luar negeri
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700">
              Bar Chart
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.countryChart} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none', 
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }}
                  formatter={(val) => [`${val} Alumni`, 'Jumlah']}
                />
                <Bar 
                  dataKey="alumni" 
                  fill="#2563eb" 
                  radius={[8, 8, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik 2: Line Chart Keberangkatan Berdasarkan Tahun */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tren Keberangkatan Berdasarkan Tahun
              </h3>
              <p className="text-xs text-slate-500">
                Pertumbuhan jumlah keberangkatan per periode tahun
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700">
              Line Chart
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.yearChart} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    border: 'none', 
                    fontSize: '12px' 
                  }}
                  formatter={(val) => [`${val} Orang`, 'Keberangkatan']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Analytics: Activity Breakdown & Latest Placements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Proporsi Aktivitas
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pembagian jenis kegiatan alumni di luar negeri
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {activityData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-600 truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Alumni Placed Table Preview (Initials avatars, no photo) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Alumni Terbaru Ditempatkan
              </h3>
              <p className="text-xs text-slate-500">
                Daftar entri data alumni internasional teranyar
              </p>
            </div>
            <Link
              to="/alumni"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAlumni.map((alum) => (
              <div key={alum.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {getInitials(alum.nama)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{alum.nama}</p>
                    <p className="text-xs text-slate-500 truncate">{alum.konsentrasi_keahlian} • {alum.perusahaan || alum.negara_tujuan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-700 block">{alum.negara_tujuan}</span>
                    <span className="text-[11px] text-slate-400">{alum.aktivitas}</span>
                  </div>
                  <Link
                    to={`/alumni/detail/${alum.id}`}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
