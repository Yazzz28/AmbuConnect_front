module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
    './node_modules/tailwindcss-primeui/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        backGround: 'var(--color-background)',
        backGroundInput: 'var(--color-background-input)',
        borderInput: 'var(--color-border-input)',
        text: 'var(--color-text)',
        textInput: 'var(--color-text-input)',
        textPopPup: 'var(--color-text-popup)',
        textInscription: 'var(--color-text-inscription)',
        textTitle : 'var(--color-text-title)',
        mainButton: 'var(--color-main-button)',
        backGroundPolygon: 'var(--color-background-polygon)',
        crossCancel: 'var(--cross-cancel)',
        h2: 'var(--color-text-title)',
        header: 'var(--header-modal)',
        textInvalidated: "var(--color-text-invalidated-form)",
        skyBlueButton: "var(--sky-blue-button)",
        textNavbar: "var(--color-navbar-texte)",
        textNavbarConnexion: "var(--color-navbar-text-connexion",
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
};
