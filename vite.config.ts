import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
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
})
