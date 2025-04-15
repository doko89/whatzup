const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middlewares/auth');
const { validateSendPrivateMessage, validateSendGroupMessage } = require('../middlewares/validation');

// Send a private message
router.post('/send', authenticateToken, validateSendPrivateMessage, messageController.sendPrivateMessage);
router.get('/send', authenticateToken, validateSendPrivateMessage, messageController.sendPrivateMessage);

module.exports = router;
