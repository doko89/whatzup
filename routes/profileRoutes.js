const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middlewares/auth');
const { validateCreateProfile, validateUpdateProfile } = require('../middlewares/validation');

// Create a new profile
router.post('/', validateCreateProfile, profileController.createProfile);

// Get all profiles
router.get('/', authenticateToken, profileController.getAllProfiles);

// Get a profile by ID
router.get('/:id', authenticateToken, profileController.getProfileById);

// Update a profile
router.put('/:id', authenticateToken, validateUpdateProfile, profileController.updateProfile);

// Delete a profile
router.delete('/:id', authenticateToken, profileController.deleteProfile);

// Get QR code for a profile
router.get('/:id/qrcode', authenticateToken, profileController.getQRCode);

// Logout a profile from WhatsApp
router.post('/:id/logout', authenticateToken, profileController.logoutProfile);

module.exports = router;
