const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage (replaces database)
let moodData = {
  entries: [],
  patterns: {}
};

let recipes = {
  items: [],
  categories: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']
};

let goals = {
  items: [],
  categories: ['Health', 'Career', 'Education', 'Personal', 'Financial']
};

// Root route - serve a simple message
app.get('/', (req, res) => {
  res.json({
    message: 'Mood Tracker API is running!',
    endpoints: {
      mood: {
        getEntries: 'GET /api/mood/entries',
        addEntry: 'POST /api/mood/entries',
        deleteEntry: 'DELETE /api/mood/entries/:id'
      },
      recipes: {
        getAll: 'GET /api/recipes',
        add: 'POST /api/recipes',
        update: 'PUT /api/recipes/:id',
        delete: 'DELETE /api/recipes/:id'
      },
      goals: {
        getAll: 'GET /api/goals',
        add: 'POST /api/goals',
        update: 'PUT /api/goals/:id',
        delete: 'DELETE /api/goals/:id'
      }
    }
  });
});

// Mood Tracker API
app.get('/api/mood/entries', (req, res) => {
  res.json(moodData.entries);
});

app.post('/api/mood/entries', (req, res) => {
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...req.body
  };
  moodData.entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.delete('/api/mood/entries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = moodData.entries.length;
  moodData.entries = moodData.entries.filter(entry => entry.id !== id);
  
  if (moodData.entries.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

// Recipe Box API
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
  const newRecipe = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  recipes.items.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = recipes.items.findIndex(r => r.id === id);
  
  if (index !== -1) {
    recipes.items[index] = { 
      ...recipes.items[index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(recipes.items[index]);
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

app.delete('/api/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = recipes.items.length;
  recipes.items = recipes.items.filter(r => r.id !== id);
  
  if (recipes.items.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Goal Setting API
app.get('/api/goals', (req, res) => {
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  const newGoal = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    progress: 0,
    completed: false
  };
  goals.items.push(newGoal);
  res.status(201).json(newGoal);
});

app.put('/api/goals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = goals.items.findIndex(g => g.id === id);
  
  if (index !== -1) {
    goals.items[index] = { 
      ...goals.items[index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(goals.items[index]);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.delete('/api/goals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = goals.items.length;
  goals.items = goals.items.filter(g => g.id !== id);
  
  if (goals.items.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

// Test data endpoint for development
app.get('/api/test-data', (req, res) => {
  // Add some test data
  if (moodData.entries.length === 0) {
    const moods = ['😊', '😢', '🤩', '😌', '😴', '😡'];
    const notes = [
      'Feeling great today!',
      'Had a productive day',
      'Need more sleep',
      'Excited about new project',
      'Feeling peaceful',
      'A bit stressed but managing'
    ];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      moodData.entries.push({
        id: Date.now() + i,
        date: date.toISOString(),
        mood: moods[i % moods.length],
        notes: notes[i % notes.length],
        intensity: (i % 5) + 1
      });
    }
  }
  
  if (recipes.items.length === 0) {
    recipes.items.push({
      id: 1,
      title: 'Avocado Toast',
      description: 'Simple and healthy breakfast',
      category: 'Breakfast',
      prepTime: '5',
      cookTime: '5',
      servings: '1',
      ingredients: [
        '2 slices whole grain bread',
        '1 ripe avocado',
        '1 tbsp lemon juice',
        'Salt and pepper to taste',
        'Red pepper flakes (optional)'
      ],
      steps: [
        'Toast the bread until golden brown',
        'Mash avocado with lemon juice, salt, and pepper',
        'Spread avocado mixture on toast',
        'Sprinkle with red pepper flakes if desired'
      ],
      createdAt: new Date().toISOString()
    });
  }
  
  if (goals.items.length === 0) {
    goals.items.push({
      id: 1,
      title: 'Learn React',
      description: 'Master React fundamentals and build projects',
      category: 'Education',
      targetDate: '2024-06-01',
      priority: 'High',
      progress: 50,
      completed: false,
      tasks: [
        'Complete React tutorial',
        'Build 3 practice projects',
        'Learn React Hooks',
        'Master State Management'
      ],
      createdAt: new Date().toISOString()
    });
  }
  
  res.json({
    message: 'Test data added!',
    moodEntries: moodData.entries.length,
    recipes: recipes.items.length,
    goals: goals.items.length
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    moodEntries: moodData.entries.length,
    recipes: recipes.items.length,
    goals: goals.items.length
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Serve React in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`🏠 Home page: http://localhost:${PORT}/`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Add test data: http://localhost:${PORT}/api/test-data`);
});