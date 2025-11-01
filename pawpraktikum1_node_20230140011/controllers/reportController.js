const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { date, nama } = req.query;

    // Validasi format tanggal
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({
        message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
      });
    }

    // Tentukan rentang waktu (misal seluruh hari yang sama)
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    let options = {
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    };

    // Jika ada filter nama
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: date,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan harian",
      error: error.message,
    });
  }
};
