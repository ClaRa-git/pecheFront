import { useEffect, useState } from 'react'
import { adminService } from '../../services/api'
import { readArrayPayload } from '../../utils/apiHelpers'

const statuses = ['PENDING', 'APPROVED', 'REJECTED']

export default function Permits() {
    const [permits, setPermits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [rejectionReasons, setRejectionReasons] = useState({})

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await adminService.getPermits()
            const rows = readArrayPayload(res.data)
            setPermits(rows)

            const mappedReasons = {}
            rows.forEach((permit) => {
                if (permit.rejectionReason) mappedReasons[permit.id] = permit.rejectionReason
            })
            setRejectionReasons(mappedReasons)
        } catch {
            setError('Impossible de charger les permis.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const updateStatus = async (permitId, status) => {
        const reason = rejectionReasons[permitId] || ''
        try {
            await adminService.updatePermitStatus(permitId, status, status === 'REJECTED' ? reason : '')
            await load()
        } catch {
            setError('Mise a jour du permis impossible.')
        }
    }

    return (
        <section className="space-y-5">
            <h1 className="text-3xl font-bold text-slate-800">Gestion des permis de peche</h1>
            {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

            <div className="space-y-3">
                {loading && <p className="text-slate-500">Chargement...</p>}

                {!loading &&
                    permits.map((permit) => (
                        <article key={permit.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">Demande #{permit.id}</h2>
                                    <p className="text-sm text-slate-500">Utilisateur: {permit.userEmail || permit.customerEmail || '-'}</p>
                                </div>

                                <select
                                    value={permit.status || 'PENDING'}
                                    onChange={(e) => updateStatus(permit.id, e.target.value)}
                                    className="rounded border border-slate-300 px-2 py-1"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                <p className="text-sm text-slate-600">Type: {permit.permitType || '-'}</p>
                                <p className="text-sm text-slate-600">Zone: {permit.fishingArea || '-'}</p>
                                <p className="text-sm text-slate-600">Date: {permit.startDate ? new Date(permit.startDate).toLocaleDateString('fr-FR') : '-'}</p>
                            </div>

                            <textarea
                                value={rejectionReasons[permit.id] || ''}
                                onChange={(e) => setRejectionReasons((prev) => ({ ...prev, [permit.id]: e.target.value }))}
                                placeholder="Motif de refus (si REJECTED)"
                                rows={2}
                                className="mt-3 w-full rounded border border-slate-300 px-3 py-2"
                            />

                            <button
                                type="button"
                                onClick={() => updateStatus(permit.id, permit.status || 'PENDING')}
                                className="mt-3 rounded border border-slate-300 px-3 py-1 text-sm"
                            >
                                Sauvegarder le motif
                            </button>
                        </article>
                    ))}
            </div>
        </section>
    )
}
