import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import '../theme.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GoalSetting = () => {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    targetDate: '',
    priority: 'Medium',
    tasks: ['']
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/goals`);
      setGoals(response.data.items || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Demo data
      const demoGoals = [
        {
          id: 1,
          title: 'Morning Meditation Practice',
          description: 'Start each day with 10 minutes of meditation',
          category: 'Wellness',
          targetDate: '2025-02-15',
          priority: 'High',
          progress: 75,
          completed: false,
          tasks: [
            'Download meditation app',
            'Create morning routine',
            'Practice for 10 minutes daily',
            'Track consistency for 21 days'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Learn Healthy Cooking',
          description: 'Master 5 new healthy recipes',
          category: 'Skills',
          targetDate: '2025-03-01',
          priority: 'Medium',
          progress: 40,
          completed: false,
          tasks: [
            'Research healthy recipes',
            'Grocery shopping for ingredients',
            'Cook 1 new recipe per week',
            'Document favorite recipes'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Digital Detox Weekend',
          description: 'Spend a weekend without screens',
          category: 'Wellness',
          targetDate: '2025-01-20',
          priority: 'Low',
          progress: 100,
          completed: true,
          tasks: [
            'Plan offline activities',
            'Inform friends and family',
            'Prepare books and board games',
            'Reflect on the experience'
          ],
          createdAt: new Date().toISOString()
        }
      ];
      setGoals(demoGoals);
      setCategories(['Wellness', 'Career', 'Learning', 'Personal', 'Health', 'Skills']);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = value;
    setFormData({
      ...formData,
      tasks: newTasks
    });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, '']
    });
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tasks: newTasks
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      tasks: formData.tasks.filter(task => task.trim() !== '')
    };

    try {
      if (editingGoal) {
        await axios.put(`${API_URL}/api/goals/${editingGoal.id}`, goalData);
        setEditingGoal(null);
      } else {
        await axios.post(`${API_URL}/api/goals`, goalData);
      }
      
      fetchGoals();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      targetDate: '',
      priority: 'Medium',
      tasks: ['']
    });
    setEditingGoal(null);
  };

  const editGoal = (goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate,
      priority: goal.priority,
      tasks: goal.tasks.length > 0 ? goal.tasks : ['']
    });
    setEditingGoal(goal);
    setShowForm(true);
  };

  const deleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      try {
        await axios.delete(`${API_URL}/api/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const updateProgress = async (goal, progress) => {
    try {
      await axios.put(`${API_URL}/api/goals/${goal.id}`, {
        ...goal,
        progress,
        completed: progress === 100
      });
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const filteredGoals = filterStatus === 'All' 
    ? goals 
    : filterStatus === 'Active' 
    ? goals.filter(goal => !goal.completed)
    : goals.filter(goal => goal.completed);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FFB6B9';
      case 'Medium': return '#BEE3F8';
      case 'Low': return '#C0F2D8';
      default: return '#DDD6FE';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return '#C0F2D8';
    if (progress >= 75) return '#BEE3F8';
    if (progress >= 50) return '#DDD6FE';
    if (progress >= 25) return '#F7DDE2';
    return '#FFB6B9';
  };

  return (
    <div className="goal-setting-page" style={{ textAlign: 'center' }}>
      <div className="page-header">
        <div className="header-emoji"></div>
        <h1>Gentle Goal Setting</h1>
        <p className="page-subtitle">Set intentions and celebrate progress with compassion</p>
      </div>

      <div className="goal-controls" style={{ 
        maxWidth: '800px', 
        margin: '0 auto 3rem auto',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '1.5rem',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="filter-section" style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          <button
            className={`filter-btn ${filterStatus === 'All' ? 'active' : ''}`}
            onClick={() => setFilterStatus('All')}
            style={{
              background: filterStatus === 'All' ? 'linear-gradient(135deg, #F7DDE2 0%, #BEE3F8 100%)' : '#F5F5F5',
              color: filterStatus === 'All' ? 'white' : '#4A5568',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            All Goals
          </button>
          <button
            className={`filter-btn ${filterStatus === 'Active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Active')}
            style={{
              background: filterStatus === 'Active' ? 'linear-gradient(135deg, #F7DDE2 0%, #BEE3F8 100%)' : '#F5F5F5',
              color: filterStatus === 'Active' ? 'white' : '#4A5568',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filterStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Completed')}
            style={{
              background: filterStatus === 'Completed' ? 'linear-gradient(135deg, #C0F2D8 0%, #BEE3F8 100%)' : '#F5F5F5',
              color: filterStatus === 'Completed' ? 'white' : '#4A5568',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Completed
          </button>
        </div>
        
        <button 
          className="feature-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #F7DDE2 0%, #BEE3F8 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(190, 227, 248, 0.3)'
          }}
        >
          <span>✨</span> Set New Intention
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
          }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
              {editingGoal ? 'Edit Intention' : 'Set New Intention'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Intention Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #F5F5F5',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #F5F5F5',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div className="form-row" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#4A5568',
                    fontSize: '0.9rem'
                  }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #F5F5F5',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#4A5568',
                    fontSize: '0.9rem'
                  }}>
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #F5F5F5',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Target Date (Optional)
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #F5F5F5',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div className="form-section" style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Gentle Steps
                </label>
                {formData.tasks.map((task, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginBottom: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: 'linear-gradient(135deg, #F7DDE2 0%, #BEE3F8 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      placeholder={`Step ${index + 1}`}
                      value={task}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '2px solid #F5F5F5',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem'
                      }}
                    />
                    {formData.tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        style={{
                          background: '#FFB6B9',
                          color: 'white',
                          border: 'none',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTask}
                  style={{
                    background: '#F5F5F5',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    color: '#4A5568'
                  }}
                >
                  + Add Step
                </button>
              </div>
              
              <div className="form-actions" style={{ 
                display: 'flex', 
                gap: '1rem'
              }}>
                <button type="submit" className="feature-btn" style={{ flex: 1 }}>
                  {editingGoal ? 'Update Intention' : 'Set Intention'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  style={{
                    flex: 1,
                    background: '#F5F5F5',
                    color: '#4A5568',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="centered-goals" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredGoals.length > 0 ? (
            <div className="goals-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              justifyContent: 'center'
            }}>
              {filteredGoals.map(goal => (
                <div key={goal.id} className="goal-card" style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: goal.completed ? '2px solid #C0F2D8' : '1px solid rgba(255, 255, 255, 0.5)',
                  textAlign: 'left',
                  position: 'relative',
                  opacity: goal.completed ? '0.9' : '1'
                }}>
                  {goal.completed && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: '#C0F2D8',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      boxShadow: '0 4px 12px rgba(192, 242, 216, 0.3)'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  <div className="goal-header" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ 
                        fontSize: '1.4rem', 
                        color: '#2D3748',
                        marginBottom: '0.5rem'
                      }}>
                        {goal.title}
                      </h3>
                      <span style={{
                        background: getPriorityColor(goal.priority),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {goal.priority}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #F7DDE2 0%, #DDD6FE 100%)',
                        color: '#4A5568',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {goal.category}
                      </span>
                      {goal.targetDate && (
                        <span style={{ 
                          color: '#718096', 
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          📅 {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {goal.description && (
                    <p style={{ 
                      color: '#718096', 
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                      fontStyle: 'italic'
                    }}>
                      {goal.description}
                    </p>
                  )}
                  
                  <div className="goal-progress" style={{ margin: '1.5rem 0' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#4A5568', fontWeight: '600' }}>Progress</span>
                      <span style={{ 
                        color: goal.progress === 100 ? '#38A169' : '#4A5568',
                        fontWeight: '700'
                      }}>
                        {goal.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: '#F5F5F5',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div 
                        style={{ 
                          height: '100%',
                          background: getProgressColor(goal.progress || 0),
                          borderRadius: '4px',
                          width: `${goal.progress || 0}%`,
                          transition: 'width 0.6s ease'
                        }}
                      ></div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: '#718096'
                    }}>
                      <span>Start</span>
                      <span>Complete</span>
                    </div>
                  </div>
                  
                  <div className="goal-steps" style={{ margin: '1.5rem 0' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ color: '#4A5568', fontWeight: '600' }}>Gentle Steps</span>
                      <span style={{ 
                        color: '#718096', 
                        fontSize: '0.9rem',
                        background: '#F5F5F5',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px'
                      }}>
                        {goal.tasks?.length || 0} steps
                      </span>
                    </div>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {goal.tasks?.map((task, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: '#F5F5F5',
                          borderRadius: '12px',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'white',
                            border: '2px solid #DDD6FE',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            color: '#DDD6FE',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <span style={{ 
                            color: '#4A5568',
                            fontSize: '0.9rem',
                            flex: 1
                          }}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="goal-actions" style={{ 
                    display: 'flex', 
                    gap: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem',
                      flex: 1,
                      flexWrap: 'wrap'
                    }}>
                      {[0, 25, 50, 75, 100].map(value => (
                        <button
                          key={value}
                          onClick={() => updateProgress(goal, value)}
                          style={{
                            background: goal.progress === value ? getProgressColor(value) : '#F5F5F5',
                            color: goal.progress === value ? 'white' : '#4A5568',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            minWidth: '40px'
                          }}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="feature-btn"
                        onClick={() => editGoal(goal)}
                        style={{ 
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        style={{
                          background: '#F5F5F5',
                          color: '#718096',
                          border: 'none',
                          width: '40px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '24px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>🎯</div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2D3748' }}>
                No goals found
              </h3>
              <p style={{ marginBottom: '2rem', color: '#718096' }}>
                {filterStatus === 'Completed' 
                  ? 'You haven\'t completed any goals yet'
                  : 'Start your journey by setting your first intention'}
              </p>
              <button 
                className="feature-btn"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                Set Your First Intention
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalSetting;