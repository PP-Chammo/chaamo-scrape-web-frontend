import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/chaamo-scrape-web-frontend/', // github pages pathname
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
