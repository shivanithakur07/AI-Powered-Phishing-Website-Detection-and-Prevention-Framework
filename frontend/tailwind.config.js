/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0E14',
        surface: '#151A22',
        surfaceHover: '#1C232E',
        textPrimary: '#E2E8F0',
        textSecondary: '#94A3B8',
        border: '#2E3B4E',
        primary: '#06B6D4', // Cyan accent
        success: '#10B981', // Safe
        warning: '#F59E0B', // Suspicious
        danger: '#EF4444',  // Phishing
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
