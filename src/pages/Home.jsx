import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'

import { FavoritesContext } from '../context/FavoritesContext'
import { RECIPES } from '../data/recipes'

const CATEGORIES = [
  { emoji: '🥗', label: 'Bajo en calorías', color: '#dcfce7', accent: '#16a34a' },
  { emoji: '🍗', label: 'Alto en proteína', color: '#fef9c3', accent: '#ca8a04' },
  { emoji: '🥤', label: 'Smoothies', color: '#e0f2fe', accent: '#0284c7' },
  { emoji: '🍝', label: 'Pasta', color: '#fce7f3', accent: '#db2777' },
  { emoji: '🍳', label: 'Rápidas', color: '#ede9fe', accent: '#7c3aed' },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días ☀️'
  if (hour < 19) return 'Buenas tardes 🌿'
  return 'Buenas noches 🌙'
}

function StatChip({ emoji, value, label }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(10px)',
      borderRadius: 20,
      padding: '12px 8px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.15)',
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <p style={{ color: '#fff', fontSize: 17, fontWeight: 800, margin: 0 }}>{value}</p>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, margin: 0 }}>{label}</p>
    </div>
  )
}

function RecipeCard({ recipe, isFav, onToggleFav }) {
  return (
    <div
      className="cf-card anim-fadeUp"
      style={{
        padding: 0,
        overflow: 'hidden',
        marginBottom: 18,
      }}
    >
      <div style={{
        position: 'relative',
        height: 190,
      }}>
        <img
          src={recipe.image}
          alt={recipe.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)',
        }} />
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
        }}>
          <span className="cf-badge">
            {recipe.tag}
          </span>
        </div>
        <button
          onClick={() => onToggleFav(recipe)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          right: 14,
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: 21,
            fontWeight: 800,
            marginBottom: 8,
          }}>
            {recipe.name}
          </h3>
          <div style={{
            display: 'flex',
            gap: 8,
          }}>
            {[
              `🔥 ${recipe.calories}`,
              `💪 ${recipe.protein}`,
              `⏱ ${recipe.time}`,
            ].map(item => (
              <div
                key={item}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(6px)',
                  padding: '5px 10px',
                  borderRadius: 999,
                  fontSize: 11,
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{
        padding: 14,
      }}>
        <Link to={`/recipe/${recipe.id}`}>
          <button
            className="cf-btn-primary"
            style={{
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Ver receta →
          </button>
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  const { favorites, setFavorites } = useContext(FavoritesContext)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  function toggleFavorite(recipe) {
    const exists = favorites.find(f => f.id === recipe.id)
    setFavorites(
      exists
        ? favorites.filter(f => f.id !== recipe.id)
        : [...favorites, recipe]
    )
  }

  const storedRecipes = JSON.parse(localStorage.getItem('cookfitRecipes'))
  const allRecipes = storedRecipes || RECIPES

  // Función para mapear categoría a tag real
  const getTagFromCategory = (category) => {
    switch (category) {
      case 'Bajo en calorías': return 'Bajo en calorías'
      case 'Alto en proteína': return 'Alto en proteína'
      case 'Pasta': return null // filtra por nombre
      case 'Rápidas': return null // filtra por tiempo
      case 'Smoothies': return null // filtra por nombre
      default: return category
    }
  }

  const filtered = allRecipes.filter(r => {
    // Filtro por búsqueda
    const matchesSearch = r.name.toLowerCase().includes(query.toLowerCase())
    
    // Filtro por categoría
    let matchesCategory = true
    if (selectedCategory) {
      switch (selectedCategory) {
        case 'Bajo en calorías':
          matchesCategory = r.tag === 'Bajo en calorías'
          break
        case 'Alto en proteína':
          matchesCategory = r.tag === 'Alto en proteína'
          break
        case 'Pasta':
          matchesCategory = r.name.toLowerCase().includes('pasta')
          break
        case 'Rápidas':
          matchesCategory = r.time === '10 min' || r.time === '15 min'
          break
        case 'Smoothies':
          matchesCategory = r.name.toLowerCase().includes('smoothie') || r.name.toLowerCase().includes('batido')
          break
        default:
          matchesCategory = true
      }
    }
    
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{
      paddingBottom: 24,
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #15803d 0%, #22c55e 60%, #4ade80 100%)',
        padding: '46px 20px 30px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <p style={{
          color: 'rgba(255,255,255,0.82)',
          fontSize: 14,
          marginBottom: 4,
        }}>
          {getGreeting()}
        </p>
        <h1 style={{
          color: '#fff',
          fontSize: 30,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 18,
        }}>
          Descubre recetas
          <br />
          deliciosas 😋
        </h1>
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 22,
        }}>
          <StatChip emoji="🔥" value="5" label="Racha" />
          <StatChip emoji="⭐" value="320" label="XP" />
          <StatChip emoji="🏆" value="2/4" label="Retos" />
        </div>
        <div className="cf-input-wrap">
          <span className="cf-input-icon">🔍</span>
          <input
            className="cf-input"
            type="text"
            placeholder="Buscar recetas..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.94)',
            }}
          />
        </div>
      </div>

      <div style={{
        padding: '22px 16px 0',
      }}>
        <div style={{
          marginBottom: 28,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p className="cf-section-title" style={{ margin: 0 }}>Categorías</p>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#22c55e', 
                  fontSize: 12, 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Limpiar ✕
              </button>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 4,
          }}>
            {CATEGORIES.map(cat => (
              <div
                key={cat.label}
                onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                style={{
                  minWidth: 90,
                  padding: '14px 10px',
                  textAlign: 'center',
                  background: cat.color,
                  borderRadius: 20,
                  cursor: 'pointer',
                  border: selectedCategory === cat.label ? `2px solid ${cat.accent}` : '2px solid transparent',
                  transition: 'all 0.2s',
                  opacity: selectedCategory && selectedCategory !== cat.label ? 0.6 : 1,
                }}
              >
                <div style={{
                  fontSize: 28,
                  marginBottom: 6,
                }}>
                  {cat.emoji}
                </div>
                <p style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: cat.accent,
                  margin: 0,
                }}>
                  {cat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/challenges"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="cf-card"
            style={{
              marginBottom: 26,
              background: 'linear-gradient(120deg, #fef3c7, #fde68a)',
            }}
          >
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#92400e',
              marginBottom: 4,
            }}>
              🏆 RETO DEL DÍA
            </p>
            <h3 style={{
              fontSize: 17,
              color: '#78350f',
              marginBottom: 10,
            }}>
              Tomar 2L de agua 💧
            </h3>
            <div style={{
              height: 8,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 999,
              overflow: 'hidden',
            }}>
              <div style={{
                width: '75%',
                height: '100%',
                background: '#f59e0b',
              }} />
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="cf-section-title" style={{ margin: 0 }}>
            Trending Recipes 🔥
          </p>
          {selectedCategory && (
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 'bold' }}>
              {filtered.length} encontradas
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#f9f9f9',
            borderRadius: 24,
          }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>😢</div>
            <p style={{ color: 'var(--text-3)', fontSize: 16, marginBottom: 16 }}>
              No encontramos recetas
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null)
                setQuery('')
              }}
              style={{
                padding: '10px 24px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: 30,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFav={!!favorites.find(f => f.id === recipe.id)}
              onToggleFav={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  )
}