import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Pastikan install jwt-decode

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: "User", role: "" });

  useEffect(() => {
    // Ambil data user dari token saat halaman dimuat
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        // Jika token error, lempar ke login
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">

      {/* Awan Dekorasi */}
      <div className="absolute top-10 left-14 text-6xl opacity-40 select-none">☁️</div>
      <div className="absolute top-32 right-16 text-7xl opacity-50 select-none">☁️</div>
      <div className="absolute bottom-20 left-1/3 text-6xl opacity-40 select-none">☁️</div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-green-300 text-center w-full max-w-lg z-10">
        <h1 className="text-4xl font-extrabold text-green-600 drop-shadow mb-2">
          Halo, {user.nama}! 👋
        </h1>

        <p className="text-lg text-gray-600 font-medium mb-8">
          Selamat datang di Sistem Presensi.
          <br />
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full mt-2 inline-block uppercase">
            Role: {user.role}
          </span>
        </p>

        {/* Menu Pilihan */}
        <div className="grid gap-4 mb-6">
          <button
            onClick={() => navigate("/presensi")}
            className="py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition transform hover:scale-105"
          >
            📋 Ke Halaman Absen
          </button>

          {/* Menu Khusus Admin */}
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin/report")}
              className="py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-xl shadow-md transition transform hover:scale-105"
            >
              📊 Lihat Laporan Admin
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
            <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-400 hover:bg-red-500 text-white font-bold rounded-xl shadow-sm text-sm"
            >
            Keluar (Logout)
            </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;