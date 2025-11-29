import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Gunakan axios agar konsisten

function RegisterPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Gunakan URL lengkap backend (port 3001) & Axios
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        role,
        email,
        password,
      });

      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      // Tampilkan pesan error dari backend jika ada
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Gagal register! Coba lagi.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">

      {/* Awan kartun */}
      <div className="absolute top-10 left-10 text-6xl opacity-50">☁️</div>
      <div className="absolute top-24 right-20 text-6xl opacity-60">☁️</div>
      <div className="absolute bottom-16 left-1/4 text-5xl opacity-40">☁️</div>

      <div className="bg-white p-10 w-96 rounded-3xl shadow-2xl border-4 border-pink-300">
        <h1 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">
          Register
        </h1>

        {/* Menampilkan Error jika ada */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-semibold text-pink-700">Nama</label>
            <input
              type="text"
              className="w-full p-3 border-2 border-pink-300 rounded-xl mt-1 focus:outline-none focus:border-pink-500"
              placeholder="Masukkan nama..."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold text-pink-700">Email</label>
            <input
              type="email"
              className="w-full p-3 border-2 border-pink-300 rounded-xl mt-1 focus:outline-none focus:border-pink-500"
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold text-pink-700">Password</label>
            <input
              type="password"
              className="w-full p-3 border-2 border-pink-300 rounded-xl mt-1 focus:outline-none focus:border-pink-500"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold text-pink-700">Role</label>
            <select
              className="w-full p-3 border-2 border-pink-300 rounded-xl mt-1 focus:outline-none focus:border-pink-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-bold rounded-xl transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-pink-700 font-semibold">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-700 font-bold underline hover:text-blue-900">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;