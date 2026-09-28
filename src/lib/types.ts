export type Product = {
  id: string; title: string; description: string | null; price: number; sale_price: number | null;
  category: string; images: string[]; is_bestseller: boolean; is_active: boolean; created_at: string;
};
export const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
export type Finger = (typeof FINGERS)[number];
export type HandSizes = Record<Finger, number | null>;
export type Sizes = { left: HandSizes; right: HandSizes };
export type OrderStatus = 'pending' | 'shipped' | 'delivered';
export type OrderItem = { id: string; title: string; unit_price: number; qty: number };
export type Order = {
  id: string; customer_name: string; phone: string; city: string; address: string; notes: string | null;
  items: OrderItem[]; subtotal: number; discount: number; discount_code: string | null; total: number;
  payment_method: string; status: OrderStatus; created_at: string;
};
export type CustomRequest = {
  id: string; customer_name: string; phone: string; sizes: Sizes; notes: string | null;
  reference_image_url: string | null; status: OrderStatus; created_at: string;
};
export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

export const emptyHand = (): HandSizes => ({ thumb: null, index: null, middle: null, ring: null, pinky: null });
export const unitPrice = (p: Pick<Product, 'price' | 'sale_price'>) => p.sale_price ?? p.price;
export const discountPct = (p: Pick<Product, 'price' | 'sale_price'>) =>
  p.sale_price && p.sale_price < p.price ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
export const egp = (n: number) => `${Math.round(n).toLocaleString('en-US')} EGP`;
