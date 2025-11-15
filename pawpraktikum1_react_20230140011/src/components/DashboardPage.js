import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">

      {/* Awan */}
      <div className="absolute top-10 left-14 text-6xl opacity-40">☁️</div>
      <div className="absolute top-32 right-16 text-7xl opacity-50">☁️</div>
      <div className="absolute bottom-20 left-1/3 text-6xl opacity-40">☁️</div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-green-300 text-center">
        <h1 className="text-4xl font-extrabold text-green-600 drop-shadow mb-4">
          Selamat Datang!
        </h1>

        <p className="text-lg text-gray-700 font-semibold mb-6">
          Kamu berhasil login ke Dashboard
        </p>

        <button
          onClick={handleLogout}
          className="py-3 px-6 bg-red-400 hover:bg-red-500 text-white font-bold rounded-xl shadow-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
