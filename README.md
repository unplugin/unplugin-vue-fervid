# unplugin-vue-fervid

#### Use [fervid Rust Compiler](https://github.com/phoenix-ru/fervid) to Transform Vue 3 SFC to JavaScript

Due to the need to consider `performance` and `compatibility` issues, `fervid` needs to refactor `node` api. Please look forward to it.

> [!IMPORTANT]
> 🚧 Working in Progress.
> May be break changes in the future. The final implementation goal should be consistent with the vue compiler behavior

#### playground: [Fervid Playground](https://phoenix-ru.github.io/fervid/)

#### Configuration

> [!IMPORTANT]
> Currently only be compiled for root components and support hmr

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Vue from 'unplugin-vue-fervid/vite'

export default defineConfig({
  plugins: [
    Vue({
      /* options */
    }),
  ],
})
```

<br></details>

## Alternatives

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) - For Vite and Vue 3.
- [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2) - For Vite and Vue 2.
- [unplugin-vue2](https://github.com/unplugin/unplugin-vue2) - For Vue 2.7+ and Vite, esbuild, Rollup, Webpack or more.
- [vue-loader](https://github.com/vuejs/vue-loader) - For Webpack.
- [esbuild-plugin-vue](https://github.com/egoist/esbuild-plugin-vue) - For esbuild and Vue 3.
- [esbuild-vue](https://github.com/apeschar/esbuild-vue) - For esbuild and Vue 2.
- ~~[vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) - For Vite and Vue 2.~~
- ~~[rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue)~~ - ⚠️ no longer maintained.

## Thanks

- [Vite](https://github.com/vitejs/vite) - Next generation frontend tooling. It's fast!
- [unplugin](https://github.com/unjs/unplugin) - Unified plugin system for Vite, Rollup, Webpack, and more
- [unplugin-vue](https://github.com/unplugin/unplugin-vue) - ✨ Transform Vue 3 SFC to JavaScript. Supports Vite, esbuild, Rollup, Webpack and more.
- [vite-plugin-vue](https://github.com/vitejs/vite-plugin-vue) - This project is inherited from it.
