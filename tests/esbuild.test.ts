import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { build } from 'esbuild'
import glob from 'fast-glob'
import * as vueCompiler from 'vue/compiler-sfc'
import Vue from '../src/esbuild'

process.env.NODE_ENV = 'production'

describe('transform', () => {
  describe('fixtures', async () => {
    const root = resolve(__dirname, '..')
    const files = await glob('tests/fixtures/!(sfc-src)*.{vue,js,ts}', {
      cwd: root,
      onlyFiles: true,
    })

    for (const file of files) {
      describe(file.replace('\\', '/'), () => {
        const filepath = resolve(root, file)
        for (const isProduction of [true, false]) {
          it(`isProduction is ${isProduction}`, async () => {
            const result = await build({
              entryPoints: [filepath],
              bundle: true,
              external: ['vue'],
              treeShaking: true,
              format: 'esm',
              plugins: [
                Vue({
                  root,
                  compiler: vueCompiler,
                  isProduction,
                }),
              ],
              write: false,
            })
            const codes = result.outputFiles.map((file) => file.text).join('\n')
            expect(
              codes.replaceAll(JSON.stringify(filepath), '"#FILE#"'),
            ).toMatchSnapshot()
          })
        }
      })
    }
  })
})
