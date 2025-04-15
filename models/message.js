const whatsappManager = require('../utils/whatsappManager');

class Message {
  // Send a private message
  static async sendPrivate(profileId, phone, message) {
    try {
      // Get the WhatsApp client for the profile
      const client = whatsappManager.getClient(profileId);
      
      if (!client) {
        return { success: false, message: 'WhatsApp client not initialized' };
      }
      
      // Format the phone number
      let formattedPhone = phone;
      
      // Add '@c.us' suffix if not present
      if (!formattedPhone.endsWith('@c.us')) {
        // Remove any non-numeric characters
        formattedPhone = formattedPhone.replace(/\D/g, '');
        formattedPhone = `${formattedPhone}@c.us`;
      }
      
      // Send the message
      const result = await client.sendMessage(formattedPhone, message);
      
      return {
        success: true,
        message: 'Message sent successfully',
        data: {
          id: result.id.id,
          timestamp: result.timestamp
        }
      };
    } catch (error) {
      console.error(`Error sending private message for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }
  
  // Send a group message
  static async sendGroup(profileId, groupId, message) {
    try {
      // Get the WhatsApp client for the profile
      const client = whatsappManager.getClient(profileId);
      
      if (!client) {
        return { success: false, message: 'WhatsApp client not initialized' };
      }
      
      // Format the group ID
      let formattedGroupId = groupId;
      
      // Add '@g.us' suffix if not present
      if (!formattedGroupId.endsWith('@g.us')) {
        formattedGroupId = `${formattedGroupId}@g.us`;
      }
      
      // Send the message
      const result = await client.sendMessage(formattedGroupId, message);
      
      return {
        success: true,
        message: 'Group message sent successfully',
        data: {
          id: result.id.id,
          timestamp: result.timestamp
        }
      };
    } catch (error) {
      console.error(`Error sending group message for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }
}

module.exports = Message;
