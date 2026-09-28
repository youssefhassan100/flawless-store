import 'server-only';
import { db } from './db';
import type { CustomRequest, Order, Product } from './types';

export async function getProducts(opts: { bestsellers?: boolean; all?: boolean } = {}): Promise<Product[]> {
  let q = db().from('products').select('*').order('created_at', { ascending: false });
  if (!opts.all) q = q.eq('is_active', true);
  if (opts.bestsellers) q = q.eq('is_bestseller', true).limit(8);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await db().from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}
export async function getCustomRequests(): Promise<CustomRequest[]> {
  const { data, error } = await db().from('custom_requests').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CustomRequest[];
}
