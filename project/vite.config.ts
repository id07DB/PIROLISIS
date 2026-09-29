import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/PIROLISIS/',
  build: {
    outDir: 'docs', // Cambia la salida de dist a docs
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});