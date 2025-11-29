const { Presensi, User } = require("../models"); // Tambahkan User
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    // Ambil parameter dari frontend (sesuai ReportPage.js)
    const { startDate, endDate, nama } = req.query;

    // 1. Siapkan Filter untuk Tabel Presensi (Filter Waktu)
    let whereClause = {};

    if (startDate && endDate) {
      // Jika ada Start dan End date
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date ke akhir hari (23:59:59) agar data hari itu ikut terambil
      end.setHours(23, 59, 59, 999);

      whereClause.checkIn = {
        [Op.between]: [start, end] // Gunakan Op.between
      };
    } else if (startDate) {
       // Jika hanya ada Start date
       const start = new Date(startDate);
       whereClause.checkIn = {
         [Op.gte]: start // Greater than or Equal
       };
    }

    // 2. Siapkan Filter untuk Tabel User (Filter Nama)
    let userWhereClause = {};
    if (nama) {
      // Mencari nama di tabel User menggunakan LIKE
      userWhereClause.nama = {
        [Op.like]: `%${nama}%`
      };
    }

    // 3. Eksekusi Query dengan Relation (Include)
    const records = await Presensi.findAll({
      where: whereClause, // Filter tanggal masuk sini
      include: [
        {
          model: User,
          as: 'user', // PENTING: Harus sama dengan alias di models/presensi.js
          where: userWhereClause, // Filter nama masuk sini
          attributes: ['nama', 'email'] // Ambil kolom yang perlu saja
        }
      ],
      order: [['checkIn', 'DESC']] // Urutkan dari yang terbaru
    });

    res.json({
      message: "Data laporan berhasil diambil",
      count: records.length,
      data: records, // Frontend mengharapkan array ini
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil laporan harian",
      error: error.message,
    });
  }
};