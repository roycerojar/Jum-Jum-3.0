const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const User = require('../models/User');

// Get random food item to swipe
router.get('/food', async (req, res) => {
  try {
    const count = await Food.countDocuments();
    const random = Math.floor(Math.random() * count);
    const food = await Food.findOne().skip(random);
    
    res.json({
      ...food._doc,
      bio: `${food.name} | ${food.description}`,
      emoji: food.emoji
    });
  } catch (err) {
    res.status(500).json({ message: "Appo pani poyi!" });
  }
});

// Handle swipe action
router.post('/swipe/:foodId', async (req, res) => {
  const { userId, action } = req.body; // action: "like" or "reject"
  
  try {
    const user = await User.findById(userId);
    const food = await Food.findById(req.params.foodId);

    if (action === 'like') {
      user.swipedRight.push(food._id);
      await user.save();
      
      // Check if food also "likes" the user (30% chance)
      if (Math.random() < 0.3) {
        user.matches.push({ food: food._id });
        await user.save();
        return res.json({ 
          match: true,
          message: food.matchMessage || `❤️ ${food.name} liked you back! Sambar ready aano?`
        });
      }
    }

    res.json({ 
      match: false,
      roast: food.roastMessages[Math.floor(Math.random() * food.roastMessages.length)]
    });
  } catch (err) {
    res.status(500).json({ message: "Pani theernu... try again!" });
  }
});

module.exports = router;