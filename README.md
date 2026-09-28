# Flawless — press-on nails store

Next.js 15 (App Router, TypeScript) + Tailwind + Supabase. Cash on delivery, custom-request form, admin panel, instant Telegram/email alerts.

## 1. Supabase
1. Create a project at supabase.com.
2. SQL Editor → paste `supabase/schema.sql` → Run (creates tables, RLS, the public `flawless` image bucket, and a `WELCOME10` code).
3. Project Settings → API → copy the **Project URL** and the **service_role** key.

## 2. Telegram alerts (free, ~2 min)
1. In Telegram, message **@BotFather** → `/newbot` → copy the token.
2. Send any message to your new bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`.
(Optional email: create a Resend key and set `RESEND_API_KEY` + `OWNER_EMAIL`.)

## 3. Run locally
```bash
cp .env.example .env.local   # fill in every value
npm install
npm run dev
```
Admin panel: `/admin` (password = `ADMIN_PASSWORD`).

## 4. Deploy to Vercel
1. Push the folder to GitHub.
2. vercel.com → Add New → Project → import the repo (framework auto-detected).
3. Paste every variable from `.env.local` into Environment Variables → Deploy.

## Notes
- The service-role key is only used in server code; RLS blocks the public key entirely.
- Prices are recalculated on the server at checkout; the browser cart is never trusted.
- Add discount codes in Supabase → Table Editor → `discount_codes`.
- Put your logo in `public/` and swap it into `Header.tsx` if you want the image instead of the text wordmark.
