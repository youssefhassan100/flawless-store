'use client';
import { useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';
import { discountPct, egp, unitPrice, type Product } from '@/lib/types';

function Price({ p }: { p: Product }) {
  return (
    <p className="text-sm">
      <span className="font-medium text-wine">{egp(unitPrice(p))}</span>
      {discountPct(p) > 0 && <span className="ml-2 text-espresso/50 line-through">{egp(p.price)}</span>}
    </p>
  );
}

function Card({ p, onView }: { p: Product; onView: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const off = discountPct(p);
  return (
    <article className="group flex flex-col rounded-[2rem] bg-blush p-3">
      <button onClick={onView} className="relative block overflow-hidden rounded-[1.5rem] bg-rose/20 text-left" aria-label={`Quick view ${p.title}`}>
        {p.images[0] ? <img src={p.images[0]} alt={p.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid aspect-[4/5] place-items-center"><div className="almond h-40 w-24 bg-rose/50" /></div>}
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-wine px-3 py-1 text-xs text-cream">−{off}%</span>}
        {p.is_bestseller && <span className="absolute right-3 top-3 rounded-full bg-cream px-3 py-1 text-xs text-wine">Bestseller</span>}
      </button>
      <div className="flex flex-1 flex-col gap-1 px-2 pb-1 pt-3">
        <h3 className="font-display text-lg leading-snug">{p.title}</h3>
        <Price p={p} />
        <button className="btn-wine mt-3 !py-2" onClick={() => { add(p); setAdded(true); setTimeout(() => setAdded(false), 1200); }}>{added ? 'Added' : 'Add to cart'}</button>
      </div>
    </article>
  );
}

function QuickView({ p, onClose }: { p: Product; onClose: () => void }) {
  const { add } = useCart();
  const [i, setI] = useState(0);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={p.title}>
      <button className="absolute inset-0 bg-espresso/50" onClick={onClose} aria-label="Close" />
      <div className="relative grid max-h-[90vh] w-full max-w-3xl gap-6 overflow-y-auto rounded-[2rem] bg-cream p-5 md:grid-cols-2">
        <div>
          {p.images[i] ? <img src={p.images[i]} alt={p.title} className="aspect-[4/5] w-full rounded-3xl object-cover" /> : <div className="almond mx-auto h-64 w-40 bg-rose/50" />}
          {p.images.length > 1 && <div className="mt-2 flex gap-2">{p.images.map((src, n) => <button key={src} onClick={() => setI(n)} aria-label={`Image ${n + 1}`} className={`h-14 w-12 overflow-hidden rounded-xl border-2 ${n === i ? 'border-wine' : 'border-transparent'}`}><img src={src} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onClose} className="self-end text-sm underline">Close</button>
          <p className="text-sm text-espresso/60">{p.category}</p>
          <h3 className="font-display text-3xl text-wine">{p.title}</h3>
          <Price p={p} />
          <p className="whitespace-pre-line text-sm leading-relaxed text-espresso/80">{p.description}</p>
          <p className="text-xs text-espresso/60">Not sure of your size? <a href="/sizing" className="underline">Use the sizing guide</a> or <a href="/custom" className="underline">request a custom set</a>.</p>
          <button className="btn-wine mt-auto" onClick={() => { add(p); onClose(); }}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, filterable = false }: { products: Product[]; filterable?: boolean }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('new');
  const [view, setView] = useState<Product | null>(null);
  const cats = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const shown = useMemo(() => {
    const list = products.filter((p) => cat === 'All' || p.category === cat);
    if (sort === 'low') list.sort((a, b) => unitPrice(a) - unitPrice(b));
    if (sort === 'high') list.sort((a, b) => unitPrice(b) - unitPrice(a));
    if (sort === 'sale') list.sort((a, b) => discountPct(b) - discountPct(a));
    return list;
  }, [products, cat, sort]);

  return (
    <div>
      {filterable && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={c === cat} className={`rounded-full px-4 py-2 text-sm transition ${c === cat ? 'bg-wine text-cream' : 'bg-blush hover:bg-rose/40'}`}>{c}</button>)}
          </div>
          <select className="field !w-auto !py-2" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="sale">Biggest discount</option>
          </select>
        </div>
      )}
      {shown.length === 0 ? <p className="py-16 text-center text-espresso/60">No sets in this category yet.</p> : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{shown.map((p) => <Card key={p.id} p={p} onView={() => setView(p)} />)}</div>
      )}
      {view && <QuickView p={view} onClose={() => setView(null)} />}
    </div>
  );
}

export function GridSkeleton() {
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="animate-pulse rounded-[2rem] bg-blush p-3"><div className="aspect-[4/5] rounded-[1.5rem] bg-rose/25" /><div className="mt-3 h-4 w-2/3 rounded bg-rose/25" /><div className="mt-2 h-4 w-1/3 rounded bg-rose/25" /></div>)}</div>;
}
