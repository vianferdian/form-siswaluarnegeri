import React, { useState } from 'react';
import { Menu, Share2, Copy, Check, ExternalLink, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { api } from '../services/api';
import Modal from './Modal';

const Navbar = ({ onOpenSidebar, pageTitle = "Dashboard Monitoring" }) => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const tracerUrl = `${window.location.origin}/`;

  const waTemplate = `Halo rekan alumni SMK Negeri 1 Cirebon! 👋
Pihak SMK Negeri 1 Cirebon sedang melakukan pemetaan dan pendataan bagi rekan-rekan alumni yang saat ini sedang bekerja, magang, studi, atau mengikuti program di Luar Negeri.

Mohon kesediaannya untuk mengisi formulir pendataan mandiri melalui tautan resmi berikut:
👉 ${tracerUrl}

Pengisian sangat singkat (tanpa upload dokumen/foto) dan data Anda sangat bermanfaat bagi pengembangan sekolah serta jejaring alumni global SMKN 1 Cirebon. Terima kasih! 🙏`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tracerUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(waTemplate);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset database ke data dummy awal SMK Negeri 1 Cirebon?')) {
      api.resetDatabase();
      window.location.reload();
    }
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {pageTitle}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {currentDate} • SMK Negeri 1 Cirebon
            </p>
          </div>
        </div>

        {/* Right side actions - Clean & Focused */}
        <div className="flex items-center gap-3">
          {/* Share Tracer Form Link Button */}
          <button
            onClick={() => setShowShareModal(true)}
            title="Bagikan formulir tracer kepada alumni"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Bagikan Link ke Alumni</span>
          </button>

          {/* Status / Role pill */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
              <span className="text-[11px] font-medium text-blue-600">{role}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs ring-2 ring-blue-50">
              {role === 'Admin' ? 'AD' : 'OP'}
            </div>
          </div>
        </div>
      </header>

      {/* Modal Bagikan Link ke Alumni */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Bagikan Tautan Formulir Alumni SMK Negeri 1 Cirebon"
        maxWidth="max-w-lg"
        footer={
          <button
            onClick={() => setShowShareModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Tutup
          </button>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600">
            Alumni SMK Negeri 1 Cirebon dapat langsung mengisi data mereka secara mandiri tanpa perlu upload foto atau dokumen apapun.
          </p>

          {/* Tautan Langsung */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Tautan Formulir Publik:</label>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="text"
                readOnly
                value={tracerUrl}
                className="w-full bg-transparent text-blue-600 font-mono text-xs focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 shrink-0 flex items-center gap-1 shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin'}</span>
              </button>
              <a
                href="/tracer"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white shrink-0"
                title="Buka form di tab baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Template Broadcast WhatsApp */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Template Siaran WhatsApp Alumni SMKN 1 Cirebon:</span>
              </label>
              <button
                onClick={handleCopyMessage}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                {copiedMsg ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMsg ? 'Teks Tersalin!' : 'Salin Teks Broadcast'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={7}
              value={waTemplate}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
