import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '../store/authStore';
import { optionsService } from '../services/optionsService';

const DataTable = ({ alumniList = [], onDelete, onEdit }) => {
  const { role } = useAuth();

  // Dynamic Options from Master Data
  const [filterOptions, setFilterOptions] = useState({
    negara: [],
    status: [],
    aktivitas: [],
    jurusan: []
  });

  const loadOptions = () => {
    setFilterOptions({
      negara: optionsService.getOptions('negara_tujuan'),
      status: optionsService.getOptions('status'),
      aktivitas: optionsService.getOptions('aktivitas'),
      jurusan: optionsService.getOptions('konsentrasi_keahlian')
    });
  };

  useEffect(() => {
    loadOptions();
    const handleUpdate = () => loadOptions();
    window.addEventListener('dropdown-options-updated', handleUpdate);
    return () => window.removeEventListener('dropdown-options-updated', handleUpdate);
  }, []);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNegara, setFilterNegara] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAktivitas, setFilterAktivitas] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('nama');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Helper for Initials
  const getInitials = (name) => {
    if (!name) return 'AL';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return alumniList.filter((item) => {
      const matchSearch =
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nisn?.includes(searchTerm) ||
        item.perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.negara_tujuan?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchNegara = !filterNegara || item.negara_tujuan === filterNegara;
      const matchStatus = !filterStatus || item.status === filterStatus;
      const matchAktivitas = !filterAktivitas || item.aktivitas === filterAktivitas;
      const matchJurusan = !filterJurusan || item.konsentrasi_keahlian === filterJurusan;

      return matchSearch && matchNegara && matchStatus && matchAktivitas && matchJurusan;
    });
  }, [alumniList, searchTerm, filterNegara, filterStatus, filterAktivitas, filterJurusan]);

  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = sortedData.map((item, index) => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumni SMKN 1 Cirebon LN');
    XLSX.writeFile(workbook, `Alumni_SMKN1_Cirebon_LN_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('SMK NEGERI 1 CIREBON', 14, 12);
    doc.setFontSize(11);
    doc.text('Laporan Data Alumni Bekerja & Magang di Luar Negeri', 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')} | Total: ${sortedData.length} Alumni`, 14, 24);

    const tableColumn = ["No", "Nama", "NISN", "JK", "Jurusan / Keahlian", "Negara", "Status", "Aktivitas", "Thn"];
    const tableRows = sortedData.map((item, index) => [
      index + 1,
      item.nama,
      item.nisn,
      item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P',
      item.konsentrasi_keahlian,
      item.negara_tujuan,
      item.status,
      item.aktivitas,
      item.tahun_keberangkatan
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`Alumni_SMKN1_Cirebon_LN_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sudah Berangkat':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Dalam Proses':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Selesai Program':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActivityBadge = (activity) => {
    switch (activity) {
      case 'Bekerja':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Magang':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Studi':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Control bar */}
      <div className="p-5 border-b border-slate-100 space-y-4 no-print">
        {/* Top actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama, NISN, negara, instansi..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Export & Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-2xs"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns row (Loaded dynamically from Master Options) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Negara Tujuan</label>
            <select
              value={filterNegara}
              onChange={(e) => {
                setFilterNegara(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Negara</option>
              {filterOptions.negara.map((neg) => (
                <option key={neg} value={neg}>{neg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status Keberangkatan</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {filterOptions.status.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Aktivitas</label>
            <select
              value={filterAktivitas}
              onChange={(e) => {
                setFilterAktivitas(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Aktivitas</option>
              {filterOptions.aktivitas.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Konsentrasi Keahlian</label>
            <select
              value={filterJurusan}
              onChange={(e) => {
                setFilterJurusan(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Jurusan</option>
              {filterOptions.jurusan.map((jur) => (
                <option key={jur} value={jur}>{jur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {(filterNegara || filterStatus || filterAktivitas || filterJurusan || searchTerm) && (
          <div className="flex items-center justify-between text-xs text-blue-600 bg-blue-50/60 px-3 py-2 rounded-lg">
            <span>Ditemukan <strong>{sortedData.length}</strong> data alumni sesuai filter.</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterNegara('');
                setFilterStatus('');
                setFilterAktivitas('');
                setFilterJurusan('');
              }}
              className="font-bold underline hover:text-blue-800"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Table section */}
      <div className="overflow-x-auto print-area">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('nama')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Nama Lengkap</span>
                  {sortField === 'nama' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-4">NISN</th>
              <th className="py-3.5 px-4">JK</th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('konsentrasi_keahlian')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Konsentrasi Keahlian</span>
                  {sortField === 'konsentrasi_keahlian' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('negara_tujuan')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Negara</span>
                  {sortField === 'negara_tujuan' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Aktivitas</th>
              <th className="py-3.5 px-4 text-center no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-600">Tidak ada data alumni</p>
                    <p className="text-xs">Coba sesuaikan kata kunci pencarian atau reset filter di atas.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                      {globalIndex}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* Initials badge instead of photo */}
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(item.nama)}
                        </div>
                        <div>
                          <Link 
                            to={`/alumni/detail/${item.id}`} 
                            className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                          >
                            {item.nama}
                          </Link>
                          <div className="text-[11px] text-slate-400">
                            Lulus: {item.tahun_lulus || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {item.nisn}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        item.jenis_kelamin === 'Laki-laki' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-pink-50 text-pink-700'
                      }`}>
                        {item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {item.konsentrasi_keahlian}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{item.negara_tujuan}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-md border ${getActivityBadge(item.aktivitas)}`}>
                        {item.aktivitas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/alumni/detail/${item.id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail Profil"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {role === 'Admin' ? (
                          <>
                            <button
                              onClick={() => onEdit ? onEdit(item) : null}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Data"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete ? onDelete(item) : null}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Data Alumni"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic px-1">View Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 no-print">
        <div className="flex items-center gap-2">
          <span>Menampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>dari <strong>{sortedData.length}</strong> total data</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-semibold text-slate-700 px-2">
            Halaman {currentPage} dari {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
