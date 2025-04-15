const whatsappManager = require('../utils/whatsappManager');

class Group {
  // Get all groups for a profile
  static async getAll(profileId) {
    try {
      // Get the WhatsApp client for the profile
      let client = whatsappManager.getClient(profileId);

      // Get profile data from database
      const { pool } = require('../config/database');
      const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ?', [profileId]);

      if (profiles.length === 0) {
        return { success: false, message: 'Profile not found' };
      }

      // If client doesn't exist or is not authenticated, try to initialize it
      if (!client || !whatsappManager.isAuthenticated(profileId)) {
        console.log(`Client not initialized or not authenticated for profile ${profileId}`);

        // If there's an existing client but it's not authenticated, destroy it
        if (client) {
          console.log(`Destroying existing client for profile ${profileId}`);
          await whatsappManager.destroyClient(profileId);
        }

        // Check if there's a session file for this profile
        const fs = require('fs');
        const path = require('path');
        const sessionDir = path.join(process.cwd(), process.env.WA_SESSION_PATH || './sessions', `profile_${profileId}`);

        const hasSession = fs.existsSync(sessionDir);
        console.log(`Session directory for profile ${profileId} ${hasSession ? 'exists' : 'does not exist'}`);

        if (hasSession) {
          // Initialize the client with existing session
          console.log(`Initializing client for profile ${profileId} with existing session`);
          const initResult = await whatsappManager.initClient(
            profileId,
            profiles[0].webhook_url,
            profiles[0].enable_webhook
          );

          if (!initResult.success) {
            return { success: false, message: `Failed to initialize WhatsApp client: ${initResult.message}` };
          }

          // Wait a bit for client to be ready
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Check if client is authenticated after initialization
          if (!whatsappManager.isAuthenticated(profileId)) {
            return { success: false, message: 'WhatsApp client not authenticated. Please scan the QR code first.' };
          }

          client = whatsappManager.getClient(profileId);
        } else {
          return { success: false, message: 'WhatsApp client not authenticated. Please scan the QR code first.' };
        }
      }

      // At this point, we should have an authenticated client
      if (!client) {
        return { success: false, message: 'Failed to get WhatsApp client' };
      }

      console.log(`Getting groups for profile ${profileId}...`);

      // Get all chats with timeout
      const chatsPromise = client.getChats();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout getting chats')), 10000);
      });

      const chats = await Promise.race([chatsPromise, timeoutPromise]);

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
