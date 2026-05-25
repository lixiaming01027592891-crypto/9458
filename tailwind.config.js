/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        primary: '#001449',
        'primary-light': '#002266',
        'primary-dark': '#000D33',
        accent: '#FF7A00',
        surface: '#F5F5F5',
        muted: '#858585',
        border: '#E5E5E5',
        line: '#06C755',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};