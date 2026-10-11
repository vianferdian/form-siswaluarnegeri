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
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/dashboard')) return 'Dashboard Monitoring';
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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/alumni/add" element={<AddAlumni />} />
            <Route path="/alumni/edit/:id" element={<AddAlumni />} />
            <Route path="/alumni/detail/:id" element={<DetailAlumni />} />
            <Route path="/report" element={<Report />} />
            <Route path="/master-options" element={<MasterOptions />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Tracer Study Form Routes for Alumni (No Login Required) */}
      <Route path="/tracer" element={<PublicForm />} />
      <Route path="/formulir" element={<PublicForm />} />
      <Route path="/formulir-alumni" element={<PublicForm />} />

      {/* Admin / Operator Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected School Portal Layout */}
      <Route 
        path="/*" 
        element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

