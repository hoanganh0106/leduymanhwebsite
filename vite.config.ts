import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the React runtime in its own long-cached chunk so app changes
        // don't bust it, and it parses separately from app code.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
})
