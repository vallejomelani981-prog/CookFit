import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Home from './pages/Home'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Challenges from './pages/Challenges'
import Profile from './pages/Profile'
import Recipe from './pages/Recipe'
import Cooking from './pages/Cooking'
import Admin from './pages/Admin'

/* ───────────────────────────────────────────── */
/* SPLASH SCREEN */
/* ───────────────────────────────────────────── */
function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #16a34a, #4ade80)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <div style={{
        fontSize: 80,
        marginBottom: 20,
        animation: 'bounce 1s ease-in-out infinite'
      }}>
        🥗
      </div>
      <h1 style={{
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        margin: 0,
        letterSpacing: 2
      }}>
        CookFit
      </h1>
      <p style={{
        color: 'rgba(255,255,255,0.8)',
        marginTop: 10,
        fontSize: 14
      }}>
        Tu cocina saludable
      </p>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

/* ───────────────────────────────────────────── */
/* LOGIN */
/* ───────────────────────────────────────────── */
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    localStorage.setItem(
      'cookfitUser',
      JSON.stringify({ email })
    )
    onLogin()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #16a34a, #4ade80)',
      padding: 20,
    }}>
      <div
        className="cf-card"
        style={{
          width: '100%',
          maxWidth: 340,
          textAlign: 'center',
          padding: 28,
        }}
      >
        <div style={{ fontSize: 58, marginBottom: 12 }}>🥗</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>CookFit</h1>
        <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Tu app saludable favorita</p>
        <input
          className="cf-input"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <input
          className="cf-input"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 18 }}
        />
        <button className="cf-btn-primary" onClick={handleLogin}>
          Iniciar sesión
        </button>
        <p style={{ fontSize: 11, color: '#999', marginTop: 16 }}>
          Demo: cualquier email y contraseña
        </p>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────── */
/* NAVBAR */
/* ───────────────────────────────────────────── */
function Navbar() {
  const user = JSON.parse(localStorage.getItem('cookfitUser'))

  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontSize: 24,
    opacity: isActive ? 1 : 0.55,
    transform: isActive ? 'scale(1.12)' : 'scale(1)',
    transition: '0.2s',
  })

  return (
    <nav style={{
      position: 'fixed',
      bottom: 14,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: 430,
      height: 72,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: 28,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 999,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    }}>
      <NavLink to="/" style={linkStyle}>🏠</NavLink>
      <NavLink to="/search" style={linkStyle}>🔍</NavLink>
      <NavLink to="/favorites" style={linkStyle}>❤️</NavLink>
      <NavLink to="/challenges" style={linkStyle}>🏆</NavLink>
      <NavLink to="/profile" style={linkStyle}>👤</NavLink>
      {user?.email === 'admin@cookfit.com' && (
        <NavLink to="/admin" style={linkStyle}>⚙️</NavLink>
      )}
    </nav>
  )
}

/* ───────────────────────────────────────────── */
/* APP */
/* ───────────────────────────────────────────── */
function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('cookfitUser'))
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  if (!logged) {
    return <Login onLogin={() => setLogged(true)} />
  }

  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100vh',
      background: 'var(--bg)',
      paddingBottom: 110,
      boxShadow: '0 0 30px rgba(0,0,0,0.04)',
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/profile" element={<Profile onLogout={() => {
          localStorage.removeItem('cookfitUser')
          setLogged(false)
        }} />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/cooking/:id" element={<Cooking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Navbar />
    </div>
  )
}

export default App