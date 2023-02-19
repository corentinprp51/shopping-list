/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#FFF',
        'neutral-20': '#D9D9D9',
        'primary-50': '#E23E3E'
      }
    },
  },
  plugins: [],
}
