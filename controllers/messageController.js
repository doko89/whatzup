const Message = require('../models/message');
const { validationResult } = require('express-validator');

// Send a private message
const sendPrivateMessage = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { profileId, phone, message } = req.body;
    
    // Send message
    const result = await Message.sendPrivate(profileId, phone, message);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error sending private message:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Send a group message
const sendGroupMessage = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { profileId, groupId, message } = req.body;
    
    // Send message
    const result = await Message.sendGroup(profileId, groupId, message);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error sending group message:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  sendPrivateMessage,
  sendGroupMessage
};
