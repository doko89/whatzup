const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is required' });
    }
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      
      // Check if the token exists in the database
      const [profiles] = await pool.query('SELECT * FROM profiles WHERE token = ?', [token]);
      
      if (profiles.length === 0) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }
      
      // Add profile to request object
      req.profile = profiles[0];
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Generate a JWT token
const generateToken = (profileId) => {
  return jwt.sign({ profileId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

module.exports = {
  authenticateToken,
  generateToken
};
