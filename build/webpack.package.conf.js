const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'sid.min.js',
    path: path.resolve(__dirname, '../package'),
    library: 'sid',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '#': path.resolve(__dirname, '../router')
    }
  },
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, '../src')]
      },
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}
