import type { Metadata } from 'next';
import { CustomForm } from '@/components/CustomForm';
export const metadata: Metadata = { title: 'Custom order' };
export default function Custom() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-5xl text-wine">Custom made request</h1>
      <p className="mb-10 mt-3 text-espresso/70">Tell us your sizes and the design you imagine. Need help measuring? See the <a href="/sizing" className="underline">sizing guide</a>.</p>
      <CustomForm />
    </div>
  );
}
