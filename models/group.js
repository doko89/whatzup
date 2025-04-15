const whatsappManager = require('../utils/whatsappManager');

class Group {
  // Get all groups for a profile
  static async getAll(profileId) {
    try {
      // Get the WhatsApp client for the profile
      const client = whatsappManager.getClient(profileId);
      
      if (!client) {
        return { success: false, message: 'WhatsApp client not initialized' };
      }
      
      // Get all chats
      const chats = await client.getChats();
      
      // Filter groups
      const groups = chats.filter(chat => chat.isGroup);
      
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
