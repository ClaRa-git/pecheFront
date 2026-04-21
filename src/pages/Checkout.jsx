import { useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../services/api'
import { useCartStore } from '../store/cartStore'
import { formatPrice, readObjectPayload } from '../utils/apiHelpers'

export default function Checkout() {
    const { items, clear, totalPrice } = useCartStore()

    const [form, setForm] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'stripe',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const total = totalPrice()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const createPayload = {
                shipping: {
                    fullName: form.fullName,
                    address: form.address,
                    city: form.city,
                    zipCode: form.zipCode,
                },
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }

            const createRes = await orderService.create(createPayload)
            const orderData = readObjectPayload(createRes.data) || {}
            const orderId = orderData.id || orderData.orderId

            if (orderId && (form.paymentMethod === 'stripe' || form.paymentMethod === 'paypal')) {
                const checkoutRes = await orderService.checkout(orderId)
                const checkoutData = readObjectPayload(checkoutRes.data) || {}
                const redirectUrl = checkoutData.url || checkoutData.checkoutUrl

                if (redirectUrl) {
                    window.location.href = redirectUrl
                    return
                }
            }

            clear()
            setSuccess('Commande enregistree avec succes. Vous pouvez suivre son statut dans vos commandes.')
        } catch {
            setError('Le paiement ou la creation de commande a echoue. Veuillez reessayer.')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0 && !success) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Aucun article a payer</h1>
                <p className="mt-2 text-slate-500">Votre panier est vide.</p>
                <Link to="/cart" className="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-2 font-medium text-white">
                    Retour au panier
                </Link>
            </div>
        )
    }

    return (
        <section className="grid gap-6 lg:grid-cols-3">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
                <h1 className="text-2xl font-bold text-slate-800">Finaliser la commande</h1>

                {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                {success && <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

                <input
                    type="text"
                    required
                    placeholder="Nom complet"
                    value={form.fullName}
                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <input
                    type="text"
                    required
                    placeholder="Adresse"
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                        type="text"
                        required
                        placeholder="Ville"
                        value={form.city}
                        onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                    <input
                        type="text"
                        required
                        placeholder="Code postal"
                        value={form.zipCode}
                        onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Methode de paiement</label>
                    <select
                        value={form.paymentMethod}
                        onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white disabled:bg-slate-400"
                >
                    {loading ? 'Traitement...' : 'Valider la commande'}
                </button>
            </form>

            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-slate-800">Recapitulatif</h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between gap-3">
                            <span>
                                {item.name} x{item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-5 border-t border-slate-200 pt-3 text-xl font-bold text-slate-800">
                    Total: {formatPrice(total)}
                </p>
            </aside>
        </section>
    )
}
