/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'primary': '#00458E'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'container': '0 0 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        // 'container-dark': '0 0 15px 0px rgba(0, 0, 0, 0.1), 0 4px 6px 0px rgba(0, 0, 0, 0.03)',
        // 'container-dark': '0 0 20px 0px rgba(0, 0, 0, 0.05), 0 4px 10px 0px rgba(0, 0, 0, 0.03)',
        'container-dark': '0 0 20px 20px rgba(0, 0, 0, 0.02), 0 4px 10px 2px rgba(0, 0, 0, 0.03)',
        'menu': '0 0 15px -3px rgba(0, 0, 0, 0.15), 0 0 6px -2px rgba(0, 0, 0, 0.1)'
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}