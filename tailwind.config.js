/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#475569',
        success: '#16A34A',
        danger: '#DC2626',
        background: '#F8FAFC',
        surface: '#FFFFFF',
      }
    },
  },
  plugins: [],
};