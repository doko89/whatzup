const Contact = require('../models/contact');

// Get all contacts for a profile
const getAllContacts = async (req, res) => {
  try {
    const { profileId } = req.query;
    
    if (!profileId) {
      return res.status(400).json({ success: false, message: 'Profile ID is required' });
    }
    
    const result = await Contact.getAll(profileId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting contacts:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllContacts
};
