import Vue from 'unplugin-vue-fervid/vite'
// import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [Vue(), Inspect()],
})
