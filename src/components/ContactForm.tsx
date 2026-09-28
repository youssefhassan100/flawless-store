'use client';
import { useState, useTransition } from 'react';
import { sendContact } from '@/lib/actions/shop';

export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sent' | string>('idle');
  const [pending, start] = useTransition();
  if (state === 'sent') return <p className="rounded-3xl bg-blush p-6">Thank you. We will reply soon.</p>;
  return (
    <form className="space-y-4" action={(fd) => start(async () => {
      const r = await sendContact({ name: fd.get('name'), phone: fd.get('phone'), message: fd.get('message') });
      setState(r.ok ? 'sent' : r.error);
    })}>
      <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" required className="field" /></div>
      <div><label className="label" htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required className="field" /></div>
      <div><label className="label" htmlFor="message">Message</label><textarea id="message" name="message" required rows={5} className="field" /></div>
      {state !== 'idle' && <p role="alert" className="text-sm text-wine">{state}</p>}
      <button className="btn-wine" disabled={pending}>{pending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
