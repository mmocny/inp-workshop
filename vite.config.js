// vite.config.js
import { resolve } from 'path';
import { sync } from 'glob';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/inp-workshop/',
  root: './answers/',
  build: {
    emptyOutDir: true,
    rollupOptions: {
		input: [
			//resolve(__dirname, 'index.html'),
			...sync(resolve(__dirname, "answers", "*.html")),
		],
    },
  },
})
