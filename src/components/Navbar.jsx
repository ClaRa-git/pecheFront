import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

  return (
    <nav className="sticky top-0 z-20 border-b border-blue-800 bg-blue-700 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold">Pêche3000</Link>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/" className="hover:underline">Boutique</Link>
          <Link to="/contests" className="hover:underline">Concours</Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="hover:underline">Commandes</Link>
              <Link to="/permits" className="hover:underline">Permis</Link>
              <Link to="/my-contests" className="hover:underline">Mes concours</Link>
              <Link to="/cart" className="hover:underline">Panier ({cartCount})</Link>
              <Link to="/profile" className="hover:underline">
                {user?.firstName || 'Profil'}
              </Link>
              {user?.roles?.includes('ROLE_ADMIN') && (
                <Link to="/admin" className="bg-yellow-400 text-black px-3 py-1 rounded font-medium">
                  Admin
                </Link>
              )}
              <button type="button" onClick={logout} className="hover:underline">
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
      </div>
    </nav>
  )
}