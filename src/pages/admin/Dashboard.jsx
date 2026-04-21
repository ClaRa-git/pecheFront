import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { formatPrice, readObjectPayload } from '../../utils/apiHelpers'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')

            try {
                const res = await adminService.getStats()
                setStats(readObjectPayload(res.data) || {})
            } catch {
                setError('Impossible de charger les statistiques admin.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    if (loading) return <p className="text-slate-500">Chargement des statistiques...</p>

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Tableau de bord administrateur</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Produits actifs</p>
                    <p className="mt-1 text-3xl font-bold text-slate-800">{stats?.productsCount ?? 0}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Commandes</p>
                    <p className="mt-1 text-3xl font-bold text-slate-800">{stats?.ordersCount ?? 0}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Demandes de permis</p>
                    <p className="mt-1 text-3xl font-bold text-slate-800">{stats?.permitsCount ?? 0}</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Chiffre d affaires</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-700">{formatPrice(stats?.revenue ?? 0)}</p>
                </article>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">Dernieres commandes</h2>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                        {(stats?.recentOrders || []).map((order) => (
                            <div key={order.id} className="flex justify-between border-b border-slate-100 pb-2">
                                <span>#{order.id}</span>
                                <span>{order.status}</span>
                            </div>
                        ))}
                        {(stats?.recentOrders || []).length === 0 && <p className="text-slate-500">Aucune donnee.</p>}
                    </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">Permis en attente</h2>
                    <p className="mt-3 text-4xl font-bold text-amber-700">{stats?.pendingPermits ?? 0}</p>
                    <p className="mt-1 text-sm text-slate-500">Demandes necessitant une validation.</p>
                </article>
            </div>
        </section>
    )
}
