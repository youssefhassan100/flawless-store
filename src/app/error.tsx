'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-4xl text-wine">Something slipped</h1>
      <p className="mt-3 text-sm">We could not load this page. Check your connection and try again.</p>
      <button onClick={reset} className="btn-wine mt-6">Try again</button>
    </div>
  );
}
