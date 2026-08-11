import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Docker Desktop bind mounts don't propagate host fs events into the
    // container, so the default watcher never sees edits — poll instead.
    // Scoped away from backend/ (vendor/, storage/ logs) and .git — polling
    // those too made every request take 15s+.
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/backend/**', '**/docker/**', '**/.git/**'],
    },
  },
})
