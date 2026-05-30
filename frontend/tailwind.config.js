/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ow: {
          // Real One Way brand palette (harvested from onewayintercambio.com.br)
          teal: '#0D7291',
          blue: '#0E7C9B',        // primary accent (re-skins existing text-ow-blue/bg-ow-blue)
          'blue-dark': '#0A4D63',
          navy: '#08323F',         // deep teal for dark surfaces / overlays
          sky: '#5FC9D6',
          coral: '#FF7350',
          'coral-dark': '#E85636',
          gold: '#F9AD4D',
          sand: '#FEF6ED',         // cream page background
          'sand-deep': '#FDEAD2',
          ink: '#0B2530',          // warm near-black text
        },
        sidebar: '#08323F',
        'sidebar-hover': '#0E4A5C',
      },
      fontFamily: {
        sans: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['"Sofia Sans Extra Condensed"', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 6px 24px -8px rgba(13, 114, 145, 0.18)',
        ticket: '0 10px 30px -12px rgba(8, 50, 63, 0.35)',
      },
    },
  },
  plugins: [],
}
