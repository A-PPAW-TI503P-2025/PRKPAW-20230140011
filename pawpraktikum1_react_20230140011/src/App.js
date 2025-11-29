import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Pastikan install: npm install jwt-decode

// Import Components
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage'; // Jika masih dipakai
import PresensiPage from './components/PresensiPage';
import Navbar from './components/Navbar';
import ReportPage from './components/ReportPage';

// === 1. Komponen PrivateRoute ===
// (Mencegah user yang belum login masuk ke halaman presensi/dashboard)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect ke login jika tidak ada token
    return <Navigate to="/login" replace />;
  }
  return children;
};

// === 2. Komponen AdminRoute ===
// (Mencegah user biasa masuk ke halaman laporan admin)
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    // Cek apakah role di token adalah 'admin'
    if (decoded.role !== 'admin') {
      // Jika bukan admin, lempar balik ke halaman presensi
      return <Navigate to="/presensi" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <div>
        {/* Navbar akan otomatis mengecek login/logout */}
        <Navbar/> 

        <Routes>
          {/* === PUBLIC ROUTES (Bisa diakses siapa saja) === */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* === PRIVATE ROUTES (Harus Login) === */}
          {/* Halaman Check-in/Check-out */}
          <Route 
            path="/presensi" 
            element={
              <PrivateRoute>
                <PresensiPage />
              </PrivateRoute>
            } 
          />

          {/* Halaman Dashboard (Opsional, jika masih dipakai) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />

          {/* === ADMIN ROUTES (Harus Login + Role Admin) === */}
          {/* Path disesuaikan dengan link di Navbar (/admin/report) */}
          <Route 
            path="/admin/report" 
            element={
              <AdminRoute>
                <ReportPage />
              </AdminRoute>
            } 
          />

          {/* === DEFAULT ROUTE === */}
          {/* Jika buka root '/', arahkan ke /presensi jika sudah login, atau login jika belum */}
          <Route path="/" element={<Navigate to="/presensi" replace />} />
          
          {/* Tangani 404 Not Found */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;