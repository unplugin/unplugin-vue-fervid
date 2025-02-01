// @ts-check
import process from 'node:process'
import { rolldown } from 'rolldown'
import Vue from 'unplugin-vue-fervid/rolldown'

const bundle = await rolldown({
  input: ['./src/main.ts'],
  external: ['vue'],
  plugins: [Vue()],
})
await bundle.write({
  dir: 'dist',
  format: 'esm',
})
process.exit(0)
