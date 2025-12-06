import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getToken = () => localStorage.getItem('token');

  const fetchReports = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { nama: searchTerm, startDate: startDate, endDate: endDate }
      };

      const response = await axios.get("http://localhost:3001/api/reports/daily", config);
      setReports(Array.isArray(response.data) ? response.data : response.data.data || []);
      
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Akses ditolak: Anda bukan Admin.");
      } else {
        setError(err.response?.data?.message || "Gagal memuat laporan.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, searchTerm, startDate, endDate]);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto p-8"> {/* Lebarkan container max-w-7xl */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Presensi (Lokasi)</h1>

      {/* Form Filter (Tetap Sama) */}
      <form onSubmit={handleSearchSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
            <input type="text" placeholder="Nama karyawan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="mt-4 text-right">
            <button type="submit" disabled={loading} className="py-2 px-6 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700">
              {loading ? "Memuat..." : "Terapkan Filter"}
            </button>
        </div>
      </form>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">{error}</div>}

      {/* Tabel Data Update dengan Lokasi */}
      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto"> {/* Tambah overflow-x-auto biar bisa scroll samping */}
          <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Masuk</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi (Lat, Lng)</th>
      
      {/* ➕ FOTO PRESENSI */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Foto</th>

      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Keluar</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    </tr>
  </thead>
  
  <tbody className="bg-white divide-y divide-gray-200">
    {reports.map((presensi) => (
      <tr key={presensi.id} className="hover:bg-gray-50">

        {/* Nama */}
        <td className="px-6 py-4 text-sm font-medium text-gray-900">
          {presensi.user ? presensi.user.nama : "User Terhapus"}
        </td>

        {/* Waktu Masuk */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(presensi.checkIn).toLocaleString("id-ID")}
        </td>

        {/* Lokasi */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {presensi.latitude && presensi.longitude ? (
            <a 
              href={`https://www.google.com/maps?q=${presensi.latitude},${presensi.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {presensi.latitude}, {presensi.longitude} ↗
            </a>
          ) : (
            "-"
          )}
        </td>

        {/* FOTO PRESENSI */}
        {/* --- KODE BARU (Menggunakan buktiFoto) --- */}
<td className="px-6 py-4 text-sm text-gray-500">
  {presensi.buktiFoto ? (
    <a 
      // GANTI imageUrl JADI buktiFoto
      // Logika: Tambahkan http://localhost:3001/ di depannya
      href={`http://localhost:3001/${presensi.buktiFoto.replace(/\\/g, "/")}`} 
      target="_blank" 
      rel="noreferrer"
    >
      <img 
        // GANTI imageUrl JADI buktiFoto
        src={`http://localhost:3001/${presensi.buktiFoto.replace(/\\/g, "/")}`} 
        alt="Foto Presensi"
        className="w-12 h-12 rounded-md object-cover border"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = "https://via.placeholder.com/150?text=No+Img"; 
        }}
      />
    </a>
  ) : (
    <span className="text-gray-400">Tidak ada foto</span>
  )}
</td>

        {/* Waktu Keluar */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {presensi.checkOut ? new Date(presensi.checkOut).toLocaleString("id-ID") : "-"}
        </td>

        {/* Status */}
        <td className="px-6 py-4 text-sm">
          {presensi.checkOut ? (
            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Selesai
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Aktif
            </span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
}

export default ReportPage;