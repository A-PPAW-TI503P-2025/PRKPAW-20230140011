const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = 3001;

// === 1. IMPORT MODELS (WAJIB) ===
const db = require("./models"); 

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');
const ruteBuku = require("./routes/books");
const path = require('path'); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Logger manual
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route Utama
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Pasang Routes
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === 2. SINKRONISASI DATABASE (WAJIB) ===
// Ini yang bikin tabel otomatis kalau belum ada
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database berhasil disinkronisasi!");
  })
  .catch((err) => {
    console.error("❌ Gagal sinkronisasi database:", err.message);
  });

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});