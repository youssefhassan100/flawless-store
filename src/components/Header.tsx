'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const links = [['/shop', 'Shop'], ['/sizing', 'Sizing guide'], ['/custom', 'Custom order'], ['/contact', 'Contact']] as const;

export function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-rose/30 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center" aria-label="Flawless home">
          <Image src="/logo.png" alt="Flawless" width={900} height={820} priority className="h-12 w-auto md:h-14" />
        </Link>
        <nav className="hidden gap-7 text-sm md:flex" aria-label="Main">
          {links.map(([href, label]) => <Link key={href} href={href} className="text-espresso/80 transition hover:text-wine">{label}</Link>)}
        </nav>
        <button onClick={() => setOpen(true)} className="btn-ghost !px-4 !py-2" aria-label={`Open cart, ${count} items`}>
          Cart <span className="grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-xs text-cream">{count}</span>
        </button>
      </div>
      <nav className="flex justify-center gap-5 border-t border-rose/20 py-2 text-xs md:hidden" aria-label="Mobile">
        {links.map(([href, label]) => <Link key={href} href={href} className="text-espresso/80">{label}</Link>)}
      </nav>
    </header>
  );
}
