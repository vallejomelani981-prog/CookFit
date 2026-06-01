import { useState, useEffect } from 'react'
import { RECIPES } from '../data/recipes'

export default function Admin() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('cookfitRecipes')
    return saved ? JSON.parse(saved) : RECIPES
  })

  useEffect(() => {
    localStorage.setItem('cookfitRecipes', JSON.stringify(recipes))
  }, [recipes])

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    calories: '',
    protein: '',
    time: '',
    tag: '',
    image: '',
    description: '',
  })

  const [editingId, setEditingId] = useState(null)

  /* INGREDIENTES */
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState([])

  /* 🔥 NUEVO: PASOS CON DURACIÓN Y TIP */
  const [cookingSteps, setCookingSteps] = useState([])
  const [stepTitle, setStepTitle] = useState('')
  const [stepDesc, setStepDesc] = useState('')
  const [stepDuration, setStepDuration] = useState('')
  const [stepTip, setStepTip] = useState('')
  const [stepEmoji, setStepEmoji] = useState('👨‍🍳')

  function addCookingStep() {
    if (!stepTitle.trim() || !stepDesc.trim()) {
      alert('Completa título y descripción del paso 😭')
      return
    }

    const durationNum = parseInt(stepDuration) || 10 // Si no pone, default 10 segundos

    const newStep = {
      title: stepTitle,
      desc: stepDesc,
      duration: durationNum,
      tip: stepTip || '',
      emoji: stepEmoji || '🍳',
    }

    setCookingSteps([...cookingSteps, newStep])
    
    // Resetear campos
    setStepTitle('')
    setStepDesc('')
    setStepDuration('')
    setStepTip('')
    setStepEmoji('👨‍🍳')
  }

  function removeCookingStep(index) {
    setCookingSteps(cookingSteps.filter((_, i) => i !== index))
  }

  function addIngredient() {
    if (!ingredientInput.trim()) return
    setIngredients([...ingredients, ingredientInput])
    setIngredientInput('')
  }

  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  function handleChange(e) {
    setNewRecipe({
      ...newRecipe,
      [e.target.name]: e.target.value,
    })
  }

  function addOrUpdateRecipe() {
    if (!newRecipe.name || !newRecipe.image) {
      alert('Completa mínimo nombre e imagen 😭')
      return
    }

    if (cookingSteps.length === 0) {
      alert('Agrega al menos un paso de cocción 🍳')
      return
    }

    if (editingId) {
      const updated = recipes.map(r =>
        r.id === editingId
          ? {
              ...r,
              ...newRecipe,
              ingredients,
              cookingSteps: cookingSteps,
            }
          : r
      )
      setRecipes(updated)
      setEditingId(null)
      alert('Receta actualizada 🔥')
    } else {
      const recipe = {
        id: Date.now(),
        ...newRecipe,
        ingredients,
        cookingSteps: cookingSteps,
      }
      setRecipes([...recipes, recipe])
      alert('Receta agregada 🔥')
    }

    // Resetear todo
    setNewRecipe({
      name: '',
      calories: '',
      protein: '',
      time: '',
      tag: '',
      image: '',
      description: '',
    })
    setIngredients([])
    setCookingSteps([])
    setIngredientInput('')
  }

  function editRecipe(recipe) {
    setEditingId(recipe.id)
    setNewRecipe({
      name: recipe.name || '',
      calories: recipe.calories || '',
      protein: recipe.protein || '',
      time: recipe.time || '',
      tag: recipe.tag || '',
      image: recipe.image || '',
      description: recipe.description || '',
    })
    setIngredients(recipe.ingredients || [])
    setCookingSteps(recipe.cookingSteps || [])
  }

  function deleteRecipe(id) {
    const ok = window.confirm('¿Eliminar receta? 😭')
    if (!ok) return
    setRecipes(recipes.filter(r => r.id !== id))
  }

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg,#1a2e1c,#15803d)',
        padding: '44px 20px 24px',
      }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>
          Admin ⚙️
        </h1>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h2>{editingId ? 'Editar receta ✏️' : 'Agregar receta'}</h2>

          {/* Campos básicos */}
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="name" 
            placeholder="Nombre" 
            value={newRecipe.name} 
            onChange={handleChange} 
          />
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="calories" 
            placeholder="Calorías (ej: 320 kcal)" 
            value={newRecipe.calories} 
            onChange={handleChange} 
          />
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="protein" 
            placeholder="Proteína (ej: 18g)" 
            value={newRecipe.protein} 
            onChange={handleChange} 
          />
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="time" 
            placeholder="Tiempo total (ej: 10 min)" 
            value={newRecipe.time} 
            onChange={handleChange} 
          />
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="tag" 
            placeholder="Tag (ej: Bajo en calorías)" 
            value={newRecipe.tag} 
            onChange={handleChange} 
          />
          <input 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            name="image" 
            placeholder="URL de la imagen" 
            value={newRecipe.image} 
            onChange={handleChange} 
          />

          <textarea
            name="description"
            placeholder="Descripción de la receta"
            value={newRecipe.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              minHeight: '90px',
              marginBottom: '10px',
            }}
          />

          {/* INGREDIENTES */}
          <h3>🥕 Ingredientes</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: '10px' }}>
            <input
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
              placeholder="Ej: Pechuga de pollo"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
            />
            <button style={{ padding: '12px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }} onClick={addIngredient}>
              ➕ Agregar
            </button>
          </div>
          
          {ingredients.map((ing, i) => (
            <div key={i} style={{ padding: '8px', backgroundColor: '#f5f5f5', marginBottom: '5px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>🥕 {ing}</span>
              <button onClick={() => removeIngredient(i)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red' }}>❌</button>
            </div>
          ))}

          {/* 🔥 NUEVO: PASOS DE COCCIÓN CON DURACIÓN */}
          <h3 style={{ marginTop: '20px' }}>🍳 Pasos de cocción (con temporizador)</h3>
          
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
            <input
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Título del paso (ej: Hervir agua)"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
            />
            <input
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Descripción (ej: Pon agua a hervir con sal)"
              value={stepDesc}
              onChange={(e) => setStepDesc(e.target.value)}
            />
            <input
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              type="number"
              placeholder="Duración en segundos (ej: 120 = 2 minutos)"
              value={stepDuration}
              onChange={(e) => setStepDuration(e.target.value)}
            />
            <input
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Tip o consejo (opcional)"
              value={stepTip}
              onChange={(e) => setStepTip(e.target.value)}
            />
            <input
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Emoji (opcional, ej: 🍝)"
              value={stepEmoji}
              onChange={(e) => setStepEmoji(e.target.value)}
            />
            <button onClick={addCookingStep} style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              ➕ Agregar este paso
            </button>
          </div>

          {cookingSteps.map((step, i) => (
            <div key={i} style={{ 
              padding: '12px', 
              backgroundColor: '#e3f2fd', 
              marginBottom: '8px', 
              borderRadius: '8px',
              borderLeft: '4px solid #4CAF50'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{step.emoji} {step.title}</strong>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{step.desc}</p>
                  <small>⏱️ {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}</small>
                  {step.tip && <small style={{ display: 'block' }}>💡 {step.tip}</small>}
                </div>
                <button onClick={() => removeCookingStep(i)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red', fontSize: '20px' }}>❌</button>
              </div>
            </div>
          ))}

          <button onClick={addOrUpdateRecipe} style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            {editingId ? 'Guardar cambios' : 'Agregar receta'}
          </button>
        </div>

        {/* Lista de recetas existentes */}
        <div style={{ marginTop: '30px' }}>
          <h3>📋 Recetas existentes</h3>
          {recipes.map(recipe => (
            <div key={recipe.id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '15px',
              marginBottom: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{recipe.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {recipe.cookingSteps?.length || 0} pasos | {recipe.time}
                  </div>
                </div>
                <div>
                  <button onClick={() => editRecipe(recipe)} style={{ marginRight: '8px', padding: '6px 12px', cursor: 'pointer' }}>✏️</button>
                  <button onClick={() => deleteRecipe(recipe.id)} style={{ padding: '6px 12px', cursor: 'pointer', color: 'red' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}