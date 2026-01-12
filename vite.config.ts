import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        '0.8/index': resolve(__dirname, 'src/0.8/index.ts'),
        '0.9/index': resolve(__dirname, 'src/0.9/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id === 'react/jsx-runtime' ||
        (!id.startsWith('.') && !id.startsWith('/') && !id.startsWith('@/')),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
