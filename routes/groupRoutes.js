const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const groupController = require('../controllers/groupController');
const { authenticateToken } = require('../middlewares/auth');
const { validateSendGroupMessage } = require('../middlewares/validation');

// Send a group message
router.post('/send', authenticateToken, validateSendGroupMessage, messageController.sendGroupMessage);
router.get('/send', authenticateToken, validateSendGroupMessage, messageController.sendGroupMessage);

// Get all groups for a profile
router.get('/', authenticateToken, groupController.getAllGroups);

module.exports = router;
