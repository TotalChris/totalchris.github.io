/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './title.html'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
