/* eslint-disable */
const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
  return {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      'app': './src/main.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './[name].bundle.js'
    },
    module: {
    },
    plugins: [
    ],
    devtool: 'source-map'
  }
}
