import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

export default defineConfig({
  base: './',   // ✅ needed for relative paths in production

  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },

  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad(
              { filter: /src[\/\\].*\.js$/ },
              async (args) => ({
                loader: 'jsx',
                contents: await fs.readFile(args.path, 'utf8'),
              })
            );
          },
        },
      ],
    },
  },

  server: {
    host: true,
    port: 3717,
    https: {
      key: fsSync.readFileSync(resolve(__dirname, 'key.pem')),
      cert: fsSync.readFileSync(resolve(__dirname, 'cert.pem')),
    },
  },

  build: {
    assetsDir: 'assets',
    chunkSizeWarningLimit: 500,
    minify: 'esbuild',   // ✅ safer default (switch to 'terser' if still issues)
    rollupOptions: {
      output: {
        manualChunks: undefined,

        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },

  plugins: [
    svgr(),
    react(),
    visualizer({ open: false }),
  ],
});
