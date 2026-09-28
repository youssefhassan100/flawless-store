import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/queries';
import { GridSkeleton, ProductGrid } from '@/components/ProductGrid';

export const metadata: Metadata = { title: 'Shop' };
export const dynamic = 'force-dynamic';

async function Catalog() { return <ProductGrid products={await getProducts()} filterable />; }

export default function Shop() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="mb-8 font-display text-5xl text-wine">The collection</h1>
      <Suspense fallback={<GridSkeleton />}><Catalog /></Suspense>
    </div>
  );
}
