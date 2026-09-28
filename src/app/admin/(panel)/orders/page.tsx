import Link from 'next/link';
import { getCustomRequests, getOrders } from '@/lib/queries';
import { setStatus } from '@/lib/actions/admin';
import { FINGERS, egp, type OrderStatus, type Sizes } from '@/lib/types';

function Status({ id, table, status }: { id: string; table: 'orders' | 'custom'; status: OrderStatus }) {
  return (
    <form action={setStatus} className="flex gap-2">
      <input type="hidden" name="id" value={id} /><input type="hidden" name="table" value={table} />
      <select name="status" defaultValue={status} className="field !w-auto !py-1.5"><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select>
      <button className="btn-ghost !py-1.5">Update</button>
    </form>
  );
}
const Hand = ({ label, h }: { label: string; h: Sizes['left'] }) => <p className="text-sm"><b>{label}:</b> {FINGERS.map((f) => `${f} ${h[f]}`).join(' · ')}</p>;
const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export default async function Orders({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const custom = (await searchParams).tab === 'custom';
  return (
    <div>
      <div className="mb-6 flex gap-2">
        <Link href="/admin/orders" className={custom ? 'btn-ghost' : 'btn-wine'}>Store orders</Link>
        <Link href="/admin/orders?tab=custom" className={custom ? 'btn-wine' : 'btn-ghost'}>Custom requests</Link>
      </div>
      {custom ? <CustomList /> : <OrderList />}
    </div>
  );
}

async function OrderList() {
  const orders = await getOrders();
  if (!orders.length) return <p className="py-10 text-center text-espresso/60">No orders yet.</p>;
  return (
    <ul className="space-y-3">{orders.map((o) => (
      <li key={o.id} className="rounded-[2rem] bg-blush p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-medium">{o.customer_name} · <a className="underline" href={`tel:${o.phone}`}>{o.phone}</a></p><p className="text-sm text-espresso/70">{o.city}, {o.address}</p>{o.notes && <p className="text-sm">Note: {o.notes}</p>}<p className="text-xs text-espresso/50">{when(o.created_at)} · #{o.id.slice(0, 8)}</p></div>
          <Status id={o.id} table="orders" status={o.status} />
        </div>
        <ul className="mt-3 text-sm">{o.items.map((i) => <li key={i.id}>{i.title} × {i.qty} — {egp(i.unit_price * i.qty)}</li>)}</ul>
        <p className="mt-2 text-sm font-medium">{o.discount_code && `${o.discount_code} (−${egp(o.discount)}) · `}Total {egp(o.total)} · {o.payment_method}</p>
      </li>
    ))}</ul>
  );
}

async function CustomList() {
  const reqs = await getCustomRequests();
  if (!reqs.length) return <p className="py-10 text-center text-espresso/60">No custom requests yet.</p>;
  return (
    <ul className="space-y-3">{reqs.map((r) => (
      <li key={r.id} className="rounded-[2rem] bg-blush p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="font-medium">{r.customer_name} · <a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></p><p className="text-xs text-espresso/50">{when(r.created_at)}</p></div>
          <Status id={r.id} table="custom" status={r.status} />
        </div>
        <div className="mt-3 space-y-1"><Hand label="Left" h={r.sizes.left} /><Hand label="Right" h={r.sizes.right} /></div>
        {r.notes && <p className="mt-2 text-sm">{r.notes}</p>}
        {r.reference_image_url && <a href={r.reference_image_url} target="_blank" rel="noreferrer"><img src={r.reference_image_url} alt="Reference" className="mt-3 h-32 rounded-2xl object-cover" /></a>}
      </li>
    ))}</ul>
  );
}
