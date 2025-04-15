# WhatsApp API

A WhatsApp API built using whatsapp-web.js with multi-profile support, message sending, contact management, and more.

## Features

- **Private Message Endpoints**: Send messages to WhatsApp contacts
- **Group Message Endpoints**: Send messages to WhatsApp groups
- **Contact Management**: Get all contacts for a profile
- **Group Management**: Get all groups for a profile
- **Multi-Profile Support**: Create and manage multiple WhatsApp profiles
- **Webhook Configuration**: Forward incoming messages to a webhook URL
- **Authentication**: Bearer token authentication for API endpoints
- **Docker Configuration**: Run the application with Docker and Docker Compose

## Prerequisites

- Node.js 16+
- MySQL 8.0+
- Docker and Docker Compose (optional)

## Installation

### Without Docker

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whatsapp-api.git
   cd whatsapp-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=whatzup
   DB_PORT=3306

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # WhatsApp Configuration
   WA_SESSION_PATH=./sessions
   ```

4. Create the database:
   ```
   CREATE DATABASE whatzup;
   ```

5. Start the application:
   ```
   npm start
   ```

### With Docker

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whatsapp-api.git
   cd whatsapp-api
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up -d
   ```

## API Endpoints

### Profiles

- `POST /api/profiles`: Create a new profile
- `GET /api/profiles`: Get all profiles
- `GET /api/profiles/:id`: Get a profile by ID
- `PUT /api/profiles/:id`: Update a profile
- `DELETE /api/profiles/:id`: Delete a profile
- `GET /api/profiles/:id/qrcode`: Get QR code for a profile

### Messages

- `POST /api/message/send`: Send a private message
- `GET /api/message/send`: Send a private message
- `POST /api/group/send`: Send a group message
- `GET /api/group/send`: Send a group message

### Contacts

- `GET /api/contacts`: Get all contacts for a profile

### Groups

- `GET /api/groups`: Get all groups for a profile

## Authentication

The API uses bearer token authentication. When creating a profile, a token is generated and returned in the response. This token should be included in the `Authorization` header of subsequent requests:

```
Authorization: Bearer your_token_here
```

## Webhook Configuration

You can configure a webhook URL for each profile to receive incoming messages. When a message is received, it will be forwarded to the webhook URL with the following format:

```json
{
  "profileId": 1,
  "from": "1234567890@c.us",
  "to": "9876543210@c.us",
  "message": "Hello!",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Postman Collection

A Postman collection is included in the repository. Import the `WhatsApp_API.postman_collection.json` file into Postman to get started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
