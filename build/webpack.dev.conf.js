var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test'), resolve('demo')]
})

module.exports = {
  entry: './demo/index.js',
  output: './dist/',
  devtool: "eval-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      createLintingRule(),
      {
        test: /.js$/,
        loaders: ['babel-loader'],
        include: [resolve('src'), resolve('demo')]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [resolve('src')]
      },
      {
        test: /.s[c|a]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    compress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'demo/index.html',
      inject: true
    })
  ]
};