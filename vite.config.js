import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/que-paises-ha-visitado-luisito-comunica-react',
  plugins: [react()],
})
