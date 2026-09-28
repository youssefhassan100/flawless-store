import { saveProduct } from '@/lib/actions/admin';
import type { Product } from '@/lib/types';

export function ProductForm({ p }: { p?: Product }) {
  return (
    <form action={saveProduct} className="grid gap-3 md:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="md:col-span-2"><label className="label">Title</label><input name="title" required defaultValue={p?.title} className="field" /></div>
      <div className="md:col-span-2"><label className="label">Description</label><textarea name="description" rows={3} defaultValue={p?.description ?? ''} className="field" /></div>
      <div><label className="label">Price (EGP)</label><input name="price" type="number" step="0.01" min="1" required defaultValue={p?.price} className="field" /></div>
      <div><label className="label">Sale price (optional)</label><input name="sale_price" type="number" step="0.01" min="1" defaultValue={p?.sale_price ?? ''} className="field" /></div>
      <div><label className="label">Category</label><input name="category" required defaultValue={p?.category ?? 'Ready to wear'} className="field" /></div>
      <div><label className="label">Add images</label><input name="images" type="file" accept="image/*" multiple className="field" /></div>
      {p && p.images.length > 0 && (
        <div className="flex flex-wrap gap-3 md:col-span-2">
          {p.images.map((src) => <label key={src} className="text-xs"><img src={src} alt="" className="mb-1 h-20 w-16 rounded-xl object-cover" /><input type="checkbox" name="keep" value={src} defaultChecked /> keep</label>)}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_bestseller" defaultChecked={p?.is_bestseller} /> Bestseller</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={p?.is_active ?? true} /> Visible in store</label>
      <div className="md:col-span-2"><button className="btn-wine">{p ? 'Save changes' : 'Add product'}</button></div>
    </form>
  );
}
