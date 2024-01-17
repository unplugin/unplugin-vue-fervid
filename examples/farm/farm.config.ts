import { defineConfig } from "@farmfe/core";
import Vue from "unplugin-vue-fervid/vite";

export default defineConfig({
  compilation: {
    persistentCache: false
  },
  vitePlugins: [Vue()],
});
