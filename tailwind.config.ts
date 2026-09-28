import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { wine: { DEFAULT: '#6d1b24', deep: '#7a1c28' }, rose: { DEFAULT: '#d4a3a6' }, cream: '#fbf7f6', blush: '#f8f1f0', espresso: '#2c1a1d' },
      fontFamily: { display: ['var(--font-display)', 'Georgia', 'serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 10px 30px -12px rgba(109,27,36,.25)' },
      keyframes: { slide: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } }, rise: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } } },
      animation: { slide: 'slide .35s cubic-bezier(.2,.8,.2,1)', rise: 'rise .8s cubic-bezier(.2,.8,.2,1) both' },
    },
  },
} satisfies Config;
