const Profile = require('../models/profile');
const { validationResult } = require('express-validator');

// Create a new profile
const createProfile = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { name, webhookUrl, enableWebhook } = req.body;
    
    // Create profile
    const result = await Profile.create(name, webhookUrl, enableWebhook);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating profile:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    const result = await Profile.getAll();
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting profiles:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get a profile by ID
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Profile.getById(id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error getting profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a profile
const updateProfile = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, webhookUrl, enableWebhook } = req.body;
    
    const result = await Profile.update(id, name, webhookUrl, enableWebhook);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error updating profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete a profile
const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Profile.delete(id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error deleting profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get QR code for a profile
const getQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Profile.getQRCode(id);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error getting QR code for profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  getQRCode
};
