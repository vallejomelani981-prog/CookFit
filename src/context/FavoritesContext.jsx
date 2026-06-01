import {
  createContext,
  useEffect,
  useState
} from 'react'

export const FavoritesContext = createContext()

function FavoritesProvider({ children }) {

  const [favorites, setFavorites] = useState(() => {

    const saved =
      localStorage.getItem('cookfitFavorites')

    return saved
      ? JSON.parse(saved)
      : []

  })

  useEffect(() => {

    localStorage.setItem(
      'cookfitFavorites',
      JSON.stringify(favorites)
    )

  }, [favorites])

  return (

    <FavoritesContext.Provider
      value={{
        favorites,
        setFavorites
      }}
    >

      {children}

    </FavoritesContext.Provider>

  )
}

export default FavoritesProvider