import Link from 'next/link';
export default async function Success({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-display text-5xl text-wine">Thank you</h1>
      <p className="mt-4">Your order {id ? <b>#{id}</b> : ''} is in. We will call you to confirm delivery. Pay in cash on arrival.</p>
      <Link href="/shop" className="btn-wine mt-8">Keep browsing</Link>
    </div>
  );
}
