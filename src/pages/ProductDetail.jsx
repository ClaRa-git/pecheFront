import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productService } from '../services/api'
import { useCartStore } from '../store/cartStore'
import { formatPrice, mapProduct, readObjectPayload } from '../utils/apiHelpers'

export default function ProductDetail() {
    const { id } = useParams()
    const addItem = useCartStore((state) => state.addItem)

    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')

            try {
                const res = await productService.getOne(id)
                const mapped = mapProduct(readObjectPayload(res.data) || {})
                setProduct(mapped)
            } catch {
                setError('Produit introuvable ou indisponible.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [id])

    if (loading) return <p className="text-slate-500">Chargement du produit...</p>

    if (error || !product) {
        return (
            <div className="space-y-3 rounded-xl border border-red-100 bg-red-50 p-6">
                <p className="text-red-700">{error || 'Produit introuvable.'}</p>
                <Link to="/" className="inline-block rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white">
                    Retour a la boutique
                </Link>
            </div>
        )
    }

    return (
        <section className="grid gap-8 md:grid-cols-2">
            <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                    <span>Aucune image disponible</span>
                )}
            </div>

            <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{product.category}</p>
                <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
                <p className="text-slate-600">{product.description || 'Aucune description disponible.'}</p>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-2xl font-bold text-emerald-700">{formatPrice(product.price)}</p>
                    <p className={`mt-1 text-sm font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Rupture de stock'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        type="number"
                        min="1"
                        max={Math.max(1, product.stock)}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-28 rounded-lg border border-slate-300 px-3 py-2"
                    />
                    <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => addItem(product, quantity)}
                        className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </section>
    )
}
