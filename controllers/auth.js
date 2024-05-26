
require('dotenv').config();

const jwt = require('jsonwebtoken');

// Secret key for signing JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
