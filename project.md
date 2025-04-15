Create a WhatsApp API using whatsapp-web.js with the following specifications:

Required Features:
1. Private Message Endpoints
   - GET /api/message/send
   - POST /api/message/send
   Body: { profileId, phone, message }

2. Group Message Endpoints
   - GET /api/group/send
   - POST /api/group/send
   Body: { profileId, groupId, message }

3. Contact Management
   - GET /api/contacts
   Query: { profileId }

4. Group Management
   - GET /api/groups
   Query: { profileId }

5. Multi-Profile Support
   - POST /api/profiles
   Body: { name, webhookUrl }
   - GET /api/profiles
   - PUT /api/profiles/:id
   - DELETE /api/profiles/:id

6. Webhook Configuration
   - Enable/disable message forwarding
   - Configurable webhook URL per profile
   - Message format: { profileId, from, to, message, timestamp }

7. Authentication
   - Bearer token authentication
   - Token generation per profile
   - Protected routes

8. Docker Configuration
   - Dockerfile for Node.js application
   - Docker Compose with:
     - Node.js application
     - MySQL database
     - Volume persistence

9. Git Configuration
   - Exclude node_modules
   - Exclude .env
   - Exclude session files
   - Exclude logs

10. Postman Collection
    - Environment variables
    - Request examples
    - Authentication setup
    - All API endpoints

Database Schema (MySQL):
```sql
CREATE TABLE profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    session TEXT,
    enable_webhook BOOLEAN DEFAULT false,
    webhook_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
