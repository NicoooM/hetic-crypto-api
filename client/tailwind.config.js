/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#003CE3',
            hover: '#0135C7',
          },
          text: '#C0C0C0'
        }
      },
    },
    plugins: [],
  };