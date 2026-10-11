import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Check, 
  X,
  School,
  Sparkles
} from 'lucide-react';
import { optionsService, DEFAULT_DROPDOWN_OPTIONS } from '../services/optionsService';
import Modal from '../components/Modal';

const MasterOptions = () => {
  const [categories, setCategories] = useState({});
  const [activeTab, setActiveTab] = useState('konsentrasi_keahlian');
  const [newOptionText, setNewOptionText] = useState('');
  const [editItem, setEditItem] = useState(null); // { oldText: '', newText: '' }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = () => {
    const data = optionsService.getAllOptions();
    setCategories(data);
  };

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    const success = optionsService.addOption(activeTab, newOptionText);
    if (success) {
      loadOptions();
      setNewOptionText('');
      showNotification(`Opsi "${newOptionText.trim()}" berhasil ditambahkan ke ${categories[activeTab]?.label}.`);
    } else {
      alert('Opsi tersebut sudah ada atau tidak valid.');
    }
  };

  const handleConfirmEdit = () => {
    if (!editItem || !editItem.newText.trim()) return;
    const success = optionsService.updateOption(activeTab, editItem.oldText, editItem.newText);
    if (success) {
      loadOptions();
      showNotification(`Opsi berhasil diperbarui menjadi "${editItem.newText.trim()}".`);
      setEditItem(null);
    } else {
      alert('Gagal memperbarui opsi.');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    optionsService.deleteOption(activeTab, deleteTarget);
    loadOptions();
    showNotification(`Opsi "${deleteTarget}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua pilihan dropdown ke pengaturan bawaan SMK Negeri 1 Cirebon?')) {
      optionsService.resetToDefault();
      loadOptions();
      showNotification('Semua opsi dropdown berhasil dikembalikan ke default SMKN 1 Cirebon.');
    }
  };

  const currentCategory = categories[activeTab] || { label: '', description: '', options: [] };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button 
            onClick={() => setToastMsg('')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-blue-600" />
            <span>Kelola Master Pilihan Dropdown</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ubah, tambah, atau hapus semua pilihan isian form tracer study untuk SMK Negeri 1 Cirebon.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs w-fit"
          title="Reset semua dropdown ke opsi standar sekolah"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset ke Default SMKN 1 Cirebon</span>
        </button>
      </div>

      {/* Tab Navigation for Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 scrollbar-none">
        {Object.entries(categories).map(([key, item]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}
              `}
            >
              <span>{item.label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.options?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {currentCategory.label}
            </h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Total {currentCategory.options?.length || 0} Pilihan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentCategory.description}
          </p>
        </div>

        {/* Form Tambah Opsi */}
        <form onSubmit={handleAddOption} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            placeholder={`Ketik nama pilihan ${currentCategory.label} baru...`}
            className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pilihan</span>
          </button>
        </form>

        {/* List of Options */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Opsi Aktif Saat Ini
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentCategory.options?.map((opt, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {opt}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditItem({ oldText: opt, newText: opt })}
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Ubah teks opsi"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(opt)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus opsi ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Option Modal */}
      <Modal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        title={`Edit Pilihan: ${currentCategory.label}`}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setEditItem(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmEdit}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Simpan Perubahan
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Nama Opsi
          </label>
          <input
            type="text"
            value={editItem?.newText || ''}
            onChange={(e) => setEditItem(prev => ({ ...prev, newText: e.target.value }))}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            placeholder="Masukkan teks opsi baru"
            autoFocus
          />
          <p className="text-[11px] text-slate-400">
            Perubahan nama opsi ini akan langsung berlaku pada seluruh form entri dan filter.
          </p>
        </div>
      </Modal>

      {/* Delete Option Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Pilihan Dropdown"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              Ya, Hapus Opsi
            </button>
          </>
        }
      >
        <div className="space-y-2 text-center py-2">
          <p className="text-sm text-slate-700 font-medium">
            Hapus opsi "<strong>{deleteTarget}</strong>" dari kategori {currentCategory.label}?
          </p>
          <p className="text-xs text-slate-400">
            Pilihan ini tidak akan muncul lagi di dropdown formulir baru.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default MasterOptions;
