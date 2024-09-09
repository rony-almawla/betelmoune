// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        palepeach: '#98fb98',
        customGreen: 'rgb(228, 255, 191)',
      },
      fontFamily: {
        sans: ['YourCustomFont', 'Arial', 'sans-serif'],
        serif: ['YourCustomSerifFont', 'Georgia', 'serif'],
        mono: ['YourCustomMonoFont', 'Courier New', 'monospace'],
      },
      height: {
        '43rem': '43rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
