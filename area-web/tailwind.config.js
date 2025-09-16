/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#071C18',
        'primary': '#27917E',
        'primaryDark': '#208471',
        'secondary': '#D7F4EF',
        'background': '#FBFEFD',
        'accent': '#27302D',
        'facebook': '#1877F2',
        'twitter': '#1DA1F2',
        'instagram': '#E4405F',
        'gmail': '#D44638',
        'github': '#181717',
        'stackoverflow': '#F48024',
        'weatherapi': '#1E90FF',
        'dayssincelastjavascriptframework': '#FDD835',
        'npmjs': '#CB3837',
        'discord': '#5865F2'
      },
      backgroundImage: {
        'hero-image': "url('./assets/hero-image.jpg')",
      },
    },
  },
  plugins: [],
}

