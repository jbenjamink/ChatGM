/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('flowbite/plugin'),
    function ({ addVariant, prefix, e }) {
      addVariant('modern', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${prefix('modern')}${separator}${e(className)}`;
        });
      });
      addVariant('retro', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${prefix('retro')}${separator}${e(className)}`;
        });
      });
    }
  ]
};
