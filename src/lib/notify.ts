import 'server-only';

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Sends to Telegram and/or Resend, whichever is configured. Never throws. */
export async function notifyOwner(subject: string, html: string) {
  const jobs: Promise<unknown>[] = [];
  const { TELEGRAM_BOT_TOKEN: bot, TELEGRAM_CHAT_ID: chat, RESEND_API_KEY: resend, OWNER_EMAIL: to } = process.env;
  if (bot && chat) {
    jobs.push(fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: `<b>${subject}</b>\n\n${html}`, parse_mode: 'HTML' }),
    }));
  }
  if (resend && to) {
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${resend}` },
      body: JSON.stringify({ from: process.env.RESEND_FROM ?? 'Flawless <onboarding@resend.dev>', to, subject, html: `<pre style="font:14px sans-serif">${html}</pre>` }),
    }));
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('notify failed', r.reason));
}
