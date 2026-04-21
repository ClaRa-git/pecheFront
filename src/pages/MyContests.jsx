import { useEffect, useState } from 'react'
import { contestService } from '../services/api'
import { readArrayPayload } from '../utils/apiHelpers'

export default function MyContests() {
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await contestService.getMyRegistrations()
                setRegistrations(readArrayPayload(res.data))
            } catch {
                setError('Impossible de charger vos inscriptions.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    if (loading) return <p className="text-slate-500">Chargement de vos inscriptions...</p>

    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">Mes concours</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            {registrations.map((entry, idx) => (
                <article key={entry.id || idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">{entry.contestName || entry.name || 'Concours'}</h2>
                    <p className="text-sm text-slate-500">Date: {entry.date ? new Date(entry.date).toLocaleDateString('fr-FR') : '-'}</p>
                    <p className="text-sm text-slate-500">Lieu: {entry.location || '-'}</p>
                    <p className="mt-2 text-sm text-slate-700">Statut: {entry.status || 'CONFIRME'}</p>
                </article>
            ))}

            {registrations.length === 0 && <p className="rounded border border-dashed border-slate-300 p-6 text-slate-500">Aucune inscription enregistree.</p>}
        </section>
    )
}
