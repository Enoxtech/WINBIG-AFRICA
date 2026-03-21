import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0B1F3A',
        'matte-black': '#0A0A0A',
        'gold': '#D4AF37',
        'light-gray': '#F8F9FB',
        'dark-text': '#1A1A1A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.08)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'gold': '0 4px 20px rgba(212,175,55,0.25)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
