const whatsappManager = require('../utils/whatsappManager');

class Contact {
  // Get all contacts for a profile
  static async getAll(profileId) {
    try {
      // Get the WhatsApp client for the profile
      let client = whatsappManager.getClient(profileId);

      if (!client) {
        console.log(`Client not initialized for profile ${profileId}, attempting to initialize...`);

        // Get profile data from database to initialize client
        const { pool } = require('../config/database');
        const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ?', [profileId]);

        if (profiles.length === 0) {
          return { success: false, message: 'Profile not found' };
        }

        // Initialize the client
        const initResult = await whatsappManager.initClient(
          profileId,
          profiles[0].webhook_url,
          profiles[0].enable_webhook
        );

        if (!initResult.success) {
          return { success: false, message: `Failed to initialize WhatsApp client: ${initResult.message}` };
        }

        // Check if client is authenticated
        if (!whatsappManager.isAuthenticated(profileId)) {
          return { success: false, message: 'WhatsApp client not authenticated. Please scan the QR code first.' };
        }

        client = whatsappManager.getClient(profileId);
        if (!client) {
          return { success: false, message: 'Failed to get WhatsApp client after initialization' };
        }
      }

      // Check if client is authenticated
      if (!whatsappManager.isAuthenticated(profileId)) {
        return { success: false, message: 'WhatsApp client not authenticated. Please scan the QR code first.' };
      }

      console.log(`Getting contacts for profile ${profileId}...`);
      // Get all contacts
      const contacts = await client.getContacts();
      console.log(`Retrieved ${contacts.length} contacts for profile ${profileId}`);

      // Format contacts
      const formattedContacts = contacts.map(contact => ({
        id: contact.id._serialized,
        name: contact.name || contact.pushname || 'Unknown',
        number: contact.number,
        isGroup: contact.isGroup,
        isWAContact: contact.isWAContact
      }));

      return {
        success: true,
        data: formattedContacts
      };
    } catch (error) {
      console.error(`Error getting contacts for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Contact;
