/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
    './node_modules/tailwindcss-primeui/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        backGround: 'var(--color-background)',
        text: 'var(--color-text)',
        mainButton: 'var(--color-main-button)',
        backGroundPolygon: 'var(--color-background-polygon)',
        h2: 'var(--color-text-title)',
        header: 'var(--header-modal)',

      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
};
