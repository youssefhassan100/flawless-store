import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { SITE } from '@/lib/config';
export const metadata: Metadata = { title: 'Contact' };
export default function Contact() {
  return (
    <div className="mx-auto grid max-w-4xl gap-12 px-5 py-14 md:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl text-wine">Say hello</h1>
        <p className="mt-4 text-espresso/70">Questions about sizing, orders or a custom design? Message us.</p>
        <ul className="mt-6 space-y-2 text-sm">
          {SITE.phone && <li><a className="underline" href={`https://wa.me/2${SITE.phone.replace(/\D/g, '')}`}>WhatsApp {SITE.phone}</a></li>}
          {SITE.instagram && <li><a className="underline" href={SITE.instagram}>Instagram</a></li>}
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
