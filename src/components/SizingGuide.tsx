'use client';
import { useState } from 'react';
import { HandSizer } from './HandSizer';
import { emptyHand, type Sizes } from '@/lib/types';

const TIPS = [
  'Place the nail tips over your natural nails to find your size.',
  'The nail should cover your whole nail from sidewall to sidewall, with no overhang.',
  'Between two sizes? Go up one. You can file the nail down to fit.',
  'Write down the size for each finger, left and right hand.',
];

export function SizingGuide() {
  const [sizes, setSizes] = useState<Sizes>({ left: emptyHand(), right: emptyHand() });
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-10">
      <ol className="grid gap-3 md:grid-cols-2">
        {TIPS.map((t, i) => <li key={t} className="flex gap-4 rounded-3xl bg-blush p-5 text-sm"><span className="font-display text-2xl text-wine">{i + 1}</span><span>{t}</span></li>)}
      </ol>
      <section>
        <h2 className="font-display text-2xl text-wine">Size ruler</h2>
        <p className="mb-4 text-sm text-espresso/70">Sizes run from 0 (smallest) to 11. Tap a heart to compare widths.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sizes 0 to 11">
          {Array.from({ length: 12 }, (_, n) => (
            <button key={n} onClick={() => setActive(n === active ? null : n)} aria-pressed={active === n} className="group flex flex-col items-center gap-1 text-sm">
              <svg viewBox="0 0 24 22" className={`h-9 w-9 transition ${active === n ? 'scale-125 fill-wine' : 'fill-wine/75 group-hover:fill-wine'}`}><path d="M12 21 2.6 11.6A6 6 0 0 1 12 4a6 6 0 0 1 9.4 7.6Z" /></svg>{n}
            </button>
          ))}
        </div>
        {active !== null && <p className="mt-3 text-sm">Size <b>{active}</b>: nail width in the diagram below grows with each size.</p>}
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl text-wine">Try it: pick a size per finger</h2>
        <HandSizer value={sizes} onChange={setSizes} />
      </section>
    </div>
  );
}
