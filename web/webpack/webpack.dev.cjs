const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('node:path');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: 'auto'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../public')
    },
    hot: true,
    port: process.env.APP_PORT,
    historyApiFallback: true,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  plugins: [
    new Dotenv({
      path: './env/.env.development'
    }),
    new ReactRefreshWebpackPlugin()
  ],
  optimization: {
    moduleIds: 'named'
  }
});
