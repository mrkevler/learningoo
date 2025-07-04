module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff0099", // hot magenta
          dark: "#e60087",
        },
        accent: {
          DEFAULT: "#00f6ff", // neon turquoise
          dark: "#00d6e0",
        },
        surface: "#373739",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
