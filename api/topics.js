// api/topics.js - Get subjects and topics
const express = require('express');
const router = express.Router();
const { getUserByToken } = require('./utils/db');

router.get('/', async (req, res) => {
  try {
    const { token, batch_id, subject_id } = req.query;
    
    if (!token || !batch_id) {
      return res.status(400).json({ error: 'Token and batch_id required' });
    }

    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const encodeHeader = (str) => {
      try {
        return btoa(unescape(encodeURIComponent(str)));
      } catch (e) {
        return '';
      }
    };

    const headers = {
      'Client-Service': 'Appx',
      'source': 'website',
      'Auth-Key': 'appxapi',
      'Authorization': user.token,
      'User-ID': encodeHeader(user.user_id)
    };

    // Get topics (if subject_id provided)
    if (subject_id) {
      const url = `${user.api_base}/get/alltopicfrmlivecourseclass?courseid=${batch_id}&subjectid=${subject_id}&start=-1`;
      const response = await fetch(url, { headers });
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        const topics = result.data.map(topic => ({
          topic_id: topic.topicid,
          topic_name: topic.topic_name,
          description: topic.topic_description
        }));
        return res.json({ success: true, topics });
      }
      return res.status(404).json({ error: 'No topics found' });
    }
    
    // Get subjects
    const url = `${user.api_base}/get/allsubjectfrmlivecourseclass?courseid=${batch_id}&start=-1`;
    const response = await fetch(url, { headers });
    const result = await response.json();

    if (result.data && result.data.length > 0) {
      const subjects = result.data.map(subject => ({
        subject_id: subject.subjectid,
        subject_name: subject.subject_name,
        description: subject.subject_description
      }));
      return res.json({ success: true, subjects });
    }
    
    res.status(404).json({ error: 'No subjects found' });

  } catch (error) {
    console.error('Topics error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;