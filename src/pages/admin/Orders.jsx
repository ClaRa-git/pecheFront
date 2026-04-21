import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { formatPrice, readArrayPayload } from '../../utils/apiHelpers'

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await adminService.getOrders()
            setOrders(readArrayPayload(res.data))
        } catch {
            setError('Impossible de charger les commandes admin.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            await adminService.updateOrderStatus(id, status)
            await load()
        } catch {
            setError('Mise a jour du statut impossible.')
        }
    }

    return (
        <section className="space-y-5">
            <h1 className="text-3xl font-bold text-slate-800">Gestion des commandes</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Commande</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Montant</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td className="px-4 py-3 text-slate-500" colSpan={5}>
                                    Chargement...
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            orders.map((order) => (
                                <tr key={order.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-800">#{order.id}</td>
                                    <td className="px-4 py-3">{order.customerEmail || order.userEmail || '-'}</td>
                                    <td className="px-4 py-3">{formatPrice(order.total || 0)}</td>
                                    <td className="px-4 py-3">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '-'}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status || 'PENDING'}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="rounded border border-slate-300 px-2 py-1"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
