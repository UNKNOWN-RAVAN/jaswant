// api/admin/users.js - Get all users
const express = require('express');
const router = express.Router();
const { getAllUsers, verifyAdmin } = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    const { username, password } = req.query;
    
    const isValid = await verifyAdmin(username, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const users = await getAllUsers();

    const sanitizedUsers = users.map(user => ({
      mobile: user.mobile,
      user_id: user.user_id,
      token: user.token || null,
      purchased_batches: user.purchased_batches || [],
      login_count: user.login_count || 0,
      last_login: user.last_login,
      created_at: user.created_at,
      api_base: user.api_base
    }));

    res.json({
      success: true,
      total_users: users.length,
      users: sanitizedUsers
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;