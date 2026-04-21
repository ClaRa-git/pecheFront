import { useEffect, useState } from 'react'
import { permitService } from '../services/api'
import { readArrayPayload } from '../utils/apiHelpers'

const statusClass = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-700',
}

export default function Permits() {
    const [permits, setPermits] = useState([])
    const [form, setForm] = useState({
        permitType: 'annuel',
        fishingArea: '',
        startDate: '',
        notes: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const loadPermits = async () => {
        setLoading(true)
        try {
            const res = await permitService.getAll()
            setPermits(readArrayPayload(res.data))
        } catch {
            setError('Impossible de charger les demandes de permis.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPermits()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')
        try {
            await permitService.create(form)
            setMessage('Demande de permis envoyee.')
            setForm({ permitType: 'annuel', fishingArea: '', startDate: '', notes: '' })
            await loadPermits()
        } catch {
            setError('Echec de creation de la demande de permis.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <section className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
                <h1 className="text-2xl font-bold text-slate-800">Demander un permis de peche</h1>
                {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                {message && <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

                <select value={form.permitType} onChange={(e) => setForm((p) => ({ ...p, permitType: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="journalier">Journalier</option>
                    <option value="hebdomadaire">Hebdomadaire</option>
                    <option value="annuel">Annuel</option>
                </select>
                <input value={form.fishingArea} onChange={(e) => setForm((p) => ({ ...p, fishingArea: e.target.value }))} required placeholder="Zone de peche" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={4} placeholder="Informations complementaires" className="w-full rounded-lg border border-slate-300 px-3 py-2" />

                <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:bg-slate-400">
                    {saving ? 'Envoi...' : 'Envoyer la demande'}
                </button>
            </form>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-800">Mes demandes</h2>
                {loading && <p className="text-slate-500">Chargement...</p>}
                {!loading &&
                    permits.map((permit) => (
                        <article key={permit.id} className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-800">Permis {permit.permitType || 'standard'}</p>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[permit.status] || 'bg-slate-100 text-slate-700'}`}>
                                    {permit.status || 'PENDING'}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">Zone: {permit.fishingArea || '-'}</p>
                            <p className="text-sm text-slate-500">Date: {permit.startDate ? new Date(permit.startDate).toLocaleDateString('fr-FR') : '-'}</p>
                            {permit.rejectionReason && <p className="mt-2 text-sm text-red-700">Motif refus: {permit.rejectionReason}</p>}
                        </article>
                    ))}

                {!loading && permits.length === 0 && <p className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">Aucune demande pour le moment.</p>}
            </div>
        </section>
    )
}
