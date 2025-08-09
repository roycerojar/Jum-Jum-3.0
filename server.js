require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bakshana-tinder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB! 🍌'))
.catch(err => console.error('DB Connection Error:', err));

// Food Schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  description: { type: String },
  swipeRightCount: { type: Number, default: 0 },
  swipeLeftCount: { type: Number, default: 0 },
  roasts: { type: [String], default: [] },
  matchMessage: { type: String }
});

const Food = mongoose.model('Food', foodSchema);

// Routes
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Appo pani poyi!" });
  }
});

app.get('/api/random-food', async (req, res) => {
  try {
    const count = await Food.countDocuments();
    const random = Math.floor(Math.random() * count);
    const food = await Food.findOne().skip(random);
    
    if (!food) return res.status(404).json({ message: "No food found!" });
    
    res.json({
      ...food._doc,
      bio: `${food.emoji} ${food.name} | ${food.description}`
    });
  } catch (err) {
    res.status(500).json({ message: "Kitchen closed! Try again." });
  }
});

app.post('/api/swipe/:foodId', async (req, res) => {
  const { userId, action } = req.body;
  
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: "Food not found!" });

    if (action === 'like') {
      food.swipeRightCount += 1;
      
      if (Math.random() < 0.3) { // 30% match chance
        await food.save();
        return res.json({ 
          match: true,
          message: food.matchMessage || `❤️ ${food.name} liked you back!`
        });
      }
    } else if (action === 'reject') {
      food.swipeLeftCount += 1;
    } else {
      return res.status(400).json({ message: "Invalid action!" });
    }

    await food.save();
    const roast = food.roasts[Math.floor(Math.random() * food.roasts.length)] || "Basic roast!";
    res.json({ match: false, roast });
    
  } catch (err) {
    res.status(500).json({ message: "Swiping error!" });
  }
});

// LEADERBOARD ENDPOINT
app.get('/api/leaderboard', async (req, res) => {
  try {
    const mostLoved = await Food.find()
      .sort({ swipeRightCount: -1 })
      .limit(5);
    
    const mostRejected = await Food.find()
      .sort({ swipeLeftCount: -1 })
      .limit(5);

    res.json({
      topLoved: mostLoved.map(food => ({
        name: food.name,
        emoji: food.emoji,
        likes: food.swipeRightCount,
        description: `${food.emoji} ${food.name} | ${food.swipeRightCount} loves`
      })),
      topRejected: mostRejected.map(food => ({
        name: food.name,
        emoji: food.emoji,
        hates: food.swipeLeftCount,
        description: `${food.emoji} ${food.name} | ${food.swipeLeftCount} rejects`
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Leaderboard load cheyyan pattilla!" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});