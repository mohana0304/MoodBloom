import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../theme.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const RecipeBox = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Breakfast',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [''],
    steps: ['']
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recipes`);
      setRecipes(response.data.items || []);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Demo data
      const demoRecipes = [
        {
          id: 1,
          title: 'Berry Bliss Smoothie',
          description: 'A refreshing and nutritious breakfast smoothie',
          category: 'Breakfast',
          prepTime: '5',
          cookTime: '0',
          servings: '2',
          ingredients: [
            '1 cup mixed berries',
            '1 banana',
            '1 cup almond milk',
            '1 tbsp honey',
            '1 tsp chia seeds'
          ],
          steps: [
            'Add all ingredients to blender',
            'Blend until smooth',
            'Pour into glasses and serve immediately'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Rainbow Veggie Bowl',
          description: 'Colorful and healthy lunch bowl',
          category: 'Lunch',
          prepTime: '15',
          cookTime: '20',
          servings: '1',
          ingredients: [
            '1 cup quinoa',
            '1 avocado',
            '1 bell pepper',
            '1 carrot',
            'Handful of spinach',
            '2 tbsp tahini dressing'
          ],
          steps: [
            'Cook quinoa according to package',
            'Chop vegetables',
            'Arrange in bowl',
            'Drizzle with tahini dressing'
          ],
          createdAt: new Date().toISOString()
        }
      ];
      setRecipes(demoRecipes);
      setCategories(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert']);
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

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim() !== ''),
      steps: formData.steps.filter(s => s.trim() !== '')
    };

    try {
      if (editingRecipe) {
        await axios.put(`${API_URL}/api/recipes/${editingRecipe.id}`, recipeData);
        setEditingRecipe(null);
      } else {
        await axios.post(`${API_URL}/api/recipes`, recipeData);
      }
      
      fetchRecipes();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Breakfast',
      prepTime: '',
      cookTime: '',
      servings: '',
      ingredients: [''],
      steps: ['']
    });
    setEditingRecipe(null);
  };

  const editRecipe = (recipe) => {
    setFormData({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
      steps: recipe.steps.length > 0 ? recipe.steps : ['']
    });
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const deleteRecipe = async (id) => {
    if (window.confirm('Remove this recipe from your collection?')) {
      try {
        await axios.delete(`${API_URL}/api/recipes/${id}`);
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const filteredRecipes = filterCategory === 'All' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === filterCategory);

  return (
    <div className="recipe-box-page" style={{ textAlign: 'center' }}>
      <div className="page-header">
        <div className="header-emoji"></div>
        <h1>Nourishing Recipe Box</h1>
        <p className="page-subtitle">Collect and organize recipes that nourish your body and soul</p>
      </div>

      <div className="recipe-controls" style={{ 
        maxWidth: '800px', 
        margin: '0 auto 3rem auto',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '1.5rem',
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600',
            color: '#4A5568'
          }}>
            Filter by Category:
          </label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '0.75rem 1.5rem',
              border: '2px solid #F5F5F5',
              borderRadius: '16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              background: 'white',
              color: '#4A5568',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
          <span>+</span> Add New Recipe
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
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Recipe Title *
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
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Description
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
                gridTemplateColumns: 'repeat(3, 1fr)',
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
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #F5F5F5',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#4A5568',
                    fontSize: '0.9rem'
                  }}>
                    Cook Time (min)
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #F5F5F5',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div className="form-group">
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: '#4A5568',
                    fontSize: '0.9rem'
                  }}>
                    Servings
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #F5F5F5',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <div className="form-section" style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Ingredients
                </label>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginBottom: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '2px solid #F5F5F5',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem'
                      }}
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('ingredients', index)}
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
                  onClick={() => addArrayField('ingredients')}
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
                  + Add Ingredient
                </button>
              </div>
              
              <div className="form-section" style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600',
                  color: '#4A5568'
                }}>
                  Steps
                </label>
                {formData.steps.map((step, index) => (
                  <div key={index} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                      <textarea
                        placeholder={`Step ${index + 1}`}
                        value={step}
                        onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                        rows="2"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '2px solid #F5F5F5',
                          borderRadius: '12px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                      />
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('steps', index)}
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
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('steps')}
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
                  {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
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
        <div className="centered-recipes" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredRecipes.length > 0 ? (
            <div className="recipes-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              justifyContent: 'center'
            }}>
              {filteredRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card" style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  textAlign: 'left'
                }}>
                  <div className="recipe-image" style={{
                    height: '180px',
                    background: 'linear-gradient(135deg, #F7DDE2 0%, #DDD6FE 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#4A5568',
                      padding: '0.25rem 1rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {recipe.category}
                    </div>
                  </div>
                  
                  <div className="recipe-content" style={{ padding: '2rem' }}>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      marginBottom: '1rem',
                      color: '#2D3748'
                    }}>
                      {recipe.title}
                    </h3>
                    
                    {recipe.description && (
                      <p style={{ 
                        color: '#718096', 
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        fontStyle: 'italic'
                      }}>
                        {recipe.description}
                      </p>
                    )}
                    
                    <div className="recipe-meta" style={{ 
                      display: 'flex', 
                      gap: '1.5rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {recipe.prepTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#718096' }}>⏱️</span>
                          <span style={{ color: '#718096', fontSize: '0.9rem' }}>Prep: {recipe.prepTime}min</span>
                        </div>
                      )}
                      {recipe.cookTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#718096' }}>🍳</span>
                          <span style={{ color: '#718096', fontSize: '0.9rem' }}>Cook: {recipe.cookTime}min</span>
                        </div>
                      )}
                      {recipe.servings && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#718096' }}>👥</span>
                          <span style={{ color: '#718096', fontSize: '0.9rem' }}>Serves: {recipe.servings}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="recipe-actions" style={{ 
                      display: 'flex', 
                      gap: '0.75rem'
                    }}>
                      <button 
                        className="feature-btn"
                        onClick={() => editRecipe(recipe)}
                        style={{ 
                          flex: 1,
                          padding: '0.75rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        View & Edit
                      </button>
                      <button 
                        onClick={() => deleteRecipe(recipe.id)}
                        style={{
                          width: '44px',
                          background: '#F5F5F5',
                          color: '#718096',
                          border: 'none',
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
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: '0.5' }}>👨‍🍳</div>
              <h3 style={{ marginBottom: '0.5rem', color: '#2D3748' }}>
                Your recipe box is empty
              </h3>
              <p style={{ marginBottom: '2rem', color: '#718096' }}>
                Start collecting recipes that nourish your body and soul
              </p>
              <button 
                className="feature-btn"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                Add Your First Recipe
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeBox;