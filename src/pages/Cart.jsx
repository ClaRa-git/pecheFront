import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/apiHelpers'

export default function Cart() {
    const { items, updateQuantity, removeItem, clear, totalPrice } = useCartStore()
    const total = totalPrice()

    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Votre panier est vide</h1>
                <p className="mt-2 text-slate-500">Ajoutez des articles pour preparer votre commande.</p>
                <Link to="/" className="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-2 font-medium text-white">
                    Voir la boutique
                </Link>
            </div>
        )
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Panier</h1>
                <button
                    type="button"
                    onClick={clear}
                    className="rounded border border-red-200 px-3 py-1 text-sm font-medium text-red-700"
                >
                    Vider le panier
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
                                <p className="text-sm text-slate-500">Prix unitaire: {formatPrice(item.price)}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                                    className="w-20 rounded-lg border border-slate-300 px-2 py-1"
                                />
                                <p className="w-28 text-right font-bold text-emerald-700">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="flex flex-col items-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-2xl font-bold text-slate-800">Total: {formatPrice(total)}</p>
                <Link to="/checkout" className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white">
                    Passer au paiement
                </Link>
            </div>
        </section>
    )
}
