import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/api'
import { useCartStore } from '../store/cartStore'
import { formatPrice, mapProduct, readArrayPayload } from '../utils/apiHelpers'

export default function Shop() {
  const addItem = useCartStore((state) => state.addItem)

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ search: '', category: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getAll(),
          productService.getCategories().catch(() => ({ data: [] })),
        ])

        const mappedProducts = readArrayPayload(productsRes.data).map(mapProduct)
        const apiCategories = readArrayPayload(categoriesRes.data)

        setProducts(mappedProducts)

        if (apiCategories.length > 0) {
          setCategories(apiCategories.map((c) => (typeof c === 'string' ? c : c.name)))
        } else {
          const fromProducts = [...new Set(mappedProducts.map((p) => p.category))]
          setCategories(fromProducts)
        }
      } catch {
        setError('Impossible de charger les produits pour le moment.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const search = filters.search.trim().toLowerCase()
      const inSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      const inCategory = !filters.category || product.category === filters.category

      return inSearch && inCategory
    })
  }, [products, filters])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Boutique d'articles de peche</h1>
          <p className="text-slate-500">Choisissez votre materiel et commandez en ligne.</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full md:w-72 rounded-lg border border-slate-300 px-3 py-2"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">Toutes categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-slate-500">Chargement des produits...</p>}
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-40 items-center justify-center rounded bg-slate-100 text-slate-400">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded object-cover" />
                ) : (
                  <span>Image indisponible</span>
                )}
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{product.category}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-800">{product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.description || 'Aucune description.'}</p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-emerald-700">{formatPrice(product.price)}</p>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture'}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/products/${product.id}`}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
                >
                  Details
                </Link>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => addItem(product, 1)}
                  className="flex-1 rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Ajouter
                </button>
              </div>
            </article>
          ))}

          {visibleProducts.length === 0 && (
            <p className="col-span-full rounded border border-dashed border-slate-300 p-6 text-center text-slate-500">
              Aucun produit ne correspond a votre recherche.
            </p>
          )}
        </div>
      )}
    </section>
  )
}