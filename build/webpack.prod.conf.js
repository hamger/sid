const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const utils = require('./utils')
const resolve = utils.resolve

var webpackConfig = {
  entry: utils.getEntry('demo/**/index.js', /^(util)$/),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]/[name].js',
    publicPath: '../'
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
        include: [resolve('src'), resolve('demo'), resolve('router')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [resolve('src')]
      },
      {
        test: /.s[c|a]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [resolve('demo')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.join('assets', '[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
}

// 在不同的页面中插入对应的js文件
var htmls = utils.getEntry('demo/**/index.html')
var pages = Object.keys(htmls)
pages.forEach(filename => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${filename}/${filename}.html`,
      template: htmls[filename],
      inject: true,
      chunks: [filename]
    })
  )
})

module.exports = webpackConfig
