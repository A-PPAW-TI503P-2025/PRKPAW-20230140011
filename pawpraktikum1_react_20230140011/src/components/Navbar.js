import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mengecek kita sedang di halaman mana

  // Cek token setiap kali navbar dimuat atau lokasi berubah
  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
  }, [location]); // Re-run saat pindah halaman

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Jangan tampilkan Navbar di halaman Login atau Register agar desain full screen
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null; 
  }

  return (
    <nav className="bg-white shadow-lg border-b-4 border-blue-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl mr-2">☁️</span>
              <span className="font-extrabold text-2xl text-blue-600 tracking-tight">
                SiPresensi
              </span>
            </Link>
            
            {/* Menu Links (Desktop) */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {/* Menu Check-In (Semua User) */}
              <Link 
                to="/presensi" 
                className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-md font-bold transition"
              >
                Absen
              </Link>

              {/* Menu Dashboard */}
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-md font-bold transition"
              >
                Dashboard
              </Link>

              {/* Menu Admin (Hanya Admin) */}
              {user && user.role === 'admin' && (
                <Link 
                  to="/admin/report" 
                  className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 px-3 py-2 rounded-md font-bold transition"
                >
                  Laporan Admin
                </Link>
              )}
            </div>
          </div>

          {/* Bagian Kanan (User Profile & Logout) */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{user.nama}</p>
                  <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-md transition transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl shadow-md transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;