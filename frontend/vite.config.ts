import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodeResolve({
      exportConditions: ['development']
    })
  ],
  resolve: {
    alias: {
      process: "process/browser"
    }
  }
});
