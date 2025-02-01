import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import Vue from 'unplugin-vue-fervid/rollup'

const bundle = await rollup({
  input: ['./src/main.ts'],
  external: ['vue'],
  plugins: [Vue(), esbuild({ format: 'esm' })],
})
await bundle.write({
  dir: 'dist',
  format: 'esm',
})
