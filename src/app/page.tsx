import Link from 'next/link';
import { Suspense } from 'react';
import { getProducts } from '@/lib/queries';
import { GridSkeleton, ProductGrid } from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

async function BestSellers() {
  const products = await getProducts({ bestsellers: true });
  if (!products.length) return <p className="text-espresso/60">Bestsellers will appear here once the owner marks them in the dashboard.</p>;
  return <ProductGrid products={products} />;
}

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div className="animate-rise">
          <h1 className="font-display text-6xl leading-[.95] text-wine md:text-8xl">Flawless</h1>
          <p className="mt-5 font-display text-2xl text-espresso/80">Handmade. Reusable. Made to fit you.</p>
          <p className="mt-4 max-w-md text-espresso/70">Press-on nails shaped, painted and finished by hand. Measure once with our sizing kit, wear them again and again.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-wine">Shop the collection</Link>
            <Link href="/custom" className="btn-ghost">Design your own set</Link>
          </div>
        </div>
        <div className="relative mx-auto flex h-[22rem] w-full max-w-sm items-end justify-center gap-3 md:h-[28rem]" aria-hidden>
          <div className="almond h-56 w-24 animate-rise bg-rose [animation-delay:.15s] md:h-72 md:w-28" />
          <div className="almond h-72 w-28 animate-rise bg-wine [animation-delay:.3s] md:h-96 md:w-32" />
          <div className="almond h-64 w-24 animate-rise bg-blush shadow-soft [animation-delay:.45s] md:h-80 md:w-28" />
          <div className="almond h-44 w-20 animate-rise bg-rose/60 [animation-delay:.6s] md:h-56 md:w-24" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="mb-8 flex items-end justify-between"><h2 className="font-display text-4xl text-wine">Bestsellers</h2><Link href="/shop" className="text-sm underline">See all</Link></div>
        <Suspense fallback={<GridSkeleton />}><BestSellers /></Suspense>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-5 px-5 md:grid-cols-2">
        <Link href="/sizing" className="rounded-[2rem] bg-blush p-8 transition hover:shadow-soft"><h3 className="font-display text-3xl text-wine">Find your size</h3><p className="mt-2 text-sm text-espresso/70">Sizes 0 to 11 for each finger. Measure in a minute.</p></Link>
        <Link href="/custom" className="rounded-[2rem] bg-wine p-8 text-cream transition hover:shadow-soft"><h3 className="font-display text-3xl">Custom made</h3><p className="mt-2 text-sm text-cream/80">Send your sizes and a reference photo. We make the set for you.</p></Link>
      </section>
    </>
  );
}
