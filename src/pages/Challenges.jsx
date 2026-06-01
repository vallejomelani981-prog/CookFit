import { useState, useEffect } from 'react'

// Desafíos de cocina (permanentes)
const COOKING_CHALLENGES = [
  {
    id: 101,
    title: 'Primera receta 🍳',
    description: 'Completa tu primera receta en el modo cocina',
    progress: 0,
    current: 0,
    target: 1,
    xp: 100,
    emoji: '🎯',
    color: '#f59e0b',
    bg: '#fef9c3',
    completed: false,
  },
  {
    id: 102,
    title: 'Chef principiante 👨‍🍳',
    description: 'Completa 5 recetas diferentes',
    progress: 0,
    current: 0,
    target: 5,
    xp: 250,
    emoji: '⭐',
    color: '#ef4444',
    bg: '#fee2e2',
    completed: false,
  },
  {
    id: 103,
    title: 'Maestro chef 🏆',
    description: 'Completa 10 recetas',
    progress: 0,
    current: 0,
    target: 10,
    xp: 500,
    emoji: '🏆',
    color: '#8b5cf6',
    bg: '#ede9fe',
    completed: false,
  },
]

// Desafíos diarios
const DAILY_CHALLENGES = [
  {
    id: 1,
    title: 'Tomar 2L de agua',
    emoji: '💧',
    progress: 0,
    xp: 50,
    color: '#0ea5e9',
    bg: '#e0f2fe',
    steps: ['Vaso en la mañana', 'Vaso antes de almorzar', 'Vaso en la tarde', 'Vaso en la noche'],
    done: [],
  },
  {
    id: 2,
    title: 'Comer verduras hoy',
    emoji: '🥦',
    progress: 0,
    xp: 40,
    color: '#16a34a',
    bg: '#dcfce7',
    steps: ['Ensalada en el almuerzo', 'Verdura en la cena'],
    done: [],
  },
]

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('daily')
  const [dailyChallenges, setDailyChallenges] = useState([])
  const [cookingChallenges, setCookingChallenges] = useState([])
  const [totalXP, setTotalXP] = useState(0)

  // Cargar datos al iniciar
  useEffect(() => {
    // Cargar desafíos diarios
    const savedDaily = localStorage.getItem('cookfit-daily')
    if (savedDaily) {
      setDailyChallenges(JSON.parse(savedDaily))
    } else {
      setDailyChallenges(DAILY_CHALLENGES)
    }

    // Cargar desafíos de cocina
    const savedCooking = localStorage.getItem('cookfit-cooking')
    if (savedCooking) {
      setCookingChallenges(JSON.parse(savedCooking))
    } else {
      setCookingChallenges(COOKING_CHALLENGES)
    }
  }, [])

  // Guardar y calcular XP cuando cambian
  useEffect(() => {
    if (dailyChallenges.length > 0) {
      localStorage.setItem('cookfit-daily', JSON.stringify(dailyChallenges))
    }
    if (cookingChallenges.length > 0) {
      localStorage.setItem('cookfit-cooking', JSON.stringify(cookingChallenges))
    }
    
    const dailyXP = dailyChallenges.reduce((acc, c) => acc + (c.progress === 100 ? c.xp : 0), 0)
    const cookingXP = cookingChallenges.reduce((acc, c) => acc + (c.progress === 100 ? c.xp : 0), 0)
    setTotalXP(dailyXP + cookingXP)
  }, [dailyChallenges, cookingChallenges])

  // Escuchar recetas completadas
  useEffect(() => {
    const handleRecipeCompleted = (event) => {
      console.log('🎉 Receta completada!', event.detail)
      const { recipeId } = event.detail
      updateCookingProgress(recipeId)
    }

    window.addEventListener('recipeCompleted', handleRecipeCompleted)
    
    // También revisar localStorage por si acaso
    const checkLocalStorage = setInterval(() => {
      const lastRecipe = localStorage.getItem('cookfit-last-recipe')
      if (lastRecipe) {
        const recipe = JSON.parse(lastRecipe)
        updateCookingProgress(recipe.recipeId)
        localStorage.removeItem('cookfit-last-recipe')
      }
    }, 1000)

    return () => {
      window.removeEventListener('recipeCompleted', handleRecipeCompleted)
      clearInterval(checkLocalStorage)
    }
  }, [])

  const updateCookingProgress = (recipeId) => {
    setCookingChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.completed) return challenge
        
        let newCurrent = challenge.current + 1
        let newProgress = Math.min((newCurrent / challenge.target) * 100, 100)
        let newCompleted = newProgress === 100
        
        if (newCompleted && !challenge.completed) {
          setTimeout(() => {
            showNotification(`🎉 ¡${challenge.title}! +${challenge.xp} XP`, challenge.emoji)
          }, 100)
        }
        
        return {
          ...challenge,
          current: newCurrent,
          progress: newProgress,
          completed: newCompleted,
        }
      })
      return updated
    })
  }

  const toggleDailyStep = (challengeId, stepIndex) => {
    setDailyChallenges(prev => {
      return prev.map(challenge => {
        if (challenge.id !== challengeId) return challenge
        
        const newDone = [...challenge.done]
        const index = newDone.indexOf(stepIndex)
        
        if (index === -1) {
          newDone.push(stepIndex)
          newDone.sort()
        } else {
          newDone.splice(index, 1)
        }
        
        const newProgress = Math.round((newDone.length / challenge.steps.length) * 100)
        const wasCompleted = challenge.progress === 100
        const isNowCompleted = newProgress === 100
        
        if (!wasCompleted && isNowCompleted) {
          setTimeout(() => {
            showNotification(`🎉 ¡${challenge.title} completado! +${challenge.xp} XP`, challenge.emoji)
          }, 100)
        }
        
        return { ...challenge, done: newDone, progress: newProgress }
      })
    })
  }

  const showNotification = (message, emoji) => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      padding: 12px 20px;
      border-radius: 40px;
      font-weight: bold;
      z-index: 1000;
      animation: slideUp 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      white-space: nowrap;
    `
    notification.innerHTML = `<span style="font-size: 20px">${emoji}</span> ${message}`
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 2500)
  }

  const completedDaily = dailyChallenges.filter(c => c.progress === 100).length
  const completedCooking = cookingChallenges.filter(c => c.completed).length
  const totalChallenges = dailyChallenges.length + cookingChallenges.length

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        padding: '44px 20px 24px',
      }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 }}>Retos 🏆</h1>
        
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18 }}>✅</div>
            <p style={{ fontWeight: 800, fontSize: 14, color: '#fff', margin: 0 }}>{completedDaily + completedCooking}/{totalChallenges}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Completados</p>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18 }}>⭐</div>
            <p style={{ fontWeight: 800, fontSize: 14, color: '#fff', margin: 0 }}>{totalXP} XP</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Ganados</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', padding: '16px 16px 0', gap: 8 }}>
        <button onClick={() => setActiveTab('daily')} style={{
          flex: 1, padding: '12px', border: 'none', background: activeTab === 'daily' ? '#fbbf24' : '#f3f4f6',
          color: activeTab === 'daily' ? '#fff' : '#666', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer'
        }}>📅 Diarios</button>
        <button onClick={() => setActiveTab('cooking')} style={{
          flex: 1, padding: '12px', border: 'none', background: activeTab === 'cooking' ? '#fbbf24' : '#f3f4f6',
          color: activeTab === 'cooking' ? '#fff' : '#666', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer'
        }}>🍳 Cocina</button>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {activeTab === 'daily' && dailyChallenges.map(c => (
          <div key={c.id} style={{ background: 'white', borderRadius: 20, marginBottom: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{c.title}</p>
                  <span style={{ fontSize: 11, background: c.bg, padding: '3px 8px', borderRadius: 99 }}>{c.progress}%</span>
                </div>
                <div style={{ height: 7, background: '#e5e7eb', borderRadius: 99, marginTop: 8 }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: c.color, borderRadius: 99 }} />
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 16px', background: '#f9fafb' }}>
              {c.steps.map((step, i) => (
                <div key={i} onClick={() => toggleDailyStep(c.id, i)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: c.done.includes(i) ? '#22c55e' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.done.includes(i) ? <span style={{ color: '#fff' }}>✓</span> : <span style={{ fontSize: 11 }}>{i + 1}</span>}
                  </div>
                  <p style={{ fontSize: 13, margin: 0, textDecoration: c.done.includes(i) ? 'line-through' : 'none', color: c.done.includes(i) ? '#9ca3af' : '#374151' }}>{step}</p>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '8px', background: 'rgba(251,191,36,0.15)', borderRadius: 12 }}>
                ⭐ +{c.xp} XP
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'cooking' && cookingChallenges.map(c => (
          <div key={c.id} style={{ background: 'white', borderRadius: 20, marginBottom: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', opacity: c.completed ? 0.8 : 1 }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{c.title}</p>
                  <span style={{ fontSize: 11, background: c.bg, padding: '3px 8px', borderRadius: 99 }}>{c.completed ? '✓ Listo' : `${c.current}/${c.target}`}</span>
                </div>
                <div style={{ height: 7, background: '#e5e7eb', borderRadius: 99, marginTop: 8 }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: c.color, borderRadius: 99 }} />
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 16px', background: '#f9fafb' }}>
              <p style={{ fontSize: 13, marginBottom: 8 }}>{c.description}</p>
              <div style={{ marginTop: 8, padding: '8px', background: c.completed ? '#dcfce7' : 'rgba(251,191,36,0.15)', borderRadius: 12 }}>
                🏆 {c.completed ? 'Completado' : `Progreso: ${c.current}/${c.target}`} | ⭐ +{c.xp} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}