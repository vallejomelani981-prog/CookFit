import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function formatTime(secs) {
  if (!secs && secs !== 0) return '0:00'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

// Versión ultra simple del sonido
const playBellSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.value = 0.1
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2)
    osc.stop(ctx.currentTime + 0.2)
    
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
  } catch (e) {
    console.log('Sonido no soportado')
  }
}

export default function Cooking() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [time, setTime] = useState(0)
  
  const intervalRef = useRef(null)

  // Cargar recetas
  useEffect(() => {
    const saved = localStorage.getItem('cookfitRecipes')
    if (saved) {
      setRecipes(JSON.parse(saved))
    } else {
      import('../data/recipes.js').then(module => {
        const defaultRecipes = module.RECIPES || []
        setRecipes(defaultRecipes)
        localStorage.setItem('cookfitRecipes', JSON.stringify(defaultRecipes))
      }).catch(() => {
        setRecipes([])
      })
    }
    setLoading(false)
  }, [])

  const recipe = recipes.find(r => r.id === Number(id))
  const STEPS = recipe?.cookingSteps || recipe?.steps || []

  // Iniciar timer cuando cambia de paso
  useEffect(() => {
    if (STEPS.length > 0 && STEPS[step]) {
      const duration = STEPS[step]?.duration || 0
      setTime(duration)
      setRunning(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [step, STEPS])

  // Timer con sonido al terminar
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!running || time <= 0) {
      return
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setRunning(false)
          
          // Vibrar si es móvil
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(200)
          }
          
          // 🔔 REPRODUCIR SONIDO 🔔
          playBellSound()
          
          if (step < STEPS.length - 1) {
            setStep(step + 1)
          } else {
            setDone(true)
          }
          
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [running, step, STEPS.length])

  /* NOTIFICAR A DESAFÍOS */
  useEffect(() => {
    if (done && recipe) {
      // Verificar si la receta es saludable
      const isHealthy = recipe.tag?.includes('Bajo en calorías') || 
                        recipe.calories?.includes('320') || 
                        recipe.name?.toLowerCase().includes('ensalada')
      
      const recipeData = {
        recipeId: recipe.id,
        recipeName: recipe.name,
        isHealthy: isHealthy,
        timestamp: Date.now()
      }
      localStorage.setItem('cookfit-last-recipe', JSON.stringify(recipeData))
      
      const event = new CustomEvent('recipeCompleted', {
        detail: { 
          recipeId: recipe.id, 
          recipeName: recipe.name,
          isHealthy: isHealthy
        }
      })
      
      window.dispatchEvent(event)
      
      const completedRecipes = JSON.parse(localStorage.getItem('cookfit-completed-recipes') || '[]')
      if (!completedRecipes.includes(recipe.id)) {
        completedRecipes.push(recipe.id)
        localStorage.setItem('cookfit-completed-recipes', JSON.stringify(completedRecipes))
      }
    }
  }, [done, recipe])

  const handleStartPause = () => {
    if (time > 0) {
      setRunning(!running)
    }
  }

  const handleResetTimer = () => {
    setRunning(false)
    if (STEPS[step]?.duration) {
      setTime(STEPS[step].duration)
    }
  }

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  const goPrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const goHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🍳</div>
          <div>Cargando recetas...</div>
        </div>
      </div>
    )
  }

  if (!recipe || STEPS.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: 20,
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>😭</div>
        <h2>Receta no encontrada</h2>
        <button onClick={goHome} style={{ padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '80px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', margin: 0 }}>¡Listo!</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Has completado {recipe.name}</p>
        <button onClick={goHome} style={{ padding: '14px 28px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  const current = STEPS[step]
  const totalDuration = current?.duration || 0
  const progressPercent = totalDuration > 0 ? ((totalDuration - time) / totalDuration) * 100 : 0

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={goHome} style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer' }}>
          ← Salir
        </button>
        <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
          Modo Cocina
        </div>
      </div>

      <h2 style={{ margin: '0 0 5px 0' }}>{recipe.name}</h2>
      <div style={{ color: '#666', marginBottom: '20px' }}>Paso {step + 1} de {STEPS.length}</div>

      {totalDuration > 0 && (
        <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '20px' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#4CAF50', borderRadius: '4px', transition: 'width 0.3s' }} />
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '56px', textAlign: 'center', marginBottom: '12px' }}>{current?.emoji || '👨‍🍳'}</div>
        <h3 style={{ textAlign: 'center', marginBottom: '12px' }}>{current?.title}</h3>
        <p style={{ textAlign: 'center', color: '#444' }}>{current?.desc}</p>
        {current?.tip && (
          <div style={{ backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '12px', marginTop: '16px' }}>
            💡 {current.tip}
          </div>
        )}
      </div>

      {totalDuration > 0 ? (
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '16px' }}>{formatTime(time)}</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={handleStartPause} style={{ padding: '12px 24px', backgroundColor: running ? '#ff9800' : '#4CAF50', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>
              {running ? 'Pausar' : 'Iniciar'}
            </button>
            <button onClick={handleResetTimer} style={{ padding: '12px 24px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>
              Reiniciar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff3e0', borderRadius: '16px', marginBottom: '20px' }}>
          ⏱️ Este paso no tiene temporizador
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={goPrev} disabled={step === 0} style={{ flex: 1, padding: '14px', backgroundColor: step === 0 ? '#e0e0e0' : '#2196F3', color: 'white', border: 'none', borderRadius: '40px', cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
          ← Anterior
        </button>
        <button onClick={goNext} style={{ flex: 1, padding: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>
          {step === STEPS.length - 1 ? 'Terminar' : 'Siguiente →'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
        {STEPS.map((_, idx) => (
          <div key={idx} style={{ width: idx === step ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: idx === step ? '#4CAF50' : '#e0e0e0', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}