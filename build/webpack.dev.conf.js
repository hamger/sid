const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * 得到 webpack 的入口配置
 * @param {匹配路径} globPath
 * @param {正则，用于过滤不需要的文件} reg
 */

// 例如执行 getEntry('src/**/index.html') 会根据目录输出如下类似结果：
// { page01: './src/page01/index.html', page02: './src/page02/index.html' }
const getEntry = (globPath, reg) => {
  const files = glob.sync(globPath)
  let entries = {},
    entry,
    dirname
  for (let i = 0; i < files.length; i++) {
    entry = files[i]
    dirname = path
      .dirname(entry)
      .split('/')
      .pop()
    if (!reg) entries[dirname] = './' + entry
    if (reg && !reg.test(dirname)) entries[dirname] = './' + entry
  }
  return entries
}

var webpackConfig = {
  entry: getEntry('demo/**/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]-[hash:5].js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('demo'),
          resolve('router')
        ]
      },
      {
        test: /.js$/,
        loaders: ['babel-loader'],
        include: [resolve('src'), resolve('demo'), resolve('router')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [resolve('src')]
      },
      {
        test: /.s[c|a]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    compress: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

// 在不同的页面中插入对应的js文件
var htmls = getEntry('demo/**/index.html')
var pages = Object.keys(htmls)
pages.forEach(filename => {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${filename}.html`,
      template: htmls[filename],
      inject: true,
      chunks: [filename]
    })
  )
})

module.exports = webpackConfig
