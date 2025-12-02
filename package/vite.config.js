/**
 * @fileoverview Vite configuration file for the React application.
 * Configures base paths, aliases, esbuild/optimization settings for JSX in .js files,
 * a local HTTPS development server, build settings, and plugins (React, SVGR, Visualizer).
 * @module vite.config
 * @see https://vitejs.dev/config/
 * @author Rakshana
 * @date 01/11/2025
 * @since 1.0.0
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';


/**
 * Defines the Vite configuration object.
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  /**
   * Base public path when served in production.
   * './' ensures all asset paths are relative to index.html.
   */
  base: './', // ✅ needed for relative paths in production

  /**
   * Configuration for resolving modules via aliases.
   */
  resolve: {
    alias: {
      /** Maps 'src' to the absolute path of the source directory. */
      src: resolve(__dirname, 'src'),
    },
  },

  /**
   * Configuration for esbuild during the build process.
   */
  esbuild: {
    /** Treat included files as JSX. */
    loader: 'jsx',
    /** Regex to include specific files for JSX loading. */
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  /**
   * Configuration for dependency pre-bundling during development.
   */
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          /** Custom plugin to load .js files in src as JSX for dependency optimization. */
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

  /**
   * Configuration for the development server.
   */
  server: {
    /** Listen on all network interfaces (0.0.0.0). */
    host: true,
    /** Fixed port for the development server. */
    port: 2519, // ✅ Fixed port updated
    /** Configuration for HTTPS via local certificates. */
    https: {
      key: fsSync.readFileSync(resolve(__dirname, 'key.pem')),
      cert: fsSync.readFileSync(resolve(__dirname, 'cert.pem')),
    },
  },

  /**
   * Configuration for the production build process.
   */
  build: {
    /** Directory for assets relative to the build output directory. */
    assetsDir: 'assets',
    /** Sets the chunk size warning limit to 500kb. */
    chunkSizeWarningLimit: 500,
    /** Uses esbuild for minification, a safer default. */
    minify: 'esbuild', // ✅ safer default
    /** Custom Rollup options for fine-grained control over the output. */
    rollupOptions: {
      output: {
        /** Disables Rollup's default code splitting into shared chunks. */
        manualChunks: undefined,
        /** Pattern for main entry files. */
        entryFileNames: 'assets/[name].[hash].js',
        /** Pattern for async and third-party chunks. */
        chunkFileNames: 'assets/[name].[hash].js',
        /** Pattern for assets (images, fonts, css, etc.). */
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },

  /**
   * Array of plugins used by Vite.
   */
  plugins: [
    /** Supports importing SVGs as React components. */
    svgr(),
    /** Provides React Fast Refresh support and Babel transform. */
    react(),
    /** Rollup plugin to visualize bundle size (disabled by default). */
    visualizer({ open: false }),
  ],
});
