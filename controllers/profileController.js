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
    console.log(`QR code requested for profile ${id}`);

    // Set a timeout for the request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 15000);
    });

    // Get QR code with timeout
    const resultPromise = Profile.getQRCode(id);

    let result;
    try {
      result = await Promise.race([resultPromise, timeoutPromise]);
    } catch (error) {
      console.error(`Timeout getting QR code for profile ${id}:`, error.message);
      return res.status(408).json({ success: false, message: 'Request timeout. QR code generation is taking too long.' });
    }

    if (!result.success) {
      console.log(`Failed to get QR code for profile ${id}: ${result.message}`);
      return res.status(400).json(result);
    }

    console.log(`Successfully retrieved QR code for profile ${id}`);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error getting QR code for profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout a profile from WhatsApp
const logoutProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Logout requested for profile ${id}`);

    const result = await Profile.logout(id);

    if (!result.success) {
      console.log(`Failed to logout profile ${id}: ${result.message}`);
      return res.status(400).json(result);
    }

    console.log(`Successfully logged out profile ${id}`);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error logging out profile ${req.params.id}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  getQRCode,
  logoutProfile
};
