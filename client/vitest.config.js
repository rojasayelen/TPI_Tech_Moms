import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',
      '**/*.e2e.{js,jsx}',
      '**/playwright.config.js'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '*.config.js',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'playwright.config.js',
        '**/tests/e2e/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

