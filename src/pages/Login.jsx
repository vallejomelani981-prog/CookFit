import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e) {

    e.preventDefault()

    if (!email || !password) {
      alert('Completa todos los campos')
      return
    }

    localStorage.setItem(
      'cookfitUser',
      JSON.stringify({
        email
      })
    )

    navigate('/')
    window.location.reload()
  }

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.logo}>
          CookFit
        </h1>

        <p style={styles.subtitle}>
          Tu camino saludable comienza hoy
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Iniciar sesión
          </button>

        </form>

      </div>

    </div>
  )
}

const styles = {

  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background:
      'linear-gradient(to bottom, #dcfce7, #f0fdf4)'
  },

  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'white',
    padding: '30px',
    borderRadius: '28px',
    boxShadow:
      '0 8px 30px rgba(0,0,0,0.08)'
  },

  logo: {
    textAlign: 'center',
    color: '#16a34a',
    fontSize: '40px',
    marginBottom: '10px',
    fontWeight: '700'
  },

  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '30px'
  },

  input: {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none'
  },

  button: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '14px',
    backgroundColor: '#16a34a',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }

}

export default Login