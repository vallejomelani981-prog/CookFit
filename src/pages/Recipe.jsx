import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'

export default function Recipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favorites, setFavorites } = useContext(FavoritesContext)
  
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 👈 SOLO leer de localStorage (lo que guarda el Admin)
    const saved = localStorage.getItem('cookfitRecipes')
    if (saved) {
      const recipes = JSON.parse(saved)
      const found = recipes.find(r => r.id === Number(id))
      setRecipe(found)
    }
    setLoading(false)
  }, [id])

  const isFav = recipe ? favorites.find(f => f.id === recipe.id) : false

  const toggleFavorite = () => {
    if (!recipe) return
    if (isFav) {
      setFavorites(favorites.filter(f => f.id !== recipe.id))
    } else {
      setFavorites([...favorites, recipe])
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px' }}>🍳</div>
          <p>Cargando receta...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: 20 }}>😭</div>
        <h2>Receta no encontrada</h2>
        <p>La receta que buscas no existe o fue eliminada</p>
        <button onClick={() => navigate('/')} style={{ marginTop: 20, padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header con imagen */}
      <div style={{ position: 'relative', height: 280 }}>
        <img
          src={recipe.image}
          alt={recipe.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => e.target.src = 'https://via.placeholder.com/400x280?text=Sin+imagen'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
        }} />
        
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 50,
            left: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>

        <button
          onClick={toggleFavorite}
          style={{
            position: 'absolute',
            top: 50,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>

        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <span style={{
            background: '#4CAF50',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            color: 'white',
            display: 'inline-block',
            marginBottom: 10
          }}>
            {recipe.tag || 'Saludable'}
          </span>
          <h1 style={{ color: 'white', margin: 0, fontSize: 28 }}>{recipe.name}</h1>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 16,
        padding: '20px 16px',
        background: 'white',
        borderBottom: '1px solid #f0f0f0',
        justifyContent: 'space-around'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20 }}>🔥</div>
          <div style={{ fontWeight: 'bold' }}>{recipe.calories}</div>
          <div style={{ fontSize: 11, color: '#666' }}>calorías</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20 }}>💪</div>
          <div style={{ fontWeight: 'bold' }}>{recipe.protein}</div>
          <div style={{ fontSize: 11, color: '#666' }}>proteína</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20 }}>⏱️</div>
          <div style={{ fontWeight: 'bold' }}>{recipe.time}</div>
          <div style={{ fontSize: 11, color: '#666' }}>tiempo</div>
        </div>
      </div>

      {/* Descripción */}
      <div style={{ padding: '20px 16px' }}>
        <h3 style={{ marginBottom: 8 }}>📝 Descripción</h3>
        <p style={{ color: '#666', lineHeight: 1.5 }}>{recipe.description}</p>
      </div>

      {/* Ingredientes */}
      <div style={{ padding: '0 16px 20px' }}>
        <h3 style={{ marginBottom: 12 }}>🥕 Ingredientes</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(recipe.ingredients || []).map((ing, i) => (
            <span key={i} style={{
              background: '#f5f5f5',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              color: '#333'
            }}>
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Preparación */}
      <div style={{ padding: '0 16px 20px' }}>
        <h3 style={{ marginBottom: 12 }}>🍳 Preparación</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(recipe.cookingSteps || recipe.steps || []).map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 28,
                height: 28,
                background: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                flexShrink: 0
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{step.title || step}</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>{step.desc || step}</p>
                {step.tip && (
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#22c55e' }}>💡 {step.tip}</p>
                )}
                {step.duration && (
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#999' }}>⏱️ {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón modo cocina */}
      <div style={{ padding: '0 16px 30px' }}>
        <button
          onClick={() => navigate(`/cooking/${recipe.id}`)}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          🍳 Empezar a cocinar
        </button>
      </div>
    </div>
  )
}