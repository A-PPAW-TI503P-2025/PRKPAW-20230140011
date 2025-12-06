import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Webcam
import Webcam from 'react-webcam';

// Peta
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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

  // Lokasi
  const [coords, setCoords] = useState(null);

  // Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    setImage(img);
  }, [webcamRef]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => setError("Gagal mendapatkan lokasi. Aktifkan GPS.")
    );
  }, []);

  const getToken = () => localStorage.getItem('token');

  const handleSessionError = (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("token");
      alert("Sesi habis. Silakan login ulang.");
      navigate("/login");
      return true;
    }
    return false;
  };

  // === CHECK-IN DENGAN FOTO ===
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum ditemukan.");
      return;
    }

    if (!image) {
      setError("Foto wajib diambil sebelum check-in!");
      return;
    }

    setLoading(true);

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();

      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      if (!handleSessionError(err)) {
        setError(err.response?.data?.message || "Gagal check-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  // === CHECK-OUT ===
  const handleCheckOut = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      if (!handleSessionError(err)) {
        setError(err.response?.data?.message || "Gagal check-out.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-blue-200 to-blue-400 flex flex-col items-center justify-center p-4">

      <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-blue-300 w-full max-w-lg">

        <h2 className="text-3xl font-bold text-blue-700 text-center mb-3">Form Presensi</h2>

        <p className="text-center bg-gray-100 border px-6 py-2 rounded-lg font-mono mb-4">
          {time.toLocaleTimeString("id-ID")} WIB
        </p>

        {/* === PETA === */}
        {coords ? (
          <div className="mb-6 h-64 rounded-xl overflow-hidden border shadow z-0 relative">
            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Posisi Kamu</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="h-64 bg-gray-200 rounded-xl mb-6 flex items-center justify-center">
            Mencari lokasi GPS...
          </div>
        )}

        {/* === WEBCAM === */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        {/* Tombol Foto */}
        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-xl"
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {/* FEEDBACK */}
        {message && <div className="p-3 bg-green-100 text-green-700 rounded mb-3">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-3">{error}</div>}

        {/* Tombol Aksi */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            {loading ? "Memproses..." : "Check-In (Masuk)"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            {loading ? "Memproses..." : "Check-Out (Pulang)"}
          </button>
        </div>

      </div>

    </div>
  );
}

export default PresensiPage;
