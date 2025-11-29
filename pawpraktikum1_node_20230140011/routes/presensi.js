const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionmiddleware');

// Terapkan middleware auth ke semua route di bawah ini
router.use(authenticateToken);

// Definisi Route
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put('/:id', presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;