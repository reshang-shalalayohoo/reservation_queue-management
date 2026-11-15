import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In Docker or dev, proxy to backend port 4003
const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:4003';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/socket.io': {
        target: API_TARGET,
        ws: true,
      },
    },
  },
});
