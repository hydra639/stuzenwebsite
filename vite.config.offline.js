import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Builds a split, self-contained offline edition for local viewing:
 *
 *   offline/STUZEN-Website/index.html
 *   offline/STUZEN-Website/styles.css
 *   offline/STUZEN-Website/app.js
 *   offline/STUZEN-Website/assets/*.svg|png
 *
 * The bundle is emitted as a classic IIFE script instead of an ES module so it
 * still runs when index.html is opened directly from file:// (browsers block
 * module scripts from local files because of CORS). HashRouter is used by
 * src/main.offline.jsx for the same reason.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'offline/STUZEN-Website',
    emptyOutDir: true,
    copyPublicDir: false,
    target: 'es2018',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    modulePreload: false,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: 'offline.html',
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] || assetInfo.name || '';
          return name.endsWith('.css') ? 'styles.css' : 'assets/[name][extname]';
        },
      },
    },
  },
});
