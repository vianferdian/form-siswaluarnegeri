import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../pages/Dashboard';
import Alumni from '../pages/Alumni';
import AddAlumni from '../pages/AddAlumni';
import DetailAlumni from '../pages/DetailAlumni';
import Report from '../pages/Report';
import MasterOptions from '../pages/MasterOptions';
import Login from '../pages/Login';
import PublicForm from '../pages/PublicForm';
import { useAuth } from '../store/authStore';

// Main Protected Layout with modern Sidebar & Navbar
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Monitoring';
    if (path === '/alumni') return 'Data Alumni Internasional';
    if (path === '/alumni/add') return 'Tambah Alumni Baru';
    if (path.startsWith('/alumni/edit')) return 'Edit Data Alumni';
    if (path.startsWith('/alumni/detail')) return 'Detail Profil Alumni';
    if (path === '/report') return 'Laporan & Rekapitulasi';
    if (path === '/master-options') return 'Kelola Master Dropdown';
    return 'SMK Negeri 1 Cirebon';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          onOpenSidebar={() => setSidebarOpen(true)} 
          pageTitle={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 1. Halaman Utama: Formulir Pendaftaran / Tracer Study Alumni */}
      <Route path="/" element={<PublicForm />} />
      <Route path="/tracer" element={<PublicForm />} />
      <Route path="/formulir" element={<PublicForm />} />
      <Route path="/formulir-alumni" element={<PublicForm />} />

      {/* 2. Login Admin & Petugas (Akses langsung via URL /admin) */}
      <Route 
        path="/admin" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />

      {/* 3. Panel Admin & Pengelola (Wajib Login, redirect ke /admin jika belum login) */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <MainLayout><Dashboard /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/alumni" 
        element={isAuthenticated ? <MainLayout><Alumni /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/alumni/add" 
        element={isAuthenticated ? <MainLayout><AddAlumni /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/alumni/edit/:id" 
        element={isAuthenticated ? <MainLayout><AddAlumni /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/alumni/detail/:id" 
        element={isAuthenticated ? <MainLayout><DetailAlumni /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/report" 
        element={isAuthenticated ? <MainLayout><Report /></MainLayout> : <Navigate to="/admin" replace />} 
      />
      <Route 
        path="/master-options" 
        element={isAuthenticated ? <MainLayout><MasterOptions /></MainLayout> : <Navigate to="/admin" replace />} 
      />

      {/* Catch-all: Arahkan ke formulir utama */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

