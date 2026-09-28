import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed');
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be under 5 MB');
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const client = db();
  const { error } = await client.storage.from('flawless').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) throw new Error(error.message);
  return client.storage.from('flawless').getPublicUrl(path).data.publicUrl;
}
