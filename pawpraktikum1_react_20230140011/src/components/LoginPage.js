import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Perlu install: npm install jwt-decode

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelum request

    try {
      // 1. Request Login menggunakan Axios
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      // 2. Simpan Token
      const token = response.data.token;
      localStorage.setItem("token", token);

      // 3. Smart Redirect berdasarkan Role
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "admin") {
          navigate("/admin/report"); // Admin masuk ke laporan
        } else {
          navigate("/presensi"); // User biasa masuk ke check-in
        }
      } catch (e) {
        // Jika decode gagal, default ke presensi
        navigate("/presensi");
      }

    } catch (err) {
      // 4. Handle Error (Tampilkan pesan dari backend)
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Email atau password salah!";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">
      {/* Background Kartun */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Gunung/Awan */}
        <div className="absolute top-10 left-14 text-6xl opacity-40">☁️</div>
        <div className="absolute top-32 right-16 text-7xl opacity-50">☁️</div>
        <div className="absolute bottom-20 left-1/3 text-6xl opacity-40">☁️</div>
      </div>

      {/* Card Login */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-96 border-4 border-yellow-300 relative z-10">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
          Login !
        </h1>

        {/* Tampilkan Error Message di sini */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="font-semibold text-blue-800">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border-2 border-blue-300 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold text-blue-800">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border-2 border-blue-300 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Tombol login */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="text-center mt-5 text-blue-900 font-semibold">
          Belum punya akun?{" "}
          <Link to="/register" className="text-red-500 font-bold hover:underline">
            Register dulu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;