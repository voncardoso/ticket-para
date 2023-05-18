/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#16181E",
        "gray-100": "#9BA2AD",
        "gray-300": "#2B2F3B",
        "gray-400": "#21242D",
        "green-50": "#D7FAF8",
        "green-100": "#00CCC0",
        "green-300": "#00B9AE",
        "green-400": "#00948B",
        "green-800": "#212C2B",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
