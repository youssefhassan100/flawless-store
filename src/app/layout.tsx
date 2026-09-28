import type { Metadata } from 'next';
import { Fraunces, Figtree } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['SOFT', 'opsz'] });
const body = Figtree({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: { default: 'Flawless · Handmade press-on nails', template: '%s · Flawless' },
  description: 'Handmade, reusable, custom made press-on nails.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
