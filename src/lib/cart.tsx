'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { unitPrice, type Product } from './types';

export type CartLine = { id: string; title: string; price: number; image: string | null; qty: number };
type State = { lines: CartLine[]; code: { code: string; percent: number } | null };
type Action =
  | { type: 'add'; line: Omit<CartLine, 'qty'> }
  | { type: 'qty'; id: string; qty: number }
  | { type: 'code'; code: State['code'] }
  | { type: 'clear' }
  | { type: 'hydrate'; state: State };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'add': {
      const found = s.lines.find((l) => l.id === a.line.id);
      const lines = found ? s.lines.map((l) => (l.id === a.line.id ? { ...l, qty: Math.min(20, l.qty + 1) } : l)) : [...s.lines, { ...a.line, qty: 1 }];
      return { ...s, lines };
    }
    case 'qty': return { ...s, lines: s.lines.map((l) => (l.id === a.id ? { ...l, qty: a.qty } : l)).filter((l) => l.qty > 0) };
    case 'code': return { ...s, code: a.code };
    case 'clear': return { lines: [], code: null };
    case 'hydrate': return a.state;
  }
}

type Ctx = State & {
  open: boolean; setOpen: (v: boolean) => void; count: number; subtotal: number; discount: number; total: number;
  add: (p: Product) => void; setQty: (id: string, qty: number) => void; setCode: (c: State['code']) => void; clear: () => void;
};
const CartContext = createContext<Ctx | null>(null);
const KEY = 'flawless-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], code: null });
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) dispatch({ type: 'hydrate', state: JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }, [state, ready]);

  const add = useCallback((p: Product) => {
    dispatch({ type: 'add', line: { id: p.id, title: p.title, price: unitPrice(p), image: p.images[0] ?? null } });
    setOpen(true);
  }, []);

  const value = useMemo<Ctx>(() => {
    const subtotal = state.lines.reduce((s, l) => s + l.price * l.qty, 0);
    const discount = state.code ? Math.round((subtotal * state.code.percent) / 100) : 0;
    return {
      ...state, open, setOpen, count: state.lines.reduce((s, l) => s + l.qty, 0), subtotal, discount, total: subtotal - discount, add,
      setQty: (id, qty) => dispatch({ type: 'qty', id, qty }), setCode: (code) => dispatch({ type: 'code', code }), clear: () => dispatch({ type: 'clear' }),
    };
  }, [state, open, add]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
