import { create } from 'zustand';
import { type CartItem } from '../types';

/** Taxa de entrega fixa em Kz */
export const DELIVERY_FEE = 500;

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  /** Total de unidades (soma das quantidades) — para o badge do carrinho */
  getTotalQuantity: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    }
    return { items: [...state.items, item] };
  }),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id),
  })),
  
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.id === id ? { ...i, quantity } : i
    ),
  })),
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getTotalQuantity: () => {
    const items = get().items;
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
