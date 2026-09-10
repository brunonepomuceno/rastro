import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for assets to allow deployment on any sub-path (GitHub Pages, etc)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  server: {
    host: true // Expõe o servidor para a rede local (celular)
  }
});
