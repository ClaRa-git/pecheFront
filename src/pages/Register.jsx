import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (form.password !== form.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }

        setLoading(true)
        try {
            await authService.register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                username: form.email,
                phone: form.phone,
                address: form.address,
                password: form.password,
            })

            setSuccess('Compte cree avec succes. Redirection vers la connexion...')
            setTimeout(() => navigate('/login'), 900)
        } catch {
            setError('Inscription impossible. Verifiez les informations saisies.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold text-slate-800">Creer un compte</h1>

            {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {success && <p className="mb-4 rounded bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Prenom" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Nom" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telephone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Adresse" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Mot de passe" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirmer le mot de passe" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-700 py-2 font-semibold text-white disabled:bg-slate-400">
                    {loading ? 'Creation...' : 'S inscrire'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
                Deja inscrit ?{' '}
                <Link to="/login" className="font-medium text-blue-700">
                    Se connecter
                </Link>
            </p>
        </div>
    )
}
