import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLEFILE=1 (see scripts/build-single.mjs) bundles everything — JS + CSS —
// into one self-contained dist-single/index.html. The normal `npm run build`
// used by Vercel is unaffected.
const singleFile = process.env.SINGLEFILE === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  build: singleFile
    ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000, cssCodeSplit: false }
    : {},
})
