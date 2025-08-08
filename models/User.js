const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true }, // "PorottaLover69"
  password: { type: String, required: true },
  swipedRight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  matches: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);