import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Import komponen Peta
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Icon Leaflet yang sering error di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const navigate = useNavigate();
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  // State untuk Lokasi
  const [coords, setCoords] = useState(null); // Format: { lat: -6.xxx, lng: 106.xxx }

  // 1. Efek Jam Digital
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Efek Ambil Lokasi (Geolocation) saat halaman dimuat
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.");
          console.error(err);
        }
      );
    } else {
      setError("Browser Anda tidak mendukung Geolocation.");
    }
  }, []);

  const getToken = () => localStorage.getItem('token');

  const handleSessionError = (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("token");
      alert("Sesi habis. Silakan login kembali.");
      navigate("/login");
      return true;
    }
    return false;
  };

  // === FUNGSI CHECK-IN ===
  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    // Validasi: Lokasi harus ada sebelum check-in
    if (!coords) {
        setError("Lokasi belum ditemukan. Tunggu sebentar atau refresh halaman.");
        setLoading(false);
        return;
    }

    try {
      const token = getToken();
      if (!token) { navigate("/login"); return; }

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
            // Kirim Lat & Long ke Backend
            latitude: coords.lat,
            longitude: coords.lng
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      if (!handleSessionError(err)) {
        setError(err.response?.data?.message || "Gagal Check-In.");
      }
    } finally {
      setLoading(false);
    }
  };

  // === FUNGSI CHECK-OUT ===
  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = getToken();
      if (!token) { navigate("/login"); return; }

      // Check-out biasanya tidak wajib kirim lokasi, tapi kalau mau dikirim juga boleh
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      if (!handleSessionError(err)) {
        setError(err.response?.data?.message || "Gagal Check-Out.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center justify-center relative overflow-hidden p-4">
      
      {/* Dekorasi Awan */}
      <div className="absolute top-10 left-10 text-6xl opacity-50 select-none">☁️</div>
      <div className="absolute top-24 right-20 text-7xl opacity-40 select-none">☁️</div>

      <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-blue-300 w-full max-w-lg text-center z-10">
        
        <h2 className="text-3xl font-extrabold mb-2 text-blue-700">Form Presensi</h2>
        
        <p className="text-gray-500 mb-4 font-mono text-lg bg-gray-100 py-2 rounded-lg inline-block px-6 border border-gray-200">
          {time.toLocaleTimeString("id-ID")} WIB
        </p>

        {/* === VISUALISASI PETA === */}
        {coords ? (
            <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner h-64 w-full relative z-0">
                <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Posisi Kamu Saat Ini</Popup>
                    </Marker>
                </MapContainer>
            </div>
        ) : (
            <div className="mb-6 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 animate-pulse">
                Sedang mencari lokasi GPS... 🛰️
            </div>
        )}

        {/* Feedback Messages */}
        {message && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded text-sm font-bold">{message}</div>}
        {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm font-bold">{error}</div>}

        {/* Tombol Aksi */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCheckIn}
            disabled={loading || !coords}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg text-lg transition
              ${loading || !coords ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
            `}
          >
            {loading ? "Memproses..." : "Check-In (Masuk)"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg text-lg transition
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
            `}
          >
            {loading ? "Memproses..." : "Check-Out (Pulang)"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;