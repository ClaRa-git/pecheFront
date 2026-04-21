import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { readArrayPayload } from '../../utils/apiHelpers'

const emptyForm = {
    name: '',
    description: '',
    date: '',
    location: '',
}

export default function Contests() {
    const [contests, setContests] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await adminService.getContests()
            setContests(readArrayPayload(res.data))
        } catch {
            setError('Impossible de charger les concours admin.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            if (editingId) {
                await adminService.updateContest(editingId, form)
            } else {
                await adminService.createContest(form)
            }
            setForm(emptyForm)
            setEditingId(null)
            await load()
        } catch {
            setError('Enregistrement du concours impossible.')
        } finally {
            setSaving(false)
        }
    }

    const startEdit = (contest) => {
        setEditingId(contest.id)
        setForm({
            name: contest.name || '',
            description: contest.description || '',
            date: contest.date ? contest.date.slice(0, 10) : '',
            location: contest.location || '',
        })
    }

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Gestion des concours</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required placeholder="Nom du concours" className="rounded border border-slate-300 px-3 py-2" />
                <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required className="rounded border border-slate-300 px-3 py-2" />
                <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} required placeholder="Lieu" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required placeholder="Description" rows={3} className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />

                <div className="flex gap-2 md:col-span-2">
                    <button type="submit" disabled={saving} className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400">
                        {saving ? 'Enregistrement...' : editingId ? 'Mettre a jour' : 'Creer'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingId(null)
                                setForm(emptyForm)
                            }}
                            className="rounded border border-slate-300 px-4 py-2 text-sm"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-3">
                {loading && <p className="text-slate-500">Chargement des concours...</p>}

                {!loading &&
                    contests.map((contest) => (
                        <article key={contest.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">{contest.name}</h2>
                                    <p className="text-sm text-slate-500">{contest.date ? new Date(contest.date).toLocaleDateString('fr-FR') : '-'}</p>
                                    <p className="text-sm text-slate-500">{contest.location || '-'}</p>
                                </div>
                                <button type="button" onClick={() => startEdit(contest)} className="rounded border border-slate-300 px-3 py-1 text-sm">
                                    Editer
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{contest.description || 'Aucune description.'}</p>
                        </article>
                    ))}
            </div>
        </section>
    )
}
