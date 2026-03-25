// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: null
  },
  user_id: {
    type: String,
    required: true
  },
  api_base: {
    type: String,
    default: 'https://rozgarapinew.teachx.in'
  },
  purchased_batches: [{
    batch_id: Number,
    batch_name: String,
    thumbnail: String,
    start_date: String,
    end_date: String,
    purchase_date: Date
  }],
  login_count: {
    type: Number,
    default: 0
  },
  last_login: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  created_by_admin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);