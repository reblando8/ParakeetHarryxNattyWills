// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
  // Ensure Tailwind processes your HTML and CSS files
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './public/index.html',
  ],
};
