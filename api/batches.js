// api/batches.js - Get user batches
const express = require('express');
const router = express.Router();
const { getUserByToken, updateUserBatches } = require('./utils/db');

router.get('/', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Try to fetch fresh batches
    try {
      const encodeHeader = (str) => {
        try {
          return btoa(unescape(encodeURIComponent(str)));
        } catch (e) {
          return '';
        }
      };

      const url = `${user.api_base}/get/mycoursev2?userid=${encodeURIComponent(user.user_id)}`;
      const headers = {
        'Client-Service': 'Appx',
        'source': 'website',
        'Auth-Key': 'appxapi',
        'Authorization': user.token,
        'User-ID': encodeHeader(user.user_id)
      };

      const response = await fetch(url, { headers });
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        const freshBatches = result.data.map(batch => ({
          batch_id: batch.id,
          batch_name: batch.course_name,
          thumbnail: batch.course_thumbnail,
          start_date: batch.start_date,
          end_date: batch.end_date
        }));

        await updateUserBatches(user.mobile, freshBatches);
        return res.json({ success: true, batches: freshBatches });
      }
    } catch (fetchError) {
      console.error('Error fetching fresh batches:', fetchError);
    }

    // Return cached batches
    res.json({ 
      success: true, 
      batches: user.purchased_batches || [], 
      cached: true 
    });

  } catch (error) {
    console.error('Batches error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;