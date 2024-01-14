import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { rollup } from 'rollup'
import glob from 'fast-glob'
import ViteVue from '@vitejs/plugin-vue'
import * as vueCompiler from 'vue/compiler-sfc'
import esbuild from 'rollup-plugin-esbuild'
import Vue from '../src/rollup'
import type { Options } from '../src'

async function getCode(file: string, plugin: any) {
  const bundle = await rollup({
    input: [file],
    external: ['vue'],
    plugins: [plugin, esbuild({ format: 'esm' })],
  })
  const output = await bundle.generate({ format: 'esm' })
  return output.output
    .map((file) => {
      if (file.type === 'chunk') {
        return `//${file.fileName}\n${file.code}`
      } else {
        return file.fileName
      }
    })
    .join('\n')
}

function createPlugins(opt: Options) {
  const vite = ViteVue(opt)
  // @ts-expect-error
  vite.configResolved!({
    root: opt.root!,
    command: 'build',
    isProduction: opt.isProduction,
    build: {
      sourcemap: false,
    },
    define: {},
  } as any)
  return {
    unplugin: Vue(opt),
    vite,
  }
}

describe('transform', () => {
  describe('fixtures', async () => {
    const root = resolve(__dirname, '..')
    const files = await glob('tests/fixtures/*.{vue,js,ts}', {
      cwd: root,
      onlyFiles: true,
    })

    for (const file of files) {
      describe(file.replaceAll('\\', '/'), () => {
        const filepath = resolve(root, file)

        for (const isProduction of [true, false]) {
          it(`isProduction is ${isProduction}`, async () => {
            process.env.NODE_ENV = isProduction ? 'production' : 'development'

            const { unplugin, vite } = createPlugins({
              root,
              compiler: vueCompiler,
              isProduction,
            })

            const viteCode = await getCode(filepath, vite)
            const unpluginCode = await getCode(filepath, unplugin)

            expect(
              unpluginCode.replaceAll(JSON.stringify(filepath), "'#FILE#'"),
            ).toMatchSnapshot()
            expect(viteCode).toBe(unpluginCode)
          })
        }
      })
    }
  })
})
