import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig ({
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    include: ['monaco-editor']
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src/"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@src/styles/mixins";\n`,
      },
    },
  },
});
