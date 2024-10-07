import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),inject(['crypto','buffer'])],
  define: {
    'window.global': {},
    'process.env': {},
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
      ],
    }
  },
})

