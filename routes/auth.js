const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: "User created! Swipe time!" });
  } catch (err) {
    res.status(400).json({ message: "Username already exists!" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found!" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Incorrect password!" });

  const token = jwt.sign({ _id: user._id }, 'YOUR_SECRET_KEY');
  res.header('auth-token', token).json({ 
    token,
    message: "Login success! Time to find your pazhampori soulmate!" 
  });
});

module.exports = router;