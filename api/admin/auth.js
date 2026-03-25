// api/admin/auth.js - Admin authentication
const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    const { username, password } = req.query;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const isValid = await verifyAdmin(username, password);

    if (isValid) {
      return res.json({
        success: true,
        message: 'Admin login successful',
        admin: { username: process.env.ADMIN_USERNAME }
      });
    }

    res.status(401).json({ error: 'Invalid admin credentials' });

  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;