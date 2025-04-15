const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// Initialize database with required tables
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create profiles table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        session TEXT,
        enable_webhook BOOLEAN DEFAULT false,
        webhook_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};
