'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useCart } from '@/lib/cart';
import { placeOrder } from '@/lib/actions/shop';
import { egp } from '@/lib/types';

export function CheckoutForm() {
  const c = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (c.lines.length === 0) return <p className="py-16 text-center">Your cart is empty. <Link href="/shop" className="underline">Browse the collection</Link></p>;

  return (
    <div className="grid gap-10 md:grid-cols-[1.3fr_1fr]">
      <form className="space-y-4" action={(fd) => {
        setError(null);
        start(async () => {
          const r = await placeOrder({
            name: fd.get('name'), phone: fd.get('phone'), city: fd.get('city'), address: fd.get('address'), notes: fd.get('notes') || undefined,
            code: c.code?.code, items: c.lines.map((l) => ({ id: l.id, qty: l.qty })),
          });
          if (r.ok) { c.clear(); router.push(`/checkout/success?id=${r.id.slice(0, 8)}`); } else setError(r.error);
        });
      }}>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="name">Full name</label><input id="name" name="name" required className="field" autoComplete="name" /></div>
          <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required className="field" autoComplete="tel" /></div>
        </div>
        <div><label className="label" htmlFor="city">City</label><input id="city" name="city" required className="field" autoComplete="address-level2" /></div>
        <div><label className="label" htmlFor="address">Detailed address</label><textarea id="address" name="address" required rows={3} className="field" autoComplete="street-address" /></div>
        <div><label className="label" htmlFor="notes">Delivery notes (optional)</label><textarea id="notes" name="notes" rows={2} className="field" /></div>
        {error && <p role="alert" className="text-sm text-wine">{error}</p>}
        <button className="btn-wine w-full" disabled={pending}>{pending ? 'Placing order…' : `Place order · ${egp(c.total)}`}</button>
        <p className="text-center text-xs text-espresso/60">Pay in cash when your order arrives.</p>
      </form>
      <aside className="h-fit rounded-[2rem] bg-blush p-6">
        <h2 className="font-display text-xl text-wine">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">{c.lines.map((l) => <li key={l.id} className="flex justify-between"><span>{l.title} × {l.qty}</span><span>{egp(l.price * l.qty)}</span></li>)}</ul>
        <div className="mt-4 space-y-1 border-t border-rose/40 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{egp(c.subtotal)}</span></div>
          {c.code && <div className="flex justify-between text-wine"><span>{c.code.code}</span><span>−{egp(c.discount)}</span></div>}
          <div className="flex justify-between font-display text-lg"><span>Total</span><span>{egp(c.total)}</span></div>
        </div>
      </aside>
    </div>
  );
}
