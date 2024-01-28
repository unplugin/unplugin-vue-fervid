import { defineConfig } from "@farmfe/core";
import Vue from "unplugin-vue-fervid/farm";

export default defineConfig({
  compilation: {
    persistentCache: false
  },
  plugins: [Vue()],
});
