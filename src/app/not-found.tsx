import Link from 'next/link';
export default function NotFound() {
  return <div className="mx-auto max-w-md px-5 py-24 text-center"><h1 className="font-display text-4xl text-wine">Page not found</h1><Link href="/" className="btn-wine mt-6">Back home</Link></div>;
}
