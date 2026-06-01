import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ onLogout }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userXP, setUserXP] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState(0)
  const [totalRecipes, setTotalRecipes] = useState(0)
  const [profileImage, setProfileImage] = useState(null)
  
  // Datos editables del perfil
  const [goal, setGoal] = useState('Comer saludable')
  const [diet, setDiet] = useState('Sin restricciones')
  const [allergies, setAllergies] = useState('Ninguna')
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingPhoto, setIsEditingPhoto] = useState(false)

  // Logros
  const achievements = [
    { id: 1, name: 'Chef novato', emoji: '👨‍🍳', unlocked: userXP >= 100 },
    { id: 2, name: 'Hidratado', emoji: '💧', unlocked: streak >= 3 },
    { id: 3, name: 'Veggie pro', emoji: '🥗', unlocked: completedChallenges >= 3 },
    { id: 4, name: 'Racha de fuego', emoji: '🔥', unlocked: streak >= 5 },
    { id: 5, name: 'Master chef', emoji: '🏆', unlocked: userXP >= 500 },
    { id: 6, name: 'Recicleta', emoji: '🔄', unlocked: totalRecipes >= 5 },
  ]

  // Fotos predefinidas para elegir
  const avatarOptions = [
    { emoji: '👤', label: 'Default', value: null },
    { emoji: '👨‍🍳', label: 'Chef', value: 'chef' },
    { emoji: '🥗', label: 'Saludable', value: 'healthy' },
    { emoji: '🏋️', label: 'Fit', value: 'fit' },
    { emoji: '🧘', label: 'Zen', value: 'zen' },
    { emoji: '🐱', label: 'Gato', value: 'cat' },
    { emoji: '🐶', label: 'Perro', value: 'dog' },
    { emoji: '🦊', label: 'Zorro', value: 'fox' },
  ]

  useEffect(() => {
    // Cargar datos del usuario
    const savedUser = localStorage.getItem('cookfitUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // Cargar foto de perfil
    const savedImage = localStorage.getItem('cookfit-profile-image')
    if (savedImage) {
      setProfileImage(savedImage)
    }
    
    // Cargar XP y nivel
    const savedXP = localStorage.getItem('cookfit-user-xp')
    if (savedXP) {
      const xp = parseInt(savedXP)
      setUserXP(xp)
      setUserLevel(Math.floor(xp / 100) + 1)
    } else {
      const initialXP = 320
      setUserXP(initialXP)
      setUserLevel(Math.floor(initialXP / 100) + 1)
      localStorage.setItem('cookfit-user-xp', initialXP)
    }
    
    // Cargar racha
    const savedStreak = localStorage.getItem('cookfit-streak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    } else {
      setStreak(5)
    }
    
    // Cargar desafíos completados
    const savedDaily = localStorage.getItem('cookfit-daily')
    if (savedDaily) {
      const daily = JSON.parse(savedDaily)
      const completed = daily.filter(c => c.progress === 100).length
      setCompletedChallenges(completed)
    }
    
    // Cargar recetas completadas
    const savedRecipes = localStorage.getItem('cookfit-completed-recipes')
    if (savedRecipes) {
      const recipes = JSON.parse(savedRecipes)
      setTotalRecipes(recipes.length)
    }
    
    // Cargar preferencias del usuario
    const savedGoal = localStorage.getItem('cookfit-goal')
    if (savedGoal) setGoal(savedGoal)
    const savedDiet = localStorage.getItem('cookfit-diet')
    if (savedDiet) setDiet(savedDiet)
    const savedAllergies = localStorage.getItem('cookfit-allergies')
    if (savedAllergies) setAllergies(savedAllergies)
    
  }, [])

  const savePreferences = () => {
    localStorage.setItem('cookfit-goal', goal)
    localStorage.setItem('cookfit-diet', diet)
    localStorage.setItem('cookfit-allergies', allergies)
    setIsEditing(false)
  }

  const changeProfileImage = (imageValue) => {
    setProfileImage(imageValue)
    localStorage.setItem('cookfit-profile-image', imageValue)
    setIsEditingPhoto(false)
  }

  // Obtener el emoji de la foto actual
  const getCurrentAvatarEmoji = () => {
    if (!profileImage) return '👤'
    const option = avatarOptions.find(opt => opt.value === profileImage)
    return option ? option.emoji : '👤'
  }

  const nextLevelXP = userLevel * 100
  const currentLevelXP = (userLevel - 1) * 100
  const xpProgress = ((userXP - currentLevelXP) / 100) * 100

  const stats = [
    { emoji: '🔥', value: streak, label: 'Racha días', color: '#f97316' },
    { emoji: '⭐', value: userXP, label: 'XP total', color: '#eab308' },
    { emoji: '🍳', value: totalRecipes, label: 'Recetas', color: '#22c55e' },
    { emoji: '🏆', value: completedChallenges, label: 'Retos', color: '#8b5cf6' },
  ]

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d, #22c55e)',
        padding: '44px 20px 30px',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Foto de perfil con botón de edición */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            onClick={() => setIsEditingPhoto(!isEditingPhoto)}
            style={{
              width: 80,
              height: 80,
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 40,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            {getCurrentAvatarEmoji()}
          </div>
          
          {/* Indicador de editar foto */}
          <div
            onClick={() => setIsEditingPhoto(!isEditingPhoto)}
            style={{
              position: 'absolute',
              bottom: 8,
              right: -5,
              background: '#fbbf24',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              cursor: 'pointer',
              border: '2px solid white'
            }}
          >
            ✏️
          </div>
        </div>

        {/* Selector de fotos (aparece al hacer clic) */}
        {isEditingPhoto && (
          <div style={{
            position: 'absolute',
            top: 180,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            borderRadius: 20,
            padding: 16,
            width: 250,
            zIndex: 100,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', textAlign: 'center' }}>Elige tu avatar</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {avatarOptions.map(avatar => (
                <div
                  key={avatar.label}
                  onClick={() => changeProfileImage(avatar.value)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: profileImage === avatar.value ? '#22c55e' : '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: profileImage === avatar.value ? '2px solid #22c55e' : '2px solid transparent'
                  }}
                >
                  {avatar.emoji}
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsEditingPhoto(false)}
              style={{
                marginTop: 12,
                width: '100%',
                padding: 8,
                background: '#f3f4f6',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        )}

        <h2 style={{ color: 'white', margin: 0, fontSize: 22 }}>{user?.email || 'Usuario'}</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4, fontSize: 13 }}>
          Nivel {userLevel} · {userXP >= 500 ? 'Chef Experto' : userXP >= 200 ? 'Chef Intermedio' : 'Chef Novato'}
        </p>
        
        {/* Barra de XP */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
            <span>Nivel {userLevel}</span>
            <span>{userXP}/{nextLevelXP} XP</span>
            <span>Nivel {userLevel + 1}</span>
          </div>
          <div style={{
            height: 8,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 99,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${xpProgress}%`,
              height: '100%',
              background: '#fbbf24',
              borderRadius: 99,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '20px 16px',
        background: 'white',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>{stat.emoji}</div>
            <p style={{ fontWeight: 'bold', fontSize: 18, margin: '4px 0' }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mi información */}
      <div style={{ padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>📋 Mi información</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '6px 12px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              ✏️ Editar
            </button>
          ) : (
            <button
              onClick={savePreferences}
              style={{
                padding: '6px 12px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: 20,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              💾 Guardar
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Objetivo */}
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>🎯</span>
              <span style={{ fontWeight: 600 }}>Objetivo</span>
            </div>
            {isEditing ? (
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: 'white'
                }}
              >
                <option>Comer saludable</option>
                <option>Bajar de peso</option>
                <option>Ganar músculo</option>
                <option>Mantenerme saludable</option>
              </select>
            ) : (
              <p style={{ margin: 0, color: '#333' }}>{goal}</p>
            )}
          </div>

          {/* Dieta */}
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>🥗</span>
              <span style={{ fontWeight: 600 }}>Dieta</span>
            </div>
            {isEditing ? (
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: 'white'
                }}
              >
                <option>Sin restricciones</option>
                <option>Vegetariano</option>
                <option>Vegano</option>
                <option>Sin gluten</option>
                <option>Keto</option>
              </select>
            ) : (
              <p style={{ margin: 0, color: '#333' }}>{diet}</p>
            )}
          </div>

          {/* Alergias */}
          <div style={{ background: '#f9fafb', padding: 14, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span>⚠️</span>
              <span style={{ fontWeight: 600 }}>Alergias</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ej: Frutos secos, lactosa..."
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  background: 'white'
                }}
              />
            ) : (
              <p style={{ margin: 0, color: '#333' }}>{allergies}</p>
            )}
          </div>
        </div>
      </div>

      {/* Logros */}
      <div style={{ padding: '0 16px 20px' }}>
        <h3 style={{ marginBottom: 16 }}>🏅 Logros</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              style={{
                flex: '1 1 calc(33% - 12px)',
                minWidth: 100,
                background: achievement.unlocked ? '#dcfce7' : '#f3f4f6',
                borderRadius: 16,
                padding: 12,
                textAlign: 'center',
                opacity: achievement.unlocked ? 1 : 0.5
              }}
            >
              <div style={{ fontSize: 32 }}>{achievement.emoji}</div>
              <p style={{ fontWeight: 600, fontSize: 12, margin: '8px 0 0' }}>
                {achievement.name}
              </p>
              {!achievement.unlocked && (
                <p style={{ fontSize: 10, color: '#999', marginTop: 4 }}>🔒 Bloqueado</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cerrar sesión */}
      <div style={{ padding: '0 16px 30px' }}>
        <button
          onClick={() => {
            localStorage.removeItem('cookfitUser')
            onLogout()
            navigate('/')
          }}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: 30,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  )
}