import Link from 'next/link';
import { logout } from '@/lib/actions/admin';

export const dynamic = 'force-dynamic';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex items-center justify-between border-b border-rose/40 pb-4">
        <nav className="flex gap-6 text-sm"><Link href="/admin" className="font-medium">Products</Link><Link href="/admin/orders">Orders</Link></nav>
        <form action={logout}><button className="text-sm underline">Log out</button></form>
      </div>
      {children}
    </div>
  );
}
