export const readArrayPayload = (payload) => {
    if (Array.isArray(payload)) return payload

    if (!payload || typeof payload !== 'object') return []

    const candidates = [
        payload.items,
        payload.content,
        payload.results,
        payload.data,
        payload.rows,
    ]

    const firstArray = candidates.find(Array.isArray)
    if (firstArray) return firstArray

    return []
}

export const readObjectPayload = (payload) => {
    if (!payload || typeof payload !== 'object') return null

    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        return payload.data
    }

    return payload
}

export const toPrice = (value) => Number(value) || 0

export const formatPrice = (value) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(toPrice(value))

export const mapProduct = (raw) => ({
    id: raw?.id,
    name: raw?.name || raw?.title || 'Produit',
    description: raw?.description || '',
    category: raw?.category || raw?.categoryName || 'Divers',
    stock: Number(raw?.stock ?? raw?.quantity ?? 0),
    price: toPrice(raw?.price),
    imageUrl: raw?.imageUrl || raw?.image || '',
})
