'use client';
import { useState, useTransition } from 'react';
import { HandSizer, sizesComplete } from './HandSizer';
import { submitCustomRequest } from '@/lib/actions/shop';
import { emptyHand, type Sizes } from '@/lib/types';

export function CustomForm() {
  const [sizes, setSizes] = useState<Sizes>({ left: emptyHand(), right: emptyHand() });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (done) return <div className="rounded-[2rem] bg-blush p-10 text-center"><h2 className="font-display text-3xl text-wine">Request received</h2><p className="mt-2 text-sm">We will message you on WhatsApp with a quote and timeline.</p></div>;

  return (
    <form className="space-y-8" action={(fd) => {
      if (!sizesComplete(sizes)) return setError('Pick a size for every finger on both hands');
      fd.set('sizes', JSON.stringify(sizes));
      setError(null);
      start(async () => { const r = await submitCustomRequest(fd); if (r.ok) setDone(true); else setError(r.error); });
    }}>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label" htmlFor="name">Your name</label><input id="name" name="name" required minLength={2} className="field" autoComplete="name" /></div>
        <div><label className="label" htmlFor="phone">Phone number</label><input id="phone" name="phone" required type="tel" className="field" autoComplete="tel" /></div>
      </div>
      <HandSizer value={sizes} onChange={setSizes} />
      <div><label className="label" htmlFor="notes">Design notes or custom text</label><textarea id="notes" name="notes" rows={4} className="field" placeholder="Shape, length, colours, charms, text on a nail…" /></div>
      <div><label className="label" htmlFor="reference">Reference image (optional)</label><input id="reference" name="reference" type="file" accept="image/*" className="field" /></div>
      {error && <p role="alert" className="text-sm text-wine">{error}</p>}
      <button className="btn-wine" disabled={pending}>{pending ? 'Sending…' : 'Send custom request'}</button>
    </form>
  );
}
