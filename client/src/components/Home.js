import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Your Personal Dashboard</h1>
        <p>Track your mood, organize recipes, and achieve your goals all in one place!</p>
      </header>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">😊</div>
          <h2>Mood Tracker</h2>
          <p>Log daily moods with emojis and notes. View patterns over time to understand your emotional well-being.</p>
          <Link to="/mood-tracker" className="feature-btn">Start Tracking</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👨‍🍳</div>
          <h2>Recipe Box</h2>
          <p>Save and organize your favorite recipes with ingredients, steps, and meal categories.</p>
          <Link to="/recipe-box" className="feature-btn">Browse Recipes</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h2>Goal Setting</h2>
          <p>Set and track goals with progress monitoring. Break them down into manageable tasks.</p>
          <Link to="/goal-setting" className="feature-btn">Set Goals</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;