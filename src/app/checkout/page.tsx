import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
export const metadata: Metadata = { title: 'Checkout' };
export default function Checkout() {
  return <div className="mx-auto max-w-5xl px-5 py-14"><h1 className="mb-8 font-display text-5xl text-wine">Checkout</h1><CheckoutForm /></div>;
}
