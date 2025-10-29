const { Presensi } = require('../models');

exports.getDailyReport = async (req, res) => {
  try {
    
    console.log("Controller: Mengambil data laporan harian dari DATABASE...");
    
    const presensiRecords = await Presensi.findAll();
    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: presensiRecords, 
    });

  } catch (error) {
    console.error("Error saat mengambil laporan harian:", error);
    res.status(500).json({
      message: "Gagal mengambil data dari server.",
      error: error.message
    });
  }
};