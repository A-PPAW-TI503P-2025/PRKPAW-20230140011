import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Email atau password salah!");
      }
    } catch (error) {
      alert("Gagal menghubungkan ke server!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">
      {/* Background Kartun */}
      <div className="absolute inset-0 pointer-events-none select-none">

        {/* Gunung */}
        <div className="absolute top-10 left-14 text-6xl opacity-40">☁️</div>
        <div className="absolute top-32 right-16 text-7xl opacity-50">☁️</div>
        <div className="absolute bottom-20 left-1/3 text-6xl opacity-40">☁️</div>


      </div>

      {/* Card Login */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-96 border-4 border-yellow-300 relative z-10">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
          Login !
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="font-semibold text-blue-800">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border-2 border-blue-300 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 rounded-xl border-2 border-blue-300 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Tombol login */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition"
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
