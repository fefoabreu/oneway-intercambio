import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  server: {
    port: 5173,
    proxy: {
      // dev only: forwards live-AI calls to the FastAPI backend (backend/main.py)
      '/api': 'http://localhost:8000',
    },
  },
})
