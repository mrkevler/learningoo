module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Flamingo brand magenta */
        brand: {
          DEFAULT: "#ff0099",
          dark: "#e60087",
        },
        /* Accent Colors */
        accent: {
          DEFAULT: "#ff0099", // primary accent (magenta)
          pink: "#ff0099",
          purple: "#8b5cf6",
          green: "#10b981",
          orange: "#f59e0b",
          red: "#ef4444",
        },
        /* Magenta Color Palette */
        magenta: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        /* Dark mode overrides can be referenced via CSS variables or the dark: variant */
        surface: "#373739", // retained fallback surface color
      },
      fontFamily: {
        /* Primary and display fonts */
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["Cal Sans", "Inter", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      /* Typography scale overrides (optional: Tailwind already provides similar sizes) */
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
