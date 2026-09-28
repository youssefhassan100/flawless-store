'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useCart } from '@/lib/cart';
import { checkDiscountCode } from '@/lib/actions/shop';
import { egp } from '@/lib/types';

export function CartDrawer() {
  const c = useCart();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!c.open) return null;

  const apply = () => start(async () => {
    const r = await checkDiscountCode(code);
    if (r.ok) { c.setCode({ code: r.code, percent: r.percent }); setMsg(null); } else setMsg(r.error);
  });

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <button className="absolute inset-0 bg-espresso/40" onClick={() => c.setOpen(false)} aria-label="Close cart" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide flex-col rounded-l-[2rem] bg-cream shadow-soft">
        <div className="flex items-center justify-between p-6 pb-3">
          <h2 className="font-display text-2xl text-wine">Your cart</h2>
          <button onClick={() => c.setOpen(false)} className="text-sm underline">Close</button>
        </div>
        {c.lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div><p className="font-display text-xl">Nothing here yet</p>
              <Link href="/shop" onClick={() => c.setOpen(false)} className="btn-wine mt-4">Browse the collection</Link></div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-3">
              {c.lines.map((l) => (
                <li key={l.id} className="flex gap-4 rounded-3xl bg-blush p-3">
                  {l.image ? <img src={l.image} alt="" className="h-20 w-16 rounded-2xl object-cover" /> : <div className="almond h-20 w-16 bg-rose/40" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="text-sm text-wine">{egp(l.price)}</p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-rose/60 bg-white text-sm">
                      <button className="px-3 py-1" onClick={() => c.setQty(l.id, l.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span className="w-6 text-center">{l.qty}</span>
                      <button className="px-3 py-1" onClick={() => c.setQty(l.id, Math.min(20, l.qty + 1))} aria-label="Increase quantity">+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-rose/30 p-6">
              <div className="flex gap-2">
                <input className="field !py-2" placeholder="Discount code" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Discount code" />
                <button className="btn-ghost !py-2" onClick={apply} disabled={pending || !code}>Apply</button>
              </div>
              {msg && <p className="text-sm text-wine" role="alert">{msg}</p>}
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{egp(c.subtotal)}</dd></div>
                {c.code && <div className="flex justify-between text-wine"><dt>{c.code.code} (−{c.code.percent}%)</dt><dd>−{egp(c.discount)}</dd></div>}
                <div className="flex justify-between font-display text-lg"><dt>Total</dt><dd>{egp(c.total)}</dd></div>
              </dl>
              <Link href="/checkout" onClick={() => c.setOpen(false)} className="btn-wine w-full">Checkout · Cash on delivery</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
