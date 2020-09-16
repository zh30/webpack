const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// src/pages 目录为页面入口的根目录
const pagesRoot = path.resolve(__dirname, './src/pages');
// fs 读取 pages 下的所有文件夹来作为入口，使用 entries 对象记录下来
const entries = fs.readdirSync(pagesRoot).reduce((entries, page) => {
  // 文件夹名称作为入口名称，值为对应的路径，可以省略 `index.js`，webpack 默认会寻找目录下的 index.js 文件
  entries[page] = path.resolve(pagesRoot, page);
  return entries;
}, {});

module.exports = {
  mode: 'development', // 指定构建模式
  // entry: './src/index.js', // 指定构建入口文件
  entry: entries, // 指定构建入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定构建生成文件所在的路径
    filename: 'bundle.js', // 指定构建生成的文件名
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 开发服务器启动路径
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      pages: path.resolve(__dirname, 'src/pages'),
    },
    extensions: [
      '.wasm',
      '.mjs',
      '.js',
      '.json',
      '.jsx',
      '.css',
      '.scss',
      '.sass',
    ],
    mainFiles: ['index'], // 你可以添加其他默认使用的文件名
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css/i,
        include: [path.resolve(__dirname, 'src')],
        // use: ['style-loader', 'css-loader'],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        include: [path.resolve(__dirname, 'src')],
        // use: ['style-loader', 'css-loader'],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // 配置文件模版
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
