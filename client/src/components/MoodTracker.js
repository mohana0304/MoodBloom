import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../theme.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState('😊');
  const [notes, setNotes] = useState('');
  const [filterDays, setFilterDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('log');

  const moods = [
    { emoji: '😢', label: 'Sad', color: '#BEE3F8' },
    { emoji: '😞', label: 'Okay', color: '#DDD6FE' },
    { emoji: '😊', label: 'Happy', color: '#C0F2D8' },
    { emoji: '🤩', label: 'Excited', color: '#F7DDE2' },
    { emoji: '😡', label: 'Angry', color: '#FFB6B9' },
    { emoji: '😴', label: 'Tired', color: '#A0C4FF' },
    { emoji: '😌', label: 'Peaceful', color: '#CAFFBF' },
    { emoji: '🤯', label: 'Stressed', color: '#FFD6E0' }
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/mood/entries`);
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      // Demo data
      const demoEntries = [
        { id: 1, date: new Date().toISOString(), mood: '😊', notes: 'Feeling grateful for this beautiful day!', intensity: 3 },
        { id: 2, date: new Date(Date.now() - 86400000).toISOString(), mood: '😌', notes: 'Peaceful meditation session this morning', intensity: 4 },
        { id: 3, date: new Date(Date.now() - 172800000).toISOString(), mood: '😴', notes: 'Need to improve sleep schedule', intensity: 2 },
        { id: 4, date: new Date(Date.now() - 259200000).toISOString(), mood: '🤩', notes: 'Excited about starting yoga classes!', intensity: 5 },
        { id: 5, date: new Date(Date.now() - 345600000).toISOString(), mood: '😢', notes: 'Feeling a bit lonely today', intensity: 1 },
        { id: 6, date: new Date(Date.now() - 432000000).toISOString(), mood: '😞', label: 'Okay', notes: 'Average day, nothing special', intensity: 2 },
        { id: 7, date: new Date(Date.now() - 518400000).toISOString(), mood: '😌', label: 'Peaceful', notes: 'Enjoying quiet time with a book', intensity: 4 },
      ];
      setEntries(demoEntries);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    if (!selectedMood) return;
    
    const newEntry = {
      mood: selectedMood,
      notes: notes.trim(),
      intensity: moods.findIndex(m => m.emoji === selectedMood) + 1
    };

    try {
      const response = await axios.post(`${API_URL}/api/mood/entries`, newEntry);
      setEntries([...entries, response.data]);
      setNotes('');
      setSelectedMood('😊');
      
      // Show success feedback
      const btn = document.querySelector('.log-mood-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Mood Logged!';
      btn.style.background = 'linear-gradient(135deg, #C0F2D8 0%, #BEE3F8 100%)';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'linear-gradient(135deg, #F7DDE2 0%, #DDD6FE 100%)';
      }, 2000);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/mood/entries/${id}`);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const cutoffDate = subDays(new Date(), filterDays);
    return entryDate >= cutoffDate;
  });

  const chartData = filteredEntries.map(entry => ({
    date: format(new Date(entry.date), 'MM/dd'),
    mood: entry.intensity,
    emoji: entry.mood
  }));

  const getMoodInsight = () => {
    if (filteredEntries.length === 0) return 'Start logging your moods to see beautiful patterns unfold!';
    
    const avgIntensity = filteredEntries.reduce((sum, entry) => sum + entry.intensity, 0) / filteredEntries.length;
    
    if (avgIntensity > 3.5) return 'Your emotional garden is blooming beautifully! 🌸';
    if (avgIntensity > 2.5) return 'You\'re finding balance and peace. Keep nurturing yourself! 🌈';
    return 'Remember to be gentle with yourself. Every feeling is valid. 💖';
  };

  return (
    <div className="mood-tracker-page">
      <div className="mood-header">
        <div className="mood-title">
          <h1>Emotional Wellness Tracker</h1>
          <span className="hero-emoji">😊</span>
        </div>
        <p className="hero-subtitle">Nurture your emotional garden by tracking how you feel each day</p>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            📝 Log Today's Mood
          </button>
          <button 
            className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            📊 Emotional Insights
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 Mood History
          </button>
        </div>
      </div>

      {activeTab === 'log' && (
        <div className="mood-input-card">
          <h2 className="mood-prompt">How are you feeling today, beautiful soul?</h2>
          
          <div className="mood-grid">
            {moods.map((mood) => (
              <div
                key={mood.emoji}
                className={`mood-option ${selectedMood === mood.emoji ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood.emoji)}
              >
                <div className="mood-emoji-large">{mood.emoji}</div>
                <div className="mood-label">{mood.label}</div>
              </div>
            ))}
          </div>
          
          <div className="notes-card">
            <div className="notes-title">
              <span>📝</span>
              <h3>Reflective Notes (Optional)</h3>
            </div>
            <textarea
              className="notes-textarea"
              placeholder="What's on your heart today? Share your thoughts, feelings, or anything you'd like to remember..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
            />
          </div>
          
          <button className="log-mood-btn" onClick={addEntry}>
            <span>🌸</span> Plant This Mood
          </button>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="mood-input-card">
          <div className="history-header">
            <h2>Emotional Insights</h2>
            <select 
              className="filter-select"
              value={filterDays} 
              onChange={(e) => setFilterDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={365}>All time</option>
            </select>
          </div>
          
          <div className="insight-card">
            <div className="insight-emoji">💭</div>
            <div className="insight-text">{getMoodInsight()}</div>
          </div>
          
          <div className="chart-card">
            <h3>Emotional Journey</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                  <XAxis dataKey="date" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                      padding: '16px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#F7DDE2" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#BEE3F8' }}
                    activeDot={{ r: 8, fill: '#DDD6FE' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mood-distribution">
            <h3>Mood Garden</h3>
            <div className="mood-flowers">
              {moods.map((mood, index) => {
                const count = filteredEntries.filter(e => e.mood === mood.emoji).length;
                const size = Math.max(30, count * 20);
                return (
                  <div key={index} className="mood-flower">
                    <div 
                      className="flower-emoji"
                      style={{ fontSize: `${size}px` }}
                    >
                      {mood.emoji}
                    </div>
                    <div className="flower-count">{count}</div>
                    <div className="flower-label">{mood.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="mood-history-card">
          <div className="history-header">
            <h2>Your Emotional Journey</h2>
            <div className="entries-count">
              {filteredEntries.length} moments captured
            </div>
          </div>
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="mood-entries">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="mood-entry">
                  <div className="entry-emoji">{entry.mood}</div>
                  <div className="entry-content">
                    <div className="entry-date">
                      {format(new Date(entry.date), 'EEEE, MMMM do • h:mm a')}
                    </div>
                    {entry.notes && (
                      <div className="entry-notes">"{entry.notes}"</div>
                    )}
                  </div>
                  <button 
                    className="entry-delete"
                    onClick={() => deleteEntry(entry.id)}
                    title="Release this feeling"
                  >
                    🍃
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-emoji">🌸</div>
              <div className="empty-text">Your emotional garden is waiting to bloom</div>
              <button 
                className="empty-action"
                onClick={() => setActiveTab('log')}
              >
                Plant your first mood
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;