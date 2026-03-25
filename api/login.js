// api/login.js - Login with external API
const express = require('express');
const router = express.Router();
const { saveUser, getUserByMobile } = require('./utils/db');

// Fetch batches from external API
async function fetchUserBatches(apiBase, userId, token) {
  try {
    const encodeHeader = (str) => {
      try {
        return btoa(unescape(encodeURIComponent(str)));
      } catch (e) {
        return '';
      }
    };

    const url = `${apiBase}/get/mycoursev2?userid=${encodeURIComponent(userId)}`;
    const headers = {
      'Client-Service': 'Appx',
      'source': 'website',
      'Auth-Key': 'appxapi',
      'Authorization': token,
      'User-ID': encodeHeader(userId)
    };

    const response = await fetch(url, { headers });
    const result = await response.json();

    if (result.data && result.data.length > 0) {
      return result.data.map(batch => ({
        batch_id: batch.id,
        batch_name: batch.course_name,
        thumbnail: batch.course_thumbnail,
        start_date: batch.start_date,
        end_date: batch.end_date,
        purchase_date: new Date()
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
}

// GET /api/login
router.get('/', async (req, res) => {
  try {
    const { credentials, api } = req.query;
    
    if (!credentials) {
      return res.status(400).json({ error: 'Credentials required (format: MOBILE*PASSWORD)' });
    }

    const [mobile, password] = credentials.split('*');
    if (!mobile || !password) {
      return res.status(400).json({ error: 'Invalid format. Use: MOBILE*PASSWORD' });
    }

    const apiBase = api || 'https://rozgarapinew.teachx.in';

    // Login to external API
    const loginUrl = `${apiBase}/post/userLogin`;
    const formData = new URLSearchParams();
    formData.append('email', mobile);
    formData.append('password', password);

    const authResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Auth-Key': 'appxapi', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    
    const authResult = await authResponse.json();

    if (authResult.status !== 200) {
      return res.status(401).json({ error: 'Invalid credentials', status: authResult.status });
    }

    const token = authResult.data.token;
    const userId = authResult.data.userid;
    
    // Fetch batches
    const batches = await fetchUserBatches(apiBase, userId, token);

    // Save to DB
    const existingUser = await getUserByMobile(mobile);
    
    const userData = {
      mobile,
      password: password, // Will be hashed in saveUser
      token,
      user_id: userId,
      api_base: apiBase,
      purchased_batches: batches,
      last_login: new Date(),
      login_count: existingUser ? (existingUser.login_count || 0) + 1 : 1,
      created_at: existingUser ? existingUser.created_at : new Date()
    };

    await saveUser(userData);

    res.json({
      success: true,
      token,
      user_id: userId,
      mobile,
      purchased_batches: batches
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;