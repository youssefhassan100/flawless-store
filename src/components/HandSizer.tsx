'use client';
import { FINGERS, type Finger, type Sizes } from '@/lib/types';

const SIZES = Array.from({ length: 12 }, (_, i) => i);
const LEFT_ORDER: Finger[] = ['pinky', 'ring', 'middle', 'index', 'thumb']; // matches the printed sizing card
const RIGHT_ORDER: Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

function Nail({ size }: { size: number | null }) {
  const w = 14 + (size ?? 5) * 2.4;
  return (
    <svg viewBox="0 0 50 64" className="h-16 w-12" aria-hidden>
      <path d={`M${25 - w / 2} 62 V26 C${25 - w / 2} 6 ${25 + w / 2} 6 ${25 + w / 2} 26 V62 Z`} fill={size === null ? '#f0dcdd' : '#d4a3a6'} stroke="#7a1c28" strokeWidth="1.4" style={{ transition: 'all .25s' }} />
    </svg>
  );
}

function Hand({ side, order, sizes, onPick }: { side: 'left' | 'right'; order: Finger[]; sizes: Sizes[typeof side]; onPick: (f: Finger, v: number | null) => void }) {
  return (
    <fieldset className="rounded-[2rem] bg-blush p-5">
      <legend className="px-2 font-display text-xl text-wine">{side === 'left' ? 'Left hand (L)' : 'Right hand (R)'}</legend>
      <div className="grid grid-cols-5 gap-2">
        {order.map((f) => (
          <div key={f} className="flex flex-col items-center gap-2">
            <Nail size={sizes[f]} />
            <label className="text-xs capitalize" htmlFor={`${side}-${f}`}>{f}</label>
            <select id={`${side}-${f}`} className="field !px-2 !py-2 text-center" value={sizes[f] ?? ''} onChange={(e) => onPick(f, e.target.value === '' ? null : Number(e.target.value))}>
              <option value="">–</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function HandSizer({ value, onChange }: { value: Sizes; onChange: (s: Sizes) => void }) {
  const set = (side: 'left' | 'right') => (f: Finger, v: number | null) => onChange({ ...value, [side]: { ...value[side], [f]: v } });
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Hand side="left" order={LEFT_ORDER} sizes={value.left} onPick={set('left')} />
      <Hand side="right" order={RIGHT_ORDER} sizes={value.right} onPick={set('right')} />
    </div>
  );
}
export const sizesComplete = (s: Sizes) => FINGERS.every((f) => s.left[f] !== null && s.right[f] !== null);
