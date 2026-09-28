import type { Metadata } from 'next';
import { SizingGuide } from '@/components/SizingGuide';
export const metadata: Metadata = { title: 'Sizing guide' };
export default function Sizing() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-5xl text-wine">Sizing kit</h1>
      <p className="mb-10 mt-3 text-espresso/70">How to measure your nails at home.</p>
      <SizingGuide />
    </div>
  );
}
