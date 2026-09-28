'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { COOKIE, makeToken, verifyToken } from '../auth';
import { db, uploadImage } from '../db';

async function guard() {
  if (!(await verifyToken((await cookies()).get(COOKIE)?.value))) throw new Error('Unauthorized');
}

export async function login(_: string | null, form: FormData): Promise<string | null> {
  if (String(form.get('password')) !== process.env.ADMIN_PASSWORD || !process.env.ADMIN_PASSWORD) return 'Wrong password';
  (await cookies()).set(COOKIE, await makeToken(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 3600 });
  redirect('/admin');
}
export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect('/admin/login');
}

const productSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1500).optional(),
  price: z.coerce.number().positive(),
  sale_price: z.preprocess((v) => (v === '' || v == null ? null : v), z.coerce.number().positive().nullable()),
  category: z.string().trim().min(2).max(40),
});

export async function saveProduct(form: FormData) {
  await guard();
  const d = productSchema.parse({
    title: form.get('title'), description: form.get('description') || undefined, price: form.get('price'),
    sale_price: form.get('sale_price'), category: form.get('category'),
  });
  if (d.sale_price !== null && d.sale_price >= d.price) throw new Error('Sale price must be lower than price');
  const kept = form.getAll('keep').map(String);
  const uploaded: string[] = [];
  for (const f of form.getAll('images')) if (f instanceof File && f.size > 0) uploaded.push(await uploadImage(f, 'products'));
  const row = { ...d, images: [...kept, ...uploaded], is_bestseller: form.get('is_bestseller') === 'on', is_active: form.get('is_active') === 'on' };
  const id = String(form.get('id') || '');
  const { error } = id ? await db().from('products').update(row).eq('id', id) : await db().from('products').insert(row);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
}
export async function deleteProduct(form: FormData) {
  await guard();
  await db().from('products').delete().eq('id', String(form.get('id')));
  revalidatePath('/', 'layout');
}
export async function toggleBestseller(form: FormData) {
  await guard();
  await db().from('products').update({ is_bestseller: form.get('value') !== 'true' }).eq('id', String(form.get('id')));
  revalidatePath('/', 'layout');
}
export async function setStatus(form: FormData) {
  await guard();
  const table = form.get('table') === 'custom' ? 'custom_requests' : 'orders';
  const status = z.enum(['pending', 'shipped', 'delivered']).parse(form.get('status'));
  await db().from(table).update({ status }).eq('id', String(form.get('id')));
  revalidatePath('/admin/orders');
}
