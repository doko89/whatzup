const { pool } = require('../config/database');
const { generateToken } = require('../middlewares/auth');
const whatsappManager = require('../utils/whatsappManager');

class Profile {
  // Create a new profile
  static async create(name, webhookUrl = null, enableWebhook = false) {
    try {
      const token = generateToken(Date.now()); // Generate a unique token
      
      // Insert profile into database
      const [result] = await pool.query(
        'INSERT INTO profiles (name, token, webhook_url, enable_webhook) VALUES (?, ?, ?, ?)',
        [name, token, webhookUrl, enableWebhook]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, message: 'Failed to create profile' };
      }
      
      const profileId = result.insertId;
      
      // Initialize WhatsApp client for the profile
      await whatsappManager.initClient(profileId, webhookUrl, enableWebhook);
      
      return {
        success: true,
        message: 'Profile created successfully',
        data: {
          id: profileId,
          name,
          token,
          webhook_url: webhookUrl,
          enable_webhook: enableWebhook
        }
      };
    } catch (error) {
      console.error('Error creating profile:', error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Get all profiles
  static async getAll() {
    try {
      const [profiles] = await pool.query(
        'SELECT id, name, token, webhook_url, enable_webhook, created_at, updated_at FROM profiles'
      );
      
      return {
        success: true,
        data: profiles
      };
    } catch (error) {
      console.error('Error getting profiles:', error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Get a profile by ID
  static async getById(id) {
    try {
      const [profiles] = await pool.query(
        'SELECT id, name, token, webhook_url, enable_webhook, created_at, updated_at FROM profiles WHERE id = ?',
        [id]
      );
      
      if (profiles.length === 0) {
        return { success: false, message: 'Profile not found' };
      }
      
      return {
        success: true,
        data: profiles[0]
      };
    } catch (error) {
      console.error(`Error getting profile ${id}:`, error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Update a profile
  static async update(id, name, webhookUrl, enableWebhook) {
    try {
      // Update profile in database
      const [result] = await pool.query(
        'UPDATE profiles SET name = ?, webhook_url = ?, enable_webhook = ? WHERE id = ?',
        [name, webhookUrl, enableWebhook, id]
      );
      
      if (result.affectedRows === 0) {
        return { success: false, message: 'Profile not found' };
      }
      
      // Update webhook configuration for the WhatsApp client
      await whatsappManager.updateWebhook(id, webhookUrl, enableWebhook);
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error(`Error updating profile ${id}:`, error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Delete a profile
  static async delete(id) {
    try {
      // Destroy the WhatsApp client
      await whatsappManager.destroyClient(id);
      
      // Delete profile from database
      const [result] = await pool.query('DELETE FROM profiles WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return { success: false, message: 'Profile not found' };
      }
      
      return {
        success: true,
        message: 'Profile deleted successfully'
      };
    } catch (error) {
      console.error(`Error deleting profile ${id}:`, error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Get QR code for a profile
  static async getQRCode(id) {
    try {
      // Check if profile exists
      const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ?', [id]);
      
      if (profiles.length === 0) {
        return { success: false, message: 'Profile not found' };
      }
      
      // Get QR code from WhatsApp manager
      const qrCode = whatsappManager.getQRCode(id);
      
      if (!qrCode) {
        // If no QR code is available, check if client is authenticated
        if (whatsappManager.isAuthenticated(id)) {
          return { success: false, message: 'WhatsApp client is already authenticated' };
        }
        
        // If client is not initialized, initialize it
        if (!whatsappManager.getClient(id)) {
          await whatsappManager.initClient(
            id,
            profiles[0].webhook_url,
            profiles[0].enable_webhook
          );
          
          // Wait for QR code to be generated
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          const newQrCode = whatsappManager.getQRCode(id);
          
          if (!newQrCode) {
            return { success: false, message: 'Failed to generate QR code' };
          }
          
          return {
            success: true,
            data: { qrCode: newQrCode }
          };
        }
        
        return { success: false, message: 'QR code not available' };
      }
      
      return {
        success: true,
        data: { qrCode }
      };
    } catch (error) {
      console.error(`Error getting QR code for profile ${id}:`, error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Profile;
