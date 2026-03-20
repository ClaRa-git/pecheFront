import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🎣 Pêche3000</Link>
      <div className="flex gap-4 items-center">
        <Link to="/contests" className="hover:underline">Concours</Link>
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="hover:underline">Panier</Link>
            <Link to="/profile" className="hover:underline">
              {user?.firstName}
            </Link>
            {user?.roles?.includes('ROLE_ADMIN') && (
              <Link to="/admin" className="bg-yellow-400 text-black px-3 py-1 rounded font-medium">
                Admin
              </Link>
            )}
            <button onClick={logout} className="hover:underline">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Connexion</Link>
            <Link to="/register" className="bg-white text-blue-700 px-3 py-1 rounded font-medium">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}