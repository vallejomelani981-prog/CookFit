import { useContext } from 'react'

import {
  Link
} from 'react-router-dom'

import {
  FavoritesContext
} from '../context/FavoritesContext'

export default function Favorites() {

  const {
    favorites,
    setFavorites
  } = useContext(FavoritesContext)

  function remove(name) {

    setFavorites(
      prev =>
        prev.filter(
          f => f.name !== name
        )
    )
  }

  return (

    <div>

      {/* Header */}
      <div style={{
        background:
          'linear-gradient(135deg, #9f1239, #fb7185)',
        padding: '44px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />

        <h1 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 4
        }}>
          Guardados ❤️
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: 14
        }}>
          {favorites.length}
          {' '}
          receta
          {favorites.length !== 1 ? 's' : ''}
          {' '}
          guardada
          {favorites.length !== 1 ? 's' : ''}
        </p>

      </div>

      <div style={{
        padding: '20px 16px'
      }}>

        {favorites.length === 0 ? (

          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>

            <div style={{
              fontSize: 64,
              marginBottom: 16
            }}>
              🤍
            </div>

            <h2 style={{
              fontSize: 20,
              marginBottom: 8
            }}>
              Nada guardado aún
            </h2>

            <p style={{
              color: 'var(--text-3)',
              marginBottom: 24
            }}>
              Presiona el ❤️ en cualquier
              receta para guardarla aquí.
            </p>

            <Link to="/">

              <button
                className="cf-btn-primary"
                style={{
                  maxWidth: 220
                }}
              >
                Explorar recetas
              </button>

            </Link>

          </div>

        ) : (

          favorites.map(recipe => (

            <div
              key={recipe.name}
              className="cf-card"
              style={{
                marginBottom: 16,
                padding: 0,
                overflow: 'hidden',
                borderRadius: '24px'
              }}
            >

              {/* Imagen */}
              <div style={{
                position: 'relative',
                height: 180
              }}>

                <img
                  src={recipe.image}
                  alt={recipe.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)',
                }} />

                {/* Nombre */}
                <p style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 16,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 20,
                  margin: 0,
                }}>
                  {recipe.name}
                </p>

                {/* Remove */}
                <button
                  onClick={() => remove(recipe.name)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.92)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 38,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  ❤️
                </button>

              </div>

              {/* Footer */}
              <div style={{
                padding: 16
              }}>

               <Link to={`/recipe/${recipe.id}`}
                >

                  <button
                    className="cf-btn-primary"
                    style={{
                      fontSize: 14,
                      padding: '12px 20px'
                    }}
                  >
                    Ver receta →
                  </button>

                </Link>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  )
}