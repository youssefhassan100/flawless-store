'use client';
import { useActionState } from 'react';
import { login } from '@/lib/actions/admin';

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="font-display text-4xl text-wine">Owner login</h1>
      <form action={action} className="mt-6 space-y-4">
        <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="field" autoComplete="current-password" /></div>
        {error && <p role="alert" className="text-sm text-wine">{error}</p>}
        <button className="btn-wine w-full" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
