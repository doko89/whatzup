const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middlewares/auth');

// Get all contacts for a profile
router.get('/', authenticateToken, contactController.getAllContacts);

module.exports = router;
