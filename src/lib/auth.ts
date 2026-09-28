// Works in both Edge (middleware) and Node (server actions).
const enc = new TextEncoder();
async function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const COOKIE = 'flawless_admin';
export async function makeToken() {
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return `${exp}.${await sign(exp)}`;
}
export async function verifyToken(token?: string) {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return sig === (await sign(exp));
}
