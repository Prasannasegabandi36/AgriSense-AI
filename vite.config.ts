import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '^/api/v1(?:/|$)': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (error, _request, response) => {
            if (!('code' in error) || error.code !== 'ECONNREFUSED') return;
            if (!response || !('writeHead' in response) || response.headersSent || response.writableEnded) return;

            response.writeHead(503, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
              message: 'The local AgriSensing backend is offline. Open a second terminal in the project folder, run python start_backend.py, then try again.',
            }));
          });
        },
      },
    },
  },
});
