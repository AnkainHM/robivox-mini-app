import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/robivox-mini-app/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});