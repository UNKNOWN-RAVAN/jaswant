// api/admin/add-token.js - Add token to user
const express = require('express');
const router = express.Router();
const { getUserByMobile, updateUserToken, verifyAdmin } = require('../utils/db');

router.get('/', async (req, res) => {
  try {
    const { username, password, mobile, token } = req.query;
    
    const isValid = await verifyAdmin(username, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    if (!mobile || !token) {
      return res.status(400).json({ error: 'Mobile and token required' });
    }

    const user = await getUserByMobile(mobile);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await updateUserToken(mobile, token);

    res.json({
      success: true,
      message: 'Token added successfully',
      mobile
    });

  } catch (error) {
    console.error('Add token error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;