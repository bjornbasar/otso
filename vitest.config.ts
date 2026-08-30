import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Without the React plugin, a .tsx test is transformed by bare esbuild and the JSX
  // runtime is never wired up — karu's own vitest.config.ts carries the same note.
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
})
