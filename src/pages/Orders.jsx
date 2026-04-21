import { useEffect, useState } from 'react'
import { orderService } from '../services/api'
import { formatPrice, readArrayPayload } from '../utils/apiHelpers'

const statusClass = {
    PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-emerald-100 text-emerald-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-700',
}

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await orderService.getAll()
                setOrders(readArrayPayload(res.data))
            } catch {
                setError('Impossible de charger vos commandes.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    if (loading) return <p className="text-slate-500">Chargement des commandes...</p>

    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Mes commandes</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            {orders.map((order) => {
                const lines = Array.isArray(order.items) ? order.items : []
                const total = Number(order.total) || lines.reduce((sum, l) => sum + (Number(l.price) || 0) * (Number(l.quantity) || 0), 0)

                return (
                    <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-lg font-semibold text-slate-800">Commande #{order.id}</h2>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[order.status] || 'bg-slate-100 text-slate-700'}`}>
                                {order.status || 'INCONNU'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '-'}</p>

                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                            {lines.map((line, idx) => (
                                <div key={`${order.id}-${idx}`} className="flex justify-between">
                                    <span>
                                        {line.productName || line.name || `Produit ${idx + 1}`} x{line.quantity || 1}
                                    </span>
                                    <span>{formatPrice((Number(line.price) || 0) * (Number(line.quantity) || 0))}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-3 border-t border-slate-200 pt-3 text-right font-bold text-slate-800">
                            Total: {formatPrice(total)}
                        </p>
                    </article>
                )
            })}

            {orders.length === 0 && <p className="rounded border border-dashed border-slate-300 p-6 text-slate-500">Aucune commande pour le moment.</p>}
        </section>
    )
}
