import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('cookfitRecipes')
    if (saved) {
      setRecipes(JSON.parse(saved))
    } else {
      import('../data/recipes').then(module => {
        const defaultRecipes = module.RECIPES || []
        setRecipes(defaultRecipes)
      })
    }
  }, [])

  const resultados = searchTerm.trim() === '' ? [] : recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #16a34a, #4ade80)',
        padding: '44px 20px 24px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>Buscar 🔍</h1>
        <p style={{ opacity: 0.9, marginTop: '8px' }}>Encuentra tu próxima receta favorita</p>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '30px',
            border: '1px solid #e5e7eb',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        />

        {searchTerm && (
          <div style={{ marginTop: '24px' }}>
            <p style={{ marginBottom: '16px', color: '#666' }}>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </p>

            {resultados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '20px' }}>
                <div style={{ fontSize: '64px' }}>😢</div>
                <p style={{ color: '#666', marginTop: '12px' }}>No encontramos "{searchTerm}"</p>
                <p style={{ fontSize: '12px', color: '#999' }}>Prueba con otro ingrediente o receta</p>
              </div>
            ) : (
              resultados.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.1s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{recipe.name}</h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666' }}>
                        <span>🍴 {recipe.calories}</span>
                        <span>⏱️ {recipe.time}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#ccc' }}>→</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!searchTerm && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px' }}>🔍</div>
            <p style={{ color: '#999', marginTop: '12px' }}>Escribe algo para buscar recetas</p>
            <p style={{ fontSize: '12px', color: '#ccc' }}>Ej: "pollo", "ensalada", "pasta"</p>
          </div>
        )}
      </div>
    </div>
  )
}