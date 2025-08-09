const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  roastMessages: [String],
  matchMessage: { type: String, default: '❤️ Liked you back! Sambar ready aano?' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Food', foodSchema);