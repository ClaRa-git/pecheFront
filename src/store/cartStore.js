import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const computeTotalQty = (items) =>
    items.reduce((sum, item) => sum + item.quantity, 0)

const computeTotalPrice = (items) =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0)

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const safeQty = Math.max(1, Number(quantity) || 1)

                set((state) => {
                    const existing = state.items.find((i) => i.id === product.id)
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + safeQty }
                                    : item
                            ),
                        }
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                name: product.name,
                                price: Number(product.price) || 0,
                                imageUrl: product.imageUrl || '',
                                quantity: safeQty,
                            },
                        ],
                    }
                })
            },

            updateQuantity: (productId, quantity) => {
                const safeQty = Math.max(1, Number(quantity) || 1)
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity: safeQty } : item
                    ),
                }))
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }))
            },

            clear: () => set({ items: [] }),

            totalQuantity: () => computeTotalQty(get().items),
            totalPrice: () => computeTotalPrice(get().items),
        }),
        {
            name: 'peche3000-cart',
            partialize: (state) => ({ items: state.items }),
        }
    )
)
