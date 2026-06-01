import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // 👈 SOLO AQUÍ

import './index.css'
import App from './App.jsx'
import FavoritesProvider from './context/FavoritesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* 👈 BrowserRouter SOLO AQUÍ */}
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </React.StrictMode>
)