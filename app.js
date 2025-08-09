import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currentFood, setCurrentFood] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRandomFood = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/random-food');
      setCurrentFood(res.data);
    } catch (err) {
      setMessage("Error loading food!");
    }
  };

  const handleSwipe = async (action) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/swipe/${currentFood._id}`,
        { action }
      );
      
      setMessage(res.data.match ? res.data.message : res.data.roast);
      fetchRandomFood(); // Get new food
    } catch (err) {
      setMessage("Swiping failed!");
    }
  };

  useEffect(() => {
    fetchRandomFood();
  }, []);

  return (
    <div className="app">
      {currentFood ? (
        <div className="card">
          <h1>{currentFood.emoji}</h1>
          <h2>{currentFood.name}</h2>
          <p>{currentFood.description}</p>
          
          <div className="buttons">
            <button onClick={() => handleSwipe('reject')}>❌ Reject</button>
            <button onClick={() => handleSwipe('like')}>❤️ Like</button>
          </div>
        </div>
      ) : (
        <p>Loading food...</p>
      )}
      
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;