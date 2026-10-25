import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.warn(`\x1b[33m[PromptForge Notice]\x1b[0m Backend API not reachable at http://127.0.0.1:8000 for ${req.url}. Please start the backend with 'python run.py' in a separate terminal.`);
            if (res && res.writeHead && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: 'PromptForge backend server is offline on port 8000. Please start it using "python run.py" or "start.bat".',
                code: 'BACKEND_OFFLINE'
              }));
            }
          });
        }
      }
    }
  }
})
