# unplugin-vue-fervid

#### Use [fervid Rust Compiler](https://github.com/phoenix-ru/fervid) to Transform Vue 3 SFC to JavaScript

Due to the need to consider `performance` and `compatibility` issues, `fervid` needs to refactor `node` api. Please look forward to it.

> [!IMPORTANT]
> 🚧 Working in Progress.
> May be break changes in the future. The final implementation goal should be consistent with the vue compiler behavior

#### playground: [Fervid Playground](https://phoenix-ru.github.io/fervid/)


# Part One main process

this is my current understanding of the vue compilation process

first summarize it as a whole and then proceed to the point of compiling the specific core parts of the code

only describe the vue compilation process and the current difference between fervid and compiler-sfc, the next goal is to get as close to compiler-sfc functionality as possible

choose vite-plugin-vue as the segmentation point among vue-loader and vite-plugin-vue to be more in line with the modern plugin process

## plugin compilation process

`unplugin-vue` compiles vue

1. handle helper code

```ts
load(id) {
  // 1. handle helper code
  if (id === EXPORT_HELPER_ID) {
    return helperCode;
  }
}
```

### helper code

```ts
export const EXPORT_HELPER_ID = "\0/plugin-vue/export-helper";

export const helperCode = `
export default (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
}
`;
```

1. merge options

`sfc.vccOpts || sfc`: Get the option object of the component `__vccOpts` is Vue Component Compiled Options, If there is no `__vccOpts`, use sfc itself directly

2. inject props

Traverse the props array, injecting each attribute into the component options

These attributes typically include:

- `__file` components name
- `__scopeId` css scoped id
- `__hmrId` handle hmr
- `render or ssrRender` render function

The role of this helper is to ensure:

Correct attribute merge: Ensure that all compile-time attributes are correctly merged into the component
Scope isolation: Supported scoped CSS through `__scopeId`

### transform code

such as vite bundler, We need to distinguish between the development environment and the production environment. For example, vite optimizes the development environment dev server and does not split multiple module requests, that is, it does not split the entire vue file into multiple js modules and return the esm http request.

There are three operations in transform:

1. transformMain: main request

Triggered when a. vue file is requested directly, the first compilation is triggered

- For example:/src/App. vue

```ts
if (!query.vue) {
  return transformMain(
    code,
    filename,
    options.value,
    context,
    ssr,
    customElementFilter.value(filename),
  );
}
```

Main responsibilities:

- Integrate all sub-modules (template, script, style)

```ts
export async function transformMain(code, filename, options, ...) {
  // 1. create descriptor
  const { descriptor, errors } = createDescriptor(filename, code, options);

  // 2. handle script
  const { code: scriptCode, map: scriptMap } = await genScriptCode(
    descriptor,
    options,
    pluginContext,
    ssr,
    customElement,
  );

  // 3. handle template
  let templateCode = '';
  if (hasTemplateImport) {
    ({ code: templateCode } = await genTemplateCode(
      descriptor,
      options,
      pluginContext,
      ssr,
      customElement,
    ));
  }

  // 4. handle styles
  const stylesCode = await genStyleCode(
    descriptor,
    pluginContext,
    customElement,
    attachedProps,
  );

  // 5. handler custom blocks
  const customBlocksCode = await genCustomBlockCode(descriptor, pluginContext);

  // merge all compilation code
  const output: string[] = [
    scriptCode,
    templateCode,
    stylesCode,
    customBlocksCode,
  ];
}
```

- Generate final component definitions

```ts
// 1. add components props scopedId
if (hasScoped) {
  attachedProps.push([`__scopeId`, JSON.stringify(`data-v-${descriptor.id}`)]);
}

// 2. add file info (for dev tools)
if (devToolsEnabled || (devServer && !isProduction)) {
  attachedProps.push([
    `__file`,
    JSON.stringify(isProduction ? path.basename(filename) : filename),
  ]);
}

// 3. use helper to merge all properties (helper will merge all properties into component)
output.push(
  `export default /*#__PURE__*/ _export_helper(_sfc_main, [
    ${attachedProps.map(([key, val]) => `['${key}',${val}]`).join(",\n    ")}
  ])`,
);
```

- Handling HMR-related logic

```ts
// 1. check if HMR is enabled
if (
  devServer &&
  devServer.config.server.hmr !== false &&
  !ssr &&
  !isProduction
) {
  // 2. add HMR ID
  output.push(
    `_sfc_main.__hmrId = ${JSON.stringify(descriptor.id)}`,

    // 3. create HMR record
    `typeof __VUE_HMR_RUNTIME__ !== 'undefined' && ` +
      `__VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)`,

    // 4. listen to file changes
    `import.meta.hot.on('file-changed', ({ file }) => {
      __VUE_HMR_RUNTIME__.CHANGED_FILE = file
    })`,
  );

  // 5. check if only template has changed
  if (prevDescriptor && isOnlyTemplateChanged(prevDescriptor, descriptor)) {
    output.push(
      `export const _rerender_only = __VUE_HMR_RUNTIME__.CHANGED_FILE === ${JSON.stringify(
        normalizePath(filename),
      )}`,
    );
  }

  // 6. add HMR accept handling
  output.push(
    `import.meta.hot.accept(mod => {
      if (!mod) return
      const { default: updated, _rerender_only } = mod
      if (_rerender_only) {
        // only template changed, just rerender
        __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
      } else {
        // other changes, reload the entire component
        __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
      }
    })`,
  );
}
```

- Add SSR support (pending now fervid not support ssr)

The above is the logic of all transform main. In the first stage, we can actually complete all hmr and vue compilation functions in the development environment

The main code logic we generated is

This is the most important code in the first phase of dev mode

- script code

```ts
  "import { defineComponent as _defineComponent } from 'vue'\n" +
    'import { ref } from "vue";\n' +
    '\n' +
    'const _sfc_main = /*@__PURE__*/_defineComponent({\n' +
    "  __name: 'App',\n" +
    '  setup(__props, { expose: __expose }) {\n' +
    '  __expose();\n' +
    '\n' +
    'const msg = ref("22222222");\n' +
    'console.log(123132);\n' +
    '\n' +
    'const __returned__ = { msg }\n' +
    "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })\n" +
    'return __returned__\n' +
    '}\n' +
    '\n' +
    '})',
```

- template code

```ts
'import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, vModelText as _vModelText, withDirectives as _withDirectives, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"\n' +
  "\n" +
  "function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {\n" +
  '  return (_openBlock(), _createElementBlock("div", null, [\n' +
  '    _cache[1] || (_cache[1] = _createTextVNode(" 123132 ")),\n' +
  '    _cache[2] || (_cache[2] = _createElementVNode("div", null, "4565465", -1 /* HOISTED */)),\n' +
  '    _cache[3] || (_cache[3] = _createElementVNode("h1", null, "Hello world", -1 /* HOISTED */)),\n' +
  '    _cache[4] || (_cache[4] = _createTextVNode(" 3123132ww ")),\n' +
  '    _createElementVNode("h2", null, _toDisplayString($setup.msg), 1 /* TEXT */),\n' +
  '    _cache[5] || (_cache[5] = _createTextVNode(" 12313211231222146521312wwwwww321 ")),\n' +
  '    _withDirectives(_createElementVNode("input", {\n' +
  '      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.msg) = $event)),\n' +
  '      type: "text"\n' +
  "    }, null, 512 /* NEED_PATCH */), [\n" +
  "      [_vModelText, $setup.msg]\n" +
  "    ])\n" +
  "  ]))\n" +
  "}",
  "\n";
```

- style code

```ts
 'import "/Users//examples/vite/src/App.vue?vue&type=style&index=0&lang.css"',
```

- hmr code

```ts
'_sfc_main.__hmrId = "7a7a37b1"',
  "typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)",
  "import.meta.hot.on('file-changed', ({ file }) => {",
  "  __VUE_HMR_RUNTIME__.CHANGED_FILE = file",
  "})",
  "import.meta.hot.accept(mod => {",
  "  if (!mod) return",
  "  const { default: updated, _rerender_only } = mod",
  "  if (_rerender_only) {",
  "    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)",
  "  } else {",
  "    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)",
  "  }",
  "})";
```

- then we finally generate the code with

```ts
import _export_sfc from '\x00/plugin-vue/export-helper'",
  `export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"/Users//examples/vite/src/App.vue"]])`
```

Running this code, we complete the compilation of vue. This is the complete first stage of the process.

Next we start to describe the details

### First function point descriptor

1. createDescriptor

```ts
const { descriptor, errors } = createDescriptor(filename, code, options);
```

2. descriptor structure

```ts
interface SFCDescriptor {
  // file path
  filename: string;
  // source code
  source: string;
  // unique identifier
  id: string;

  // information of each block
  template: SFCTemplateBlock | null;
  script: SFCScriptBlock | null;
  scriptSetup: SFCScriptBlock | null;
  styles: SFCStyleBlock[];
  customBlocks: SFCBlock[];

  // CSS variables
  cssVars: string[];
  // Whether it contains the Slotted API
  slotted: boolean;
}
```

```ts
interface SFCTemplateBlock extends SFCBlock {
  type: "template";
  content: string;
  lang?: string; // such as 'pug'
  ast?: any; // template AST
  src?: string; // external template path
}
```

```ts
interface SFCScriptBlock extends SFCBlock {
  type: "script";
  content: string;
  lang?: string; // such as 'ts'
  src?: string; // external script path
  setup?: boolean; // whether it's a setup script
  bindings?: BindingMetadata; // variable bindings
}
```

```ts
interface SFCStyleBlock extends SFCBlock {
  type: "style";
  content: string;
  lang?: string; // such as 'scss'
  scoped?: boolean; // whether it's scoped style
  module?: string | boolean; // CSS Modules configuration
}
```

3. Descriptor main logic:

- share the same descriptor for all components in the same file

```ts
// handler script info
const scriptBindings = descriptor.scriptSetup?.bindings;
// handler scoped id check if has scoped
const hasScoped = descriptor.styles.some((s) => s.scoped);
```

4. Hmr support

```ts
// diff old descriptor and new descriptor to detect if only template has changed
if (prevDescriptor && isOnlyTemplateChanged(prevDescriptor, descriptor)) {
  // update template only
}
```

5. Cross-block communication

```ts
// Example: CSS variables are passed from style to template
const cssVars = descriptor.cssVars;
```

#### Importance of Descriptors:

1. Unified interface: Provides a unified data structure for different compilation stages

2. Information sharing: Allow different compilation steps to share information

3. Incremental updates: support for HMR and on-demand compilation

4. Extensibility: Support custom blocks and various preprocessors

5. Optimization support: Provide necessary information for various optimizations

### There are also a few more important methods in the compilation of vue

about distinguishing these methods and code logic in fervid. Now that fervid only provides one method, can we achieve consistent behavior with compiler-sfc?

that without considering caching and ssr in the first step, we need to implement the following method

- compiler.compileScript (generate script code main `__sfc_main`)
- compiler.compileTemplate (generate template code)
- compiler.compileStyle (generate style code)
- compiler.parse (generate descriptor)

# Part Two core compiler script （WIP）
