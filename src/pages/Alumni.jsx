import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { api } from '../services/api';
import { useAuth } from '../store/authStore';

const Alumni = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
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

  const handlePromptDelete = (alumni) => {
    setDeleteTarget(alumni);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteAlumni(deleteTarget.id);
      setToastMessage(`Data alumni "${deleteTarget.nama}" berhasil dihapus.`);
      setDeleteTarget(null);
      await fetchAlumni();
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditAlumni = (alumni) => {
    // Navigate to Add/Edit form with alumni ID
    navigate(`/alumni/edit/${alumni.id}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage('')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            <span>Database Alumni Luar Negeri — SMKN 1 Cirebon</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {alumniList.length} alumni SMK Negeri 1 Cirebon terdata aktif berkarir atau menempuh program internasional.
          </p>
        </div>

      </div>

      {/* Main Data Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[350px] bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable
          alumniList={alumniList}
          onDelete={handlePromptDelete}
          onEdit={handleEditAlumni}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus Data"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-center text-slate-700 font-medium">
            Apakah Anda yakin ingin menghapus data alumni <strong>{deleteTarget?.nama}</strong> (NISN: {deleteTarget?.nisn})?
          </p>
          <p className="text-xs text-center text-slate-400">
            Tindakan ini tidak dapat dibatalkan. Riwayat data keberangkatan dan dokumen alumni akan terhapus.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Alumni;
