/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#FF5F2D',
            hover: '#C44B25',
          },
          text: '#C0C0C0'
        }
      },
    },
    plugins: [],
  };