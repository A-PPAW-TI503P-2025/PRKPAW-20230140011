const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// UBAH DISINI: Ganti 'addUserData' dengan 'authenticateToken'
const { authenticateToken, isAdmin } = require('../middleware/permissionmiddleware');

// Terapkan 'authenticateToken' dulu baru 'isAdmin'
router.get('/daily', [authenticateToken, isAdmin], reportController.getDailyReport);

module.exports = router;