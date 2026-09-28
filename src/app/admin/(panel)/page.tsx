import { getProducts } from '@/lib/queries';
import { deleteProduct, toggleBestseller } from '@/lib/actions/admin';
import { egp, unitPrice } from '@/lib/types';
import { ProductForm } from './ProductForm';

export default async function AdminProducts() {
  const products = await getProducts({ all: true });
  return (
    <div className="space-y-8">
      <details className="rounded-[2rem] bg-blush p-6"><summary className="cursor-pointer font-display text-xl text-wine">Add a product</summary><div className="mt-4"><ProductForm /></div></details>
      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p.id} className="rounded-[2rem] bg-blush p-4">
            <div className="flex flex-wrap items-center gap-4">
              {p.images[0] ? <img src={p.images[0]} alt="" className="h-16 w-14 rounded-xl object-cover" /> : <div className="almond h-16 w-12 bg-rose/40" />}
              <div className="min-w-0 flex-1"><p className="font-medium">{p.title} {!p.is_active && <span className="text-xs text-espresso/50">(hidden)</span>}</p><p className="text-sm text-espresso/70">{p.category} · {egp(unitPrice(p))}</p></div>
              <form action={toggleBestseller}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="value" value={String(p.is_bestseller)} />
                <button className={p.is_bestseller ? 'btn-wine !py-2' : 'btn-ghost !py-2'}>{p.is_bestseller ? 'Bestseller ✓' : 'Mark bestseller'}</button></form>
              <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="text-sm text-wine underline">Delete</button></form>
            </div>
            <details className="mt-3"><summary className="cursor-pointer text-sm underline">Edit</summary><div className="mt-3"><ProductForm p={p} /></div></details>
          </li>
        ))}
        {products.length === 0 && <li className="py-10 text-center text-espresso/60">No products yet. Add your first set above.</li>}
      </ul>
    </div>
  );
}
