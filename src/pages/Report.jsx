import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileBarChart, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Globe2, 
  Briefcase, 
  School,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { api } from '../services/api';
import { optionsService } from '../services/optionsService';

const Report = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic filter options from Master Data
  const [options, setOptions] = useState({
    negara: [],
    status: [],
    jurusan: []
  });

  const loadOptions = () => {
    setOptions({
      negara: optionsService.getOptions('negara_tujuan'),
      status: optionsService.getOptions('status'),
      jurusan: optionsService.getOptions('konsentrasi_keahlian')
    });
  };

  useEffect(() => {
    loadOptions();
    const handleUpdate = () => loadOptions();
    window.addEventListener('dropdown-options-updated', handleUpdate);
    return () => window.removeEventListener('dropdown-options-updated', handleUpdate);
  }, []);

  // Filter selections
  const [selectedTahun, setSelectedTahun] = useState('');
  const [selectedNegara, setSelectedNegara] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAlumni();
      setAlumniList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableYears = useMemo(() => {
    const years = new Set(alumniList.map(a => a.tahun_keberangkatan || a.tahun_lulus).filter(Boolean));
    return Array.from(years).sort().reverse();
  }, [alumniList]);

  const filteredData = useMemo(() => {
    return alumniList.filter((item) => {
      const matchTahun = !selectedTahun || 
        item.tahun_keberangkatan === selectedTahun || 
        item.tahun_lulus === selectedTahun;
      const matchNegara = !selectedNegara || item.negara_tujuan === selectedNegara;
      const matchJurusan = !selectedJurusan || item.konsentrasi_keahlian === selectedJurusan;
      const matchStatus = !selectedStatus || item.status === selectedStatus;

      return matchTahun && matchNegara && matchJurusan && matchStatus;
    });
  }, [alumniList, selectedTahun, selectedNegara, selectedJurusan, selectedStatus]);

  const summaryMetrics = useMemo(() => {
    const jepang = filteredData.filter(a => a.negara_tujuan === 'Jepang').length;
    const korea = filteredData.filter(a => a.negara_tujuan === 'Korea Selatan').length;
    const jerman = filteredData.filter(a => a.negara_tujuan === 'Jerman').length;
    const turki = filteredData.filter(a => a.negara_tujuan === 'Turki').length;

    const bekerja = filteredData.filter(a => a.aktivitas === 'Bekerja').length;
    const magang = filteredData.filter(a => a.aktivitas === 'Magang').length;
    const studi = filteredData.filter(a => a.aktivitas === 'Studi').length;
    const pelatihan = filteredData.filter(a => a.aktivitas === 'Pelatihan').length;

    return {
      jepang,
      korea,
      jerman,
      turki,
      bekerja,
      magang,
      studi,
      pelatihan,
      total: filteredData.length
    };
  }, [filteredData]);

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama,
      NISN: item.nisn,
      'Jenis Kelamin': item.jenis_kelamin,
      'Konsentrasi Keahlian': item.konsentrasi_keahlian,
      'Tahun Lulus': item.tahun_lulus,
      'Negara Tujuan': item.negara_tujuan,
      'Skema Keberangkatan': item.skema_keberangkatan,
      Status: item.status,
      Aktivitas: item.aktivitas,
      'Bulan Berangkat': item.bulan_keberangkatan,
      'Tahun Berangkat': item.tahun_keberangkatan,
      'Perusahaan / Mitra': item.perusahaan || '-',
      Kontak: item.kontak || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Alumni SMKN 1 Cirebon');
    XLSX.writeFile(workbook, `Laporan_Alumni_SMKN1_Cirebon_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('SMK NEGERI 1 CIREBON', 14, 12);
    doc.setFontSize(10);
    doc.text('Laporan Rekapitulasi Tracer Study Alumni Bekerja & Magang di Luar Negeri', 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Kriteria: Tahun=${selectedTahun || 'Semua'}, Negara=${selectedNegara || 'Semua'}, Jurusan=${selectedJurusan || 'Semua'} | Total Data: ${filteredData.length}`, 14, 24);

    const tableColumn = ["No", "Nama", "NISN", "JK", "Jurusan", "Negara", "Skema", "Status", "Aktivitas", "Thn"];
    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.nama,
      item.nisn,
      item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P',
      item.konsentrasi_keahlian,
      item.negara_tujuan,
      item.skema_keberangkatan,
      item.status,
      item.aktivitas,
      item.tahun_keberangkatan
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 58, 138] }
    });

    doc.save(`Laporan_Alumni_SMKN1_Cirebon_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <FileBarChart className="w-7 h-7 text-blue-600" />
            <span>Laporan Tracer Study Alumni — SMKN 1 Cirebon</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi resmi alumni SMK Negeri 1 Cirebon yang berkarir di luar negeri.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Laporan</span>
          </button>
        </div>
      </div>

      {/* Filter Panel (Loaded from Master Options) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Filter Kriteria Laporan</span>
          </div>
          <Link
            to="/master-options"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kelola Opsi Filter</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Keberangkatan / Lulus</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Negara Tujuan</label>
            <select
              value={selectedNegara}
              onChange={(e) => setSelectedNegara(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Negara</option>
              {options.negara.map(neg => (
                <option key={neg} value={neg}>{neg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Konsentrasi Keahlian</label>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Konsentrasi</option>
              {options.jurusan.map(jur => (
                <option key={jur} value={jur}>{jur}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Keberangkatan</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {options.status.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Output Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800">
          Ringkasan Metrik SMKN 1 Cirebon
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Jumlah Alumni Jepang</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-blue-600">{summaryMetrics.jepang}</span>
              <span className="text-xs text-slate-400">Orang</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Jumlah Alumni Korea</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-indigo-600">{summaryMetrics.korea}</span>
              <span className="text-xs text-slate-400">Orang</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Jumlah Alumni Bekerja</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-emerald-600">{summaryMetrics.bekerja}</span>
              <span className="text-xs text-slate-400">Orang</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 block">Jumlah Alumni Magang</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-extrabold text-amber-600">{summaryMetrics.magang}</span>
              <span className="text-xs text-slate-400">Orang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rekap Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print-area">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Daftar Siswa/Alumni Terpilih ({filteredData.length} data)
          </span>
          <span className="text-[11px] text-blue-600 font-semibold">
            SMK Negeri 1 Cirebon
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3">Nama Lengkap</th>
                <th className="py-3 px-3">NISN</th>
                <th className="py-3 px-3">JK</th>
                <th className="py-3 px-3">Konsentrasi Keahlian</th>
                <th className="py-3 px-3">Negara</th>
                <th className="py-3 px-3">Skema</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Aktivitas</th>
                <th className="py-3 px-3">Bulan/Tahun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-400">
                    Tidak ada data alumni dengan kriteria filter tersebut.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.nama}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{item.nisn}</td>
                    <td className="py-2.5 px-3">{item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                    <td className="py-2.5 px-3">{item.konsentrasi_keahlian}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{item.negara_tujuan}</td>
                    <td className="py-2.5 px-3">{item.skema_keberangkatan}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{item.aktivitas}</td>
                    <td className="py-2.5 px-3">{item.bulan_keberangkatan} {item.tahun_keberangkatan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
