import { useEffect, useState } from 'react'
import { authService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { readObjectPayload } from '../utils/apiHelpers'

export default function Profile() {
    const { updateUser } = useAuthStore()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await authService.getProfile()
                const profile = readObjectPayload(res.data) || {}
                const currentUser = useAuthStore.getState().user
                const nextForm = {
                    firstName: profile.firstName || currentUser?.firstName || '',
                    lastName: profile.lastName || currentUser?.lastName || '',
                    email: profile.email || currentUser?.email || '',
                    phone: profile.phone || currentUser?.phone || '',
                    address: profile.address || currentUser?.address || '',
                }
                setForm(nextForm)
                updateUser(nextForm)
            } catch {
                setError('Impossible de charger votre profil.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [updateUser])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setMessage('')

        try {
            await authService.updateProfile(form)
            updateUser(form)
            setMessage('Profil mis a jour.')
        } catch {
            setError('La mise a jour a echoue.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p className="text-slate-500">Chargement du profil...</p>

    return (
        <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">Mon profil</h1>

            {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="Prenom" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Nom" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Telephone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Adresse" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>

                <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:bg-slate-400">
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </form>
        </section>
    )
}
