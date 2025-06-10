import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Compiler } from '@fervid/napi'
import { computed, shallowRef } from '@vue/reactivity'
import slash from 'slash'
import {
  createUnplugin,
  type UnpluginContext,
  type UnpluginContextMeta,
} from 'unplugin'
import { createFilter, normalizePath, type ViteDevServer } from 'vite'
import { version } from '../../package.json'
import { resolveCompiler } from '../core/compiler'
import { EXPORT_HELPER_ID, helperCode } from '../core/helper'
import { transformMain } from '../core/main'
import {
  clearScriptCache,
  resolveScript,
  typeDepToSFCMap,
} from '../core/script'
import { transformStyle } from '../core/style'
import { transformTemplateAsModule } from '../core/template'
import { createDebug } from './debug'
import { handleHotUpdate, handleTypeDepChange } from './handleHotUpdate'
import {
  getDescriptor,
  getSrcDescriptor,
  getTempSrcDescriptor,
} from './utils/descriptorCache'
import { parseVueRequest } from './utils/query'
import type {
  SFCBlock,
  SFCScriptCompileOptions,
  SFCStyleCompileOptions,
  SFCTemplateCompileOptions,
} from 'vue/compiler-sfc'
import type * as _compiler from 'vue/compiler-sfc'

const log = createDebug('unplugin-vue-fervid:compile')

export { parseVueRequest, type VueQuery } from './utils/query'

export interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]

  isProduction?: boolean
  ssr?: boolean
  sourceMap?: boolean
  root?: string

  // options to pass on to vue/compiler-sfc
  script?: Partial<
    Omit<
      SFCScriptCompileOptions,
      | 'id'
      | 'isProd'
      | 'inlineTemplate'
      | 'templateOptions'
      | 'sourceMap'
      | 'genDefaultAs'
      | 'customElement'
      | 'defineModel'
      | 'propsDestructure'
    >
  > & {
    /**
     * @deprecated defineModel is now a stable feature and always enabled if
     * using Vue 3.4 or above.
     */
    defineModel?: boolean
    /**
     * @deprecated moved to `features.propsDestructure`.
     */
    propsDestructure?: boolean
  }
  template?: Partial<
    Omit<
      SFCTemplateCompileOptions,
      | 'id'
      | 'source'
      | 'ast'
      | 'filename'
      | 'scoped'
      | 'slotted'
      | 'isProd'
      | 'inMap'
      | 'ssr'
      | 'ssrCssVars'
      | 'preprocessLang'
    >
  >
  style?: Partial<
    Omit<
      SFCStyleCompileOptions,
      | 'filename'
      | 'id'
      | 'isProd'
      | 'source'
      | 'scoped'
      | 'cssDevSourcemap'
      | 'postcssOptions'
      | 'map'
    >
  >

  /**
   * @deprecated moved to `features.customElement`.
   */
  customElement?: boolean | string | RegExp | (string | RegExp)[]

  /**
   * Use custom compiler-sfc instance. Can be used to force a specific version.
   */
  compiler?: typeof _compiler

  /**
   * @default true
   */
  inlineTemplate?: boolean

  features?: {
    optionsAPI?: boolean
    prodDevtools?: boolean
    prodHydrationMismatchDetails?: boolean
    /**
     * Enable reactive destructure for `defineProps`.
     * - Available in Vue 3.4 and later.
     * - Defaults to true in Vue 3.5+
     * - Defaults to false in Vue 3.4 (**experimental**)
     */
    propsDestructure?: boolean
    /**
     * Transform Vue SFCs into custom elements.
     * - `true`: all `*.vue` imports are converted into custom elements
     * - `string | RegExp`: matched files are converted into custom elements
     *
     * @default /\.ce\.vue$/
     */
    customElement?: boolean | string | RegExp | (string | RegExp)[]
    /**
     * Customize the component ID generation strategy.
     * - `'filepath'`: hash the file path (relative to the project root)
     * - `'filepath-source'`: hash the file path and the source code
     * - `function`: custom function that takes the file path, source code,
     *   whether in production mode, and the default hash function as arguments
     * - **default:** `'filepath'` in development, `'filepath-source'` in production
     */
    componentIdGenerator?:
      | 'filepath'
      | 'filepath-source'
      | ((
          filepath: string,
          source: string,
          isProduction: boolean | undefined,
          getHash: (text: string) => string,
        ) => string)
  }
}

export type Context = UnpluginContext & UnpluginContextMeta

export type ResolvedOptions = Omit<Options, 'customElement'> &
  Required<
    Pick<
      Options,
      | 'include'
      | 'isProduction'
      | 'ssr'
      | 'sourceMap'
      | 'root'
      | 'compiler'
      | 'inlineTemplate'
      | 'features'
    >
  > & {
    /** Vite only */
    devServer?: ViteDevServer
    devToolsEnabled?: boolean
    cssDevSourcemap: boolean
  }

function resolveOptions(rawOptions: Options): ResolvedOptions {
  const root = rawOptions.root ?? process.cwd()
  const isProduction =
    rawOptions.isProduction ?? process.env.NODE_ENV === 'production'
  const features = {
    ...rawOptions.features,
    optionsAPI: true,
    prodDevtools: false,
    prodHydrationMismatchDetails: false,
    ...rawOptions.features,
    customElement:
      (rawOptions.features?.customElement || rawOptions.customElement) ??
      /\.ce\.vue$/,
  }

  return {
    ...rawOptions,
    include: rawOptions.include ?? /\.vue$/,
    isProduction,
    ssr: rawOptions.ssr ?? false,
    sourceMap: rawOptions.sourceMap ?? true,
    root,
    compiler: rawOptions.compiler as any, // to be set in buildStart
    devToolsEnabled: features.prodDevtools || !isProduction,
    cssDevSourcemap: false,
    inlineTemplate: rawOptions.inlineTemplate ?? true,
    features,
  }
}

const cleanId = (id: string): string => id.split('?')[0]

const isVueFile = (id: string): boolean => id.endsWith('.vue')

const resolveAssetUrlOptions = (id: string, options: ResolvedOptions) => {
  const transformAssetUrls = options.template?.transformAssetUrls

  if (transformAssetUrls === false) {
    return undefined
  }

  if (options.devServer && id.startsWith(options.root)) {
    const devBase = options.devServer.config.base
    return {
      base:
        (options.devServer.config.server?.origin ?? '') +
        devBase +
        slash(path.relative(options.root, path.dirname(id))),
      includeAbsolute: !!devBase,
    }
  }

  return {
    includeAbsolute: true,
  }
}

export const plugin = createUnplugin<Options | undefined, false>(
  (rawOptions = {}, meta) => {
    clearScriptCache()

    const options = shallowRef(resolveOptions(rawOptions))

    const filter = computed(() =>
      createFilter(options.value.include, options.value.exclude),
    )

    const customElementFilter = computed(() => {
      const customElement = options.value.features.customElement
      return typeof customElement === 'boolean'
        ? () => customElement as boolean
        : createFilter(customElement)
    })

    let compiler: Compiler

    const api = {
      get options() {
        return options.value
      },
      set options(value) {
        options.value = value
      },
      version,
    }

    return {
      name: 'unplugin-vue',

      vite: {
        api,
        handleHotUpdate(ctx) {
          if (!isVueFile(ctx.file)) {
            return
          }

          ctx.server.ws.send({
            type: 'custom',
            event: 'file-changed',
            data: { file: normalizePath(ctx.file) },
          })

          return ctx.modules
        },

        config(config) {
          return {
            resolve: {
              dedupe: config.build?.ssr ? [] : ['vue'],
            },
            define: {
              __VUE_OPTIONS_API__: !!(
                (options.value.features?.optionsAPI ?? true) ||
                config.define?.__VUE_OPTIONS_API__
              ),
              __VUE_PROD_DEVTOOLS__: !!(
                options.value.features?.prodDevtools ||
                config.define?.__VUE_PROD_DEVTOOLS__
              ),
              __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: !!(
                options.value.features?.prodHydrationMismatchDetails ||
                config.define?.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__
              ),
            },
            ssr: {
              // @ts-ignore -- config.legacy.buildSsrCjsExternalHeuristics will be removed in Vite 5
              external: config.legacy?.buildSsrCjsExternalHeuristics
                ? ['vue', '@vue/server-renderer']
                : [],
            },
          }
        },

        configResolved(config) {
          options.value = {
            ...options.value,
            root: config.root,
            sourceMap:
              config.command === 'build' ? !!config.build.sourcemap : true,
            cssDevSourcemap: config.css?.devSourcemap ?? false,
            isProduction: config.isProduction,
            compiler: options.value.compiler || resolveCompiler(config.root),
            devToolsEnabled: !!(
              options.value.features.prodDevtools ||
              config.define!.__VUE_PROD_DEVTOOLS__ ||
              !config.isProduction
            ),
          }
        },

        configureServer(server) {
          options.value.devServer = server
        },
      },

      rollup: {
        api,
      },

      rolldown: {
        api,
        options(opt) {
          opt.moduleTypes ||= {}
          opt.moduleTypes.vue ||= 'js'
        },
      },

      buildStart() {
        compiler = new Compiler({
          isProduction: options.value.isProduction,
        })
      },

      resolveId(id) {
        return isVueFile(id) ? id : undefined
      },

      loadInclude(id) {
        const { query } = parseVueRequest(id)
        return query.vue || isVueFile(id)
      },

      load(id) {
        const { query } = parseVueRequest(id)
        if (query.vue) {
          const cleanedId = cleanId(id)
          const code = fs.readFileSync(cleanedId, 'utf-8')
          const compileResult = compiler.compileSync(code, {
            id: cleanedId,
            filename: cleanedId,
          })

          if (query.type === 'style') {
            const styleIndex = Number(query.index)
            const styleBlock = compileResult.styles[styleIndex]
            return {
              code: styleBlock?.code,
              map: styleBlock?.map || undefined,
            }
          }
        }
      },

      transformInclude(id) {
        const { query } = parseVueRequest(id)
        return query.vue || isVueFile(id)
      },

      transform(code, id) {
        const assetUrlOptions = resolveAssetUrlOptions(id, options.value)

        const compileResult = compiler.compileSync(code, {
          id,
          filename: id,
          transformAssetUrls: assetUrlOptions,
        })

        const { query } = parseVueRequest(id)

        if (query.type === 'style') {
          return { code }
        }

        const output = []

        if (compileResult.styles.length) {
          compileResult.styles.forEach((style, i) => {
            const styleVirtualId = `${id}?vue&type=style&index=${i}&isScoped=${style.isScoped}&lang.${style.lang}`
            output.push(`import "${styleVirtualId}";`)
          })
        }

        if (!options.value.isProduction) {
          output.push(`
            import.meta.hot.on('file-changed', ({ file }) => {
              __VUE_HMR_RUNTIME__.CHANGED_FILE = file
            })
    
            import.meta.hot.accept(mod => {
              if (!mod) return
              const { default: updated, _rerender_only } = mod
              if (_rerender_only) {
                __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
              } else {
                __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
              }
            })
          `)
        }

        // 处理组件代码
        const modifiedCode = compileResult.code.replace(
          'export default',
          `\nconst __comp =`,
        )

        output.push(
          modifiedCode,
          `
        __comp.__hmrId = ${JSON.stringify(id)}
        typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(__comp.__hmrId, __comp)

        export default __comp
        `,
        )

        return output.join('\n')
      },
    }
  },
)
