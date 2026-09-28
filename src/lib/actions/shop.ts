'use server';
import { z } from 'zod';
import { db, uploadImage } from '../db';
import { esc, notifyOwner } from '../notify';
import { FINGERS, egp, unitPrice, type ActionResult, type OrderItem, type Product } from '../types';

const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,16}$/, 'Enter a valid phone number'),
  city: z.string().trim().min(2).max(60),
  address: z.string().trim().min(6).max(300),
  notes: z.string().trim().max(300).optional(),
  code: z.string().trim().max(30).optional(),
  items: z.array(z.object({ id: z.string().uuid(), qty: z.number().int().min(1).max(20) })).min(1).max(40),
});

async function findCode(code?: string) {
  if (!code) return null;
  const { data } = await db().from('discount_codes').select('code, percent').eq('code', code.toUpperCase()).eq('active', true).maybeSingle();
  return data as { code: string; percent: number } | null;
}

export async function checkDiscountCode(code: string): Promise<ActionResult<{ code: string; percent: number }>> {
  const found = await findCode(code);
  return found ? { ok: true, ...found } : { ok: false, error: 'That code is not valid' };
}

export async function placeOrder(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check your details' };
  const d = parsed.data;
  const client = db();
  const { data: products } = await client.from('products').select('*').in('id', d.items.map((i) => i.id)).eq('is_active', true);
  const byId = new Map((products as Product[] | null)?.map((p) => [p.id, p]));
  const items: OrderItem[] = [];
  for (const line of d.items) {
    const p = byId.get(line.id);
    if (!p) return { ok: false, error: 'An item in your cart is no longer available' };
    items.push({ id: p.id, title: p.title, unit_price: unitPrice(p), qty: line.qty });
  }
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const code = await findCode(d.code);
  const discount = code ? Math.round((subtotal * code.percent) / 100) : 0;
  const total = subtotal - discount;
  const { data, error } = await client.from('orders').insert({
    customer_name: d.name, phone: d.phone, city: d.city, address: d.address, notes: d.notes || null,
    items, subtotal, discount, discount_code: code?.code ?? null, total, payment_method: 'COD',
  }).select('id').single();
  if (error || !data) return { ok: false, error: 'We could not place your order. Please try again.' };
  await notifyOwner('🛍 New order', [
    `Name: ${esc(d.name)}`, `Phone: ${esc(d.phone)}`, `City: ${esc(d.city)}`, `Address: ${esc(d.address)}`,
    d.notes ? `Notes: ${esc(d.notes)}` : '', '',
    ...items.map((i) => `• ${esc(i.title)} × ${i.qty} — ${egp(i.unit_price * i.qty)}`), '',
    code ? `Code ${code.code}: −${egp(discount)}` : '', `<b>Total (COD): ${egp(total)}</b>`,
  ].filter((l, i, a) => l || a[i - 1]).join('\n'));
  return { ok: true, id: data.id };
}

const fingerSize = z.coerce.number().int().min(0).max(11);
const handSchema = z.object(Object.fromEntries(FINGERS.map((f) => [f, fingerSize])) as Record<(typeof FINGERS)[number], typeof fingerSize>);
const customSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,16}$/, 'Enter a valid phone number'),
  notes: z.string().trim().max(800).optional(),
  sizes: z.object({ left: handSchema, right: handSchema }, { errorMap: () => ({ message: 'Pick a size for every finger on both hands' }) }),
});

export async function submitCustomRequest(form: FormData): Promise<ActionResult> {
  let sizes: unknown;
  try { sizes = JSON.parse(String(form.get('sizes'))); } catch { sizes = null; }
  const parsed = customSchema.safeParse({ name: form.get('name'), phone: form.get('phone'), notes: form.get('notes') || undefined, sizes });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check your details' };
  const d = parsed.data;
  let imageUrl: string | null = null;
  const file = form.get('reference');
  try {
    if (file instanceof File && file.size > 0) imageUrl = await uploadImage(file, 'custom');
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : 'Image upload failed' }; }
  const { error } = await db().from('custom_requests').insert({ customer_name: d.name, phone: d.phone, sizes: d.sizes, notes: d.notes ?? null, reference_image_url: imageUrl });
  if (error) return { ok: false, error: 'We could not save your request. Please try again.' };
  const hand = (h: Record<string, number>) => FINGERS.map((f) => `${f[0].toUpperCase()}${h[f]}`).join(' ');
  await notifyOwner('💅 New custom request', [
    `Name: ${esc(d.name)}`, `Phone: ${esc(d.phone)}`, `Left  (T I M R P): ${hand(d.sizes.left)}`, `Right (T I M R P): ${hand(d.sizes.right)}`,
    d.notes ? `Design notes: ${esc(d.notes)}` : '', imageUrl ? `Reference: ${imageUrl}` : '',
  ].filter(Boolean).join('\n'));
  return { ok: true };
}

const contactSchema = z.object({ name: z.string().trim().min(2).max(80), phone: z.string().trim().regex(/^[0-9+\s-]{8,16}$/, 'Enter a valid phone number'), message: z.string().trim().min(3).max(1000) });
export async function sendContact(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check your details' };
  const { error } = await db().from('messages').insert(parsed.data);
  if (error) return { ok: false, error: 'Message not sent. Please try again.' };
  await notifyOwner('✉️ New message', `From: ${esc(parsed.data.name)} (${esc(parsed.data.phone)})\n\n${esc(parsed.data.message)}`);
  return { ok: true };
}
