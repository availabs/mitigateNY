import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

//console.log('what', path.resolve(__dirname, './src'))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    outDir: './build'
  },
  resolve: {
    alias: [
      { find: "~", replacement: resolve(__dirname, "./src") }
    ]
  },
})
