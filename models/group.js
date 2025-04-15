const whatsappManager = require('../utils/whatsappManager');

class Group {
  // Get all groups for a profile
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

      console.log(`Getting groups for profile ${profileId}...`);
      // Get all chats
      const chats = await client.getChats();

      // Filter groups
      const groups = chats.filter(chat => chat.isGroup);
      console.log(`Retrieved ${groups.length} groups for profile ${profileId}`);

      // Format groups
      const formattedGroups = groups.map(group => ({
        id: group.id._serialized,
        name: group.name,
        participants: group.participants ? group.participants.length : 0,
        isGroup: true
      }));

      return {
        success: true,
        data: formattedGroups
      };
    } catch (error) {
      console.error(`Error getting groups for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Group;
