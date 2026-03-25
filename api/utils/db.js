// api/utils/db.js - Database helper functions
const connectDB = require('../../lib/db');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// Get user by mobile
async function getUserByMobile(mobile) {
  await connectDB();
  return User.findOne({ mobile });
}

// Get user by token
async function getUserByToken(token) {
  await connectDB();
  return User.findOne({ token });
}

// Get all users
async function getAllUsers() {
  await connectDB();
  return User.find({});
}

// Save/update user
async function saveUser(userData) {
  await connectDB();
  
  // Hash password if not already hashed
  if (userData.password && !userData.password.startsWith('$2')) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  await User.updateOne(
    { mobile: userData.mobile },
    { $set: userData },
    { upsert: true }
  );
  
  return userData;
}

// Update user batches
async function updateUserBatches(mobile, batches) {
  await connectDB();
  await User.updateOne(
    { mobile },
    { $set: { purchased_batches: batches, last_updated: new Date() } }
  );
}

// Update user token
async function updateUserToken(mobile, token) {
  await connectDB();
  await User.updateOne(
    { mobile },
    { $set: { token, token_updated: new Date() } }
  );
}

// Create user (admin)
async function createUser(mobile, password, token, apiBase) {
  await connectDB();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const userData = {
    mobile,
    password: hashedPassword,
    token: token || null,
    user_id: mobile,
    api_base: apiBase || 'https://rozgarapinew.teachx.in',
    purchased_batches: [],
    login_count: 0,
    last_login: null,
    created_at: new Date(),
    created_by_admin: true
  };
  
  await User.updateOne(
    { mobile },
    { $set: userData },
    { upsert: true }
  );
  
  return userData;
}

// Verify admin
async function verifyAdmin(username, password) {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

module.exports = {
  getUserByMobile,
  getUserByToken,
  getAllUsers,
  saveUser,
  updateUserBatches,
  updateUserToken,
  createUser,
  verifyAdmin
};