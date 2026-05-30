/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ow: {
          navy: '#0A2540',
          blue: '#1E6FD9',
          'blue-dark': '#1559B0',
          sky: '#38BDF8',
          teal: '#0EA5A4',
          coral: '#FF6B4A',
          'coral-dark': '#E85636',
          sand: '#FCEFE3',
          gold: '#F4B740',
        },
        sidebar: '#0A2540',
        'sidebar-hover': '#13314F',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
