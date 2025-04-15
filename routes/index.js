const express = require('express');
const router = express.Router();
const profileRoutes = require('./profileRoutes');
const messageRoutes = require('./messageRoutes');
const groupRoutes = require('./groupRoutes');
const contactRoutes = require('./contactRoutes');

// API routes
router.use('/api/profiles', profileRoutes);
router.use('/api/message', messageRoutes);
router.use('/api/groups', groupRoutes);
router.use('/api/contacts', contactRoutes);

// Root route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp API is running',
    version: '1.0.0'
  });
});

module.exports = router;
