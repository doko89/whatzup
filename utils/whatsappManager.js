const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Create sessions directory if it doesn't exist
const sessionsDir = path.join(process.cwd(), process.env.WA_SESSION_PATH || './sessions');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

class WhatsAppManager {
  constructor() {
    this.clients = new Map(); // Map to store WhatsApp clients by profileId
    this.qrCodes = new Map(); // Map to store QR codes by profileId
  }

  // Initialize a WhatsApp client for a profile
  async initClient(profileId, webhookUrl = null, enableWebhook = false) {
    try {
      // Check if client already exists
      if (this.clients.has(profileId)) {
        console.log(`Client for profile ${profileId} already exists`);
        return { success: true, message: 'Client already initialized' };
      }

      // Create a new client with session data stored in profile-specific directory
      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: `profile_${profileId}`,
          dataPath: sessionsDir
        }),
        puppeteer: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      // Store QR code when generated
      client.on('qr', (qr) => {
        this.qrCodes.set(profileId, qr);
        console.log(`QR Code received for profile ${profileId}`);
        // Generate QR code in terminal for debugging
        qrcode.generate(qr, { small: true });
        console.log(`QR Code stored for profile ${profileId}: ${qr.substring(0, 20)}...`);
      });

      // Handle client ready event
      client.on('ready', () => {
        console.log(`WhatsApp client ready for profile ${profileId}`);
        // Clear QR code when client is ready
        this.qrCodes.delete(profileId);
      });

      // Handle incoming messages if webhook is enabled
      if (enableWebhook && webhookUrl) {
        client.on('message', async (message) => {
          try {
            const messageData = {
              profileId,
              from: message.from,
              to: message.to,
              message: message.body,
              timestamp: new Date().toISOString()
            };

            // Forward message to webhook URL
            await axios.post(webhookUrl, messageData);
            console.log(`Message forwarded to webhook for profile ${profileId}`);
          } catch (error) {
            console.error(`Error forwarding message to webhook for profile ${profileId}:`, error.message);
          }
        });
      }

      // Initialize the client
      await client.initialize();

      // Store the client in the map
      this.clients.set(profileId, client);

      return { success: true, message: 'Client initialized successfully' };
    } catch (error) {
      console.error(`Error initializing WhatsApp client for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }

  // Get a client by profile ID
  getClient(profileId) {
    return this.clients.get(profileId);
  }

  // Get QR code for a profile
  getQRCode(profileId) {
    return this.qrCodes.get(profileId);
  }

  // Check if a client is authenticated
  isAuthenticated(profileId) {
    const client = this.clients.get(profileId);
    // A client is authenticated if it exists, has info property, and no QR code is pending
    return client && client.info && !this.qrCodes.has(profileId);
  }

  // Destroy a client
  async destroyClient(profileId) {
    try {
      const client = this.clients.get(profileId);
      if (client) {
        await client.destroy();
        this.clients.delete(profileId);
        this.qrCodes.delete(profileId);
        return { success: true, message: 'Client destroyed successfully' };
      }
      return { success: false, message: 'Client not found' };
    } catch (error) {
      console.error(`Error destroying WhatsApp client for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }

  // Update webhook configuration for a client
  updateWebhook(profileId, webhookUrl, enableWebhook) {
    try {
      const client = this.clients.get(profileId);
      if (!client) {
        return { success: false, message: 'Client not found' };
      }

      // Remove existing message listener
      client.removeAllListeners('message');

      // Add new message listener if webhook is enabled
      if (enableWebhook && webhookUrl) {
        client.on('message', async (message) => {
          try {
            const messageData = {
              profileId,
              from: message.from,
              to: message.to,
              message: message.body,
              timestamp: new Date().toISOString()
            };

            // Forward message to webhook URL
            await axios.post(webhookUrl, messageData);
            console.log(`Message forwarded to webhook for profile ${profileId}`);
          } catch (error) {
            console.error(`Error forwarding message to webhook for profile ${profileId}:`, error.message);
          }
        });
      }

      return { success: true, message: 'Webhook configuration updated successfully' };
    } catch (error) {
      console.error(`Error updating webhook for profile ${profileId}:`, error.message);
      return { success: false, message: error.message };
    }
  }
}

// Create a singleton instance
const whatsappManager = new WhatsAppManager();

module.exports = whatsappManager;
