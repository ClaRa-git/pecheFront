import { useEffect, useState } from 'react'
import { productService } from '../../services/api'
import { formatPrice, mapProduct, readArrayPayload } from '../../utils/apiHelpers'

const emptyForm = {
    name: '',
    description: '',
    category: '',
    stock: 0,
    price: 0,
    imageUrl: '',
}

export default function Products() {
    const [products, setProducts] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const loadProducts = async () => {
        setLoading(true)
        try {
            const res = await productService.getAll()
            setProducts(readArrayPayload(res.data).map(mapProduct))
        } catch {
            setError('Impossible de charger les produits.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const payload = {
                ...form,
                stock: Number(form.stock),
                price: Number(form.price),
            }
            if (editingId) {
                await productService.update(editingId, payload)
            } else {
                await productService.create(payload)
            }
            resetForm()
            await loadProducts()
        } catch {
            setError('Enregistrement du produit impossible.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce produit ?')) return
        try {
            await productService.delete(id)
            await loadProducts()
        } catch {
            setError('Suppression impossible.')
        }
    }

    const startEdit = (p) => {
        setEditingId(p.id)
        setForm({
            name: p.name,
            description: p.description,
            category: p.category,
            stock: p.stock,
            price: p.price,
            imageUrl: p.imageUrl,
        })
    }

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Administration des produits</h1>
            {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required placeholder="Nom du produit" className="rounded border border-slate-300 px-3 py-2" />
                <input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required placeholder="Categorie" className="rounded border border-slate-300 px-3 py-2" />
                <input type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required placeholder="Prix" className="rounded border border-slate-300 px-3 py-2" />
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required placeholder="Stock" className="rounded border border-slate-300 px-3 py-2" />
                <input value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="URL image" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3} className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
                <div className="flex gap-2 md:col-span-2">
                    <button type="submit" disabled={saving} className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400">
                        {saving ? 'Enregistrement...' : editingId ? 'Mettre a jour' : 'Creer'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Produit</th>
                            <th className="px-4 py-3">Categorie</th>
                            <th className="px-4 py-3">Prix</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Actions</th>
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
                            products.map((p) => (
                                <tr key={p.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                                    <td className="px-4 py-3">{p.category}</td>
                                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                                    <td className="px-4 py-3">{p.stock}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => startEdit(p)} className="rounded border border-slate-300 px-3 py-1">
                                                Editer
                                            </button>
                                            <button type="button" onClick={() => handleDelete(p.id)} className="rounded border border-red-200 px-3 py-1 text-red-700">
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
