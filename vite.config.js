import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to './' to generate relative paths for assets, 
// ensuring the build works on GitHub Pages subpaths (username.github.io/repo-name)
export default defineConfig({
  base: './',
  plugins: [react()],
})
