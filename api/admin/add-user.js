// api/admin/add-user.js - Create user
const express = require('express');
const router = express.Router();
const { createUser, verifyAdmin } = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    const { username, password, mobile, pass, token, api } = req.query;
    
    const isValid = await verifyAdmin(username, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    if (!mobile || !pass) {
      return res.status(400).json({ error: 'Mobile and password required' });
    }

    const apiBase = api || 'https://rozgarapinew.teachx.in';
    const user = await createUser(mobile, pass, token || null, apiBase);

    res.json({
      success: true,
      message: 'User created successfully',
      user: { mobile: user.mobile, user_id: user.user_id }
    });

  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;