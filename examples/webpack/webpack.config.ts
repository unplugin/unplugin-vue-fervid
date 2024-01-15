import Vue from 'unplugin-vue-fervid/webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration } from 'webpack'

const config: Configuration = {
  mode: (process.env.MODE as any) ?? 'development',
  entry: {
    app: './src/main.ts',
  },
  module: {
    rules: [
      {
        enforce: 'post',
        test: /\.m?ts$/,
        exclude: /(node_modules)/,
        use: { loader: 'swc-loader' },
      },
    ],
  },
  plugins: [
    Vue(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    }),
  ],
}
export default config
