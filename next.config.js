/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"], // Update this based on your font choice
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
