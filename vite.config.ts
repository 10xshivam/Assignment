import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for SoundHelix
      '/soundhelix': {
        target: 'https://www.soundhelix.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/soundhelix/, '')
      },
      // Proxy for Sample Library
      '/samplelib': {
        target: 'https://samplelib.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/samplelib/, '')
      },
      // Proxy for BigSoundBank
      '/bigsoundbank': {
        target: 'https://bigsoundbank.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bigsoundbank/, '')
      },
      // Proxy for Codepen assets
      '/codepen': {
        target: 'https://assets.codepen.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/codepen/, '')
      }
    }
  }
})
