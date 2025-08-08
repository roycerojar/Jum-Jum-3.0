const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/bakshana-tinder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(err => console.log("DB connection error:", err));

// Define Food Schema
const foodSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
});

const Food = mongoose.model('Food', foodSchema);

// Routes
app.get('/api/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).send('Error fetching foods');
    }
});

app.post('/api/foods/vote', async (req, res) => {
    try {
        const { foodId, vote } = req.body;
        const food = await Food.findById(foodId);
        
        if (!food) {
            return res.status(404).send('Food not found');
        }

        if (vote === 'like') {
            food.likes += 1;
        } else if (vote === 'dislike') {
            food.dislikes += 1;
        }

        await food.save();
        res.json(food);
    } catch (err) {
        res.status(500).send('Error processing vote');
    }
});

// Initialize food data
async function initializeFoods() {
    try {
        const count = await Food.countDocuments();
        if (count === 0) {
            await Food.insertMany([
                {
                    name: "Parippuvada",
                    desc: "Crispy outside, soft inside. Like your ex.",
                    img: "./pictures for tinder/Parippuvada.jpg"
                },
                {
                    name: "Unniyappam",
                    desc: "Sweet, round, and judges you silently.",
                    img: "./pictures for tinder/Unniyappam.jpg"
                },
                {
                    name: "Beef Fry",
                    desc: "Controversial. Swipe right if you're brave.",
                    img: "./pictures for tinder/Beef fry.jpg"
                },
                {
                    name: "Puttu-Kadala",
                    desc: "Basic but dependable. Unlike you.",
                    img: "./pictures for tinder/Puttu kadala.jpg"
                }
            ]);
            console.log('Initial food data added');
        }
    } catch (err) {
        console.error('Error initializing foods:', err);
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initializeFoods();
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));