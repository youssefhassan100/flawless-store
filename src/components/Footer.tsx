import Link from 'next/link';
import { SITE } from '@/lib/config';

export function Footer() {
  return (
    <footer className="mt-24 bg-wine text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">Flawless</p>
          <p className="mt-2 text-sm text-cream/70">{SITE.tagline}</p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><Link href="/shop" className="hover:underline">Shop</Link></li>
          <li><Link href="/sizing" className="hover:underline">Sizing guide</Link></li>
          <li><Link href="/custom" className="hover:underline">Custom order</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
        <ul className="space-y-2 text-sm">
          {SITE.phone && <li><a href={`https://wa.me/2${SITE.phone.replace(/\D/g, '')}`} className="hover:underline">WhatsApp {SITE.phone}</a></li>}
          {SITE.instagram && <li><a href={SITE.instagram} className="hover:underline">Instagram</a></li>}
        </ul>
      </div>
      <p className="border-t border-cream/15 py-5 text-center text-xs text-cream/70">Owned &amp; Managed by {SITE.owner}</p>
    </footer>
  );
}
