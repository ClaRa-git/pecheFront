import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { contestService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { readArrayPayload } from '../utils/apiHelpers'

export default function Contests() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const [contests, setContests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const loadContests = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await contestService.getAll()
            setContests(readArrayPayload(res.data))
        } catch {
            setError('Impossible de charger les concours.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadContests()
    }, [])

    const register = async (contestId) => {
        setMessage('')
        setError('')
        try {
            await contestService.register(contestId)
            setMessage('Inscription enregistree avec succes.')
        } catch {
            setError('Inscription impossible pour ce concours.')
        }
    }

    return (
        <section className="space-y-5">
            <h1 className="text-3xl font-bold text-slate-800">Concours de peche</h1>
            <p className="text-slate-500">Inscrivez-vous aux evenements locaux organises par le magasin.</p>

            {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

            {loading && <p className="text-slate-500">Chargement des concours...</p>}

            <div className="grid gap-4 md:grid-cols-2">
                {!loading &&
                    contests.map((contest) => (
                        <article key={contest.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800">{contest.name}</h2>
                            <p className="mt-1 text-sm text-slate-600">{contest.description || 'Aucune description.'}</p>
                            <p className="mt-2 text-sm text-slate-500">Date: {contest.date ? new Date(contest.date).toLocaleDateString('fr-FR') : '-'}</p>
                            <p className="text-sm text-slate-500">Lieu: {contest.location || '-'}</p>

                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={() => register(contest.id)}
                                    className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    S inscrire
                                </button>
                            ) : (
                                <Link to="/login" className="mt-4 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                                    Connectez-vous pour vous inscrire
                                </Link>
                            )}
                        </article>
                    ))}
            </div>

            {!loading && contests.length === 0 && <p className="rounded border border-dashed border-slate-300 p-5 text-slate-500">Aucun concours planifie actuellement.</p>}
        </section>
    )
}
