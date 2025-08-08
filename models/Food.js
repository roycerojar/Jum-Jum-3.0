const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Uzhunnu Vada"
  emoji: { type: String, required: true }, // "🍩"
  description: { type: String, required: true }, 
  roastMessages: [String], // ["Oh look, another wheat-flour simp..."]
  matchMessage: { type: String }
});

module.exports = mongoose.model('Food', foodSchema);