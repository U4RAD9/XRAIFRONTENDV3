import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,

    allowedHosts: [
      'test2.xraidigital.com',
      'admin.xraidigital.com',
      'xraidigital.com',
    ],

    proxy: {
      '/cbackend': {
        target: 'https://cbackend.xraidigital.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/cbackend/, ''),
      },
    },
  },
})

