import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './theme.css';
import './App.css';
import MoodTracker from './components/MoodTracker';
import RecipeBox from './components/RecipeBox';
import GoalSetting from './components/GoalSetting';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FashionBackground() {
  return (
    <div className="fashion-background">
      <div className="bg-particles"></div>
      <div className="floating-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
        <div className="shape-4"></div>
      </div>
    </div>
  );
}

function FashionNavbar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateDate();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <nav className="fashion-navbar">
      <div className="nav-container">
        <Link to="/" className="fashion-logo">
          <span className="logo-icon">🌸</span>
          <span className="logo-text">MoodBloom</span>
        </Link>

        <div className="fashion-nav-links">
          <Link 
            to="/" 
            className={`fashion-nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span>🏠</span> Dashboard
          </Link>
          <Link 
            to="/mood-tracker" 
            className={`fashion-nav-link ${location.pathname === '/mood-tracker' ? 'active' : ''}`}
          >
            <span>😊</span> Mood Tracker
          </Link>
          <Link 
            to="/recipe-box" 
            className={`fashion-nav-link ${location.pathname === '/recipe-box' ? 'active' : ''}`}
          >
            <span>👨‍🍳</span> Recipe Box
          </Link>
          <Link 
            to="/goal-setting" 
            className={`fashion-nav-link ${location.pathname === '/goal-setting' ? 'active' : ''}`}
          >
            <span>🎯</span> Goals
          </Link>
        </div>

        <div className="fashion-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon"></span>
          </form>
        </div>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    moodEntries: 0,
    recipes: 0,
    goals: 0,
    completedGoals: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [moodRes, recipesRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/mood/entries`),
        axios.get(`${API_URL}/api/recipes`),
        axios.get(`${API_URL}/api/goals`)
      ]);

      const completedGoals = goalsRes.data.items?.filter(g => g.completed)?.length || 0;

      setStats({
        moodEntries: moodRes.data.length || 0,
        recipes: recipesRes.data.items?.length || 0,
        goals: goalsRes.data.items?.length || 0,
        completedGoals: completedGoals
      });

      // Generate recent activity
      const activities = [];
      const now = new Date();

      if (moodRes.data.length > 0) {
        const latestMood = moodRes.data[moodRes.data.length - 1];
        activities.push({
          type: 'mood',
          emoji: latestMood.mood,
          text: `Logged ${latestMood.mood} mood`,
          time: 'Just now'
        });
      }

      if (recipesRes.data.items?.length > 0) {
        const latestRecipe = recipesRes.data.items[recipesRes.data.items.length - 1];
        activities.push({
          type: 'recipe',
          emoji: '👨‍🍳',
          text: `Added "${latestRecipe.title}"`,
          time: 'Today'
        });
      }

      setRecentActivity(activities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use demo data
      setStats({
        moodEntries: 8,
        recipes: 5,
        goals: 3,
        completedGoals: 1
      });
      setRecentActivity([
        { type: 'mood', emoji: '😊', text: 'Logged happy mood', time: '10m ago' },
        { type: 'recipe', emoji: '👨‍🍳', text: 'Added "Berry Smoothie" recipe', time: '2h ago' },
        { type: 'goal', emoji: '🎯', text: 'Completed morning meditation goal', time: 'Yesterday' }
      ]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fashion-dashboard">
      <div className="welcome-hero">
        <div className="hero-emoji"></div>
        <h1>Welcome to MoodBloom</h1>
        <p className="hero-subtitle">
          Your peaceful space for emotional wellness, nourishing recipes, 
          and gentle goal setting. Start your journey to a balanced life.
        </p>
      </div>

      <div className="fashion-stats-grid">
        <div className="fashion-stat-card">
          <div className="stat-emoji">😊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.moodEntries}</div>
            <div className="stat-label">Mood Entries</div>
          </div>
        </div>

        <div className="fashion-stat-card">
          <div className="stat-emoji">👨‍🍳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.recipes}</div>
            <div className="stat-label">Recipes</div>
          </div>
        </div>

        <div className="fashion-stat-card">
          <div className="stat-emoji">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{stats.goals}</div>
            <div className="stat-label">Goals Set</div>
          </div>
        </div>

        <div className="fashion-stat-card">
          <div className="stat-emoji">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedGoals}</div>
            <div className="stat-label">Goals Achieved</div>
          </div>
        </div>
      </div>

      <div className="fashion-features-grid">
        <div className="fashion-feature-card">
          <div className="feature-header">
            <div className="feature-emoji">😊</div>
            <h2 className="feature-title">Emotional Wellness</h2>
          </div>
          <p className="feature-description">
            Track your daily moods with gentle emojis, add reflective notes, 
            and watch your emotional patterns blossom over time. Your feelings matter.
          </p>
          <Link to="/mood-tracker" className="feature-btn">
            Track Your Mood <span>→</span>
          </Link>
        </div>

        <div className="fashion-feature-card">
          <div className="feature-header">
            <div className="feature-emoji">👨‍🍳</div>
            <h2 className="feature-title">Nourishing Recipes</h2>
          </div>
          <p className="feature-description">
            Collect and organize recipes that nourish your body and soul. 
            From comforting meals to healthy snacks, keep your kitchen inspired.
          </p>
          <Link to="/recipe-box" className="feature-btn">
            Browse Recipes <span>→</span>
          </Link>
        </div>

        <div className="fashion-feature-card">
          <div className="feature-header">
            <div className="feature-emoji">🎯</div>
            <h2 className="feature-title">Gentle Goal Setting</h2>
          </div>
          <p className="feature-description">
            Set intentions, break them into gentle steps, and celebrate progress. 
            Achieve your dreams with mindfulness and self-compassion.
          </p>
          <Link to="/goal-setting" className="feature-btn">
            Set Goals <span>→</span>
          </Link>
        </div>
      </div>

      <div className="fashion-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/mood-tracker" className="quick-action">
            <div className="quick-action-emoji">😊</div>
            <div className="quick-action-text">Log Today's Mood</div>
          </Link>

          <Link to="/recipe-box" className="quick-action">
            <div className="quick-action-emoji">👨‍🍳</div>
            <div className="quick-action-text">Add New Recipe</div>
          </Link>

          <Link to="/goal-setting" className="quick-action">
            <div className="quick-action-emoji">🎯</div>
            <div className="quick-action-text">Set New Goal</div>
          </Link>

          <button className="quick-action" onClick={() => alert('Daily reflection coming soon!')}>
            <div className="quick-action-emoji">📝</div>
            <div className="quick-action-text">Daily Reflection</div>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-emoji">{activity.emoji}</div>
                <div className="activity-content">
                  <div className="activity-text">{activity.text}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-emoji">📝</div>
              <div className="empty-text">No recent activity yet</div>
              <Link to="/mood-tracker" className="empty-action">
                Start your journey
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FashionFooter() {
  return (
    <footer className="fashion-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MoodBloom 🌸</h3>
          <p>A gentle space for emotional wellness, nourishing recipes, and mindful goal setting.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/"><span>🏠</span> Dashboard</Link></li>
            <li><Link to="/mood-tracker"><span>😊</span> Mood Tracker</Link></li>
            <li><Link to="/recipe-box"><span>👨‍🍳</span> Recipe Box</Link></li>
            <li><Link to="/goal-setting"><span>🎯</span> Goal Setting</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <ul className="footer-links">
            <li><span>🌸</span> Emotional Tracking</li>
            <li><span>🥗</span> Recipe Collection</li>
            <li><span>✨</span> Goal Progress</li>
            <li><span>📱</span> Mobile Friendly</li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <p>© 2025 MoodBloom • Designed with 💖 for emotional wellness</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <FashionBackground />
        <FashionNavbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/recipe-box" element={<RecipeBox />} />
            <Route path="/goal-setting" element={<GoalSetting />} />
          </Routes>
        </main>
        
        <FashionFooter />
      </div>
    </Router>
  );
}

export default App;