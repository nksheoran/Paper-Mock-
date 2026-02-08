import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // The dot-slash ./ is the magic fix for subfolder 404s
})
