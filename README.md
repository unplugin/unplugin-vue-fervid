# unplugin-vue-fervid

#### Use [fervid Rust Compiler](https://github.com/phoenix-ru/fervid) to Transform Vue 3 SFC to JavaScript

Due to the need to consider `performance` and `compatibility` issues, `fervid` needs to refactor `node` api. Please look forward to it.

> [!IMPORTANT]
> 🚧 Working in Progress.
> May be break changes in the future. The final implementation goal should be consistent with the vue compiler behavior

## Is it fast?
Yes, it is incredibly fast. In fact, below is a benchmark run for a [test component](crates/fervid/benches/fixtures/input.vue).

```
  @vue/compiler-sfc:
    954 ops/s, ±1.15%     | slowest, 98.42% slower

  @fervid/napi sync:
    6 464 ops/s, ±0.08%   | 89.29% slower

  @fervid/napi async (4 threads):
    11 624 ops/s, ±2.12%  | 80.73% slower

  @fervid/napi async CPUS (23 threads):
    60 329 ops/s, ±0.67%  | fastest
```

<!-- 
| Action                     | Mean time    |
|----------------------------|--------------|
| Parsing                    | 5.58µs       |
| Code generation: CSR + DEV | 16.26µs      | -->

> Note: results are for AMD Ryzen 9 7900X running on Fedora 38 with kernel version 6.5.9

<!-- Micro-benchmarking has been done using Criterion, code for benchmarks can be found in `benches` directory. -->
Benchmarking in Node.js has been done using [`benny`](https://github.com/caderek/benny), slightly modified to take `libuv` threads into consideration.
[Source code for a benchmark](crates/fervid_napi/benchmark/bench.ts).

#### playground: [Fervid Playground](https://phoenix-ru.github.io/fervid/)

> [!WARNING]
> this project is still being tested and not ready to apply it to production and only supports vue 3.


#### Configuration

> [!IMPORTANT]
> roadmap
> - [x] support Hmr
> - [x] support css compile
> - [ ] type options
> - [ ] known bugs
> - [ ] support other frameworks

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
- [unplugin-vue](https://github.com/unplugin/unplugin-vue) - ✨ Transform Vue 3 SFC to JavaScript. Supports Vite, esbuild, Rollup, Webpack and more.
- [esbuild-plugin-vue](https://github.com/egoist/esbuild-plugin-vue) - For esbuild and Vue 3.
- [esbuild-vue](https://github.com/apeschar/esbuild-vue) - For esbuild and Vue 2.
- ~~[vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2) - For Vite and Vue 2.~~
- ~~[rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue)~~ - ⚠️ no longer maintained.

## Thanks

- [Vite](https://github.com/vitejs/vite) - Next generation frontend tooling. It's fast!
- [unplugin](https://github.com/unjs/unplugin) - Unified plugin system for Vite, Rollup, Webpack, and more
- [unplugin-vue](https://github.com/unplugin/unplugin-vue) - ✨ Transform Vue 3 SFC to JavaScript. Supports Vite, esbuild, Rollup, Webpack and more.
- [vite-plugin-vue](https://github.com/vitejs/vite-plugin-vue) - This project is inherited from it.
