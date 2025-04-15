const whatsappManager = require('../utils/whatsappManager');

class Contact {
  // Get all contacts for a profile
  static async getAll(profileId) {
    try {
      // Get the WhatsApp client for the profile
      const client = whatsappManager.getClient(profileId);
      
      if (!client) {
        return { success: false, message: 'WhatsApp client not initialized' };
      }
      
      // Get all contacts
      const contacts = await client.getContacts();
      
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
