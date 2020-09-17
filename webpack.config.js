const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// src/pages 目录为页面入口的根目录
const pagesRoot = path.resolve(__dirname, './src/pages');
// fs 读取 pages 下的所有文件夹来作为入口，使用 entries 对象记录下来
const entries = fs.readdirSync(pagesRoot).reduce((entries, page) => {
  // 文件夹名称作为入口名称，值为对应的路径，可以省略 `index.js`，webpack 默认会寻找目录下的 index.js 文件
  entries[page] = path.resolve(pagesRoot, page);
  return entries;
}, {});

module.exports = (env, argv) => ({
  mode: env.production ? 'production' : 'development', // 从 env 参数获取 mode
  devtool: env.production ? false : 'eval-cheap-source-map', // 开发环境需要 source map
  // entry: './src/index.js', // 指定构建入口文件
  entry: entries, // 指定构建入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定构建生成文件所在的路径
    filename: 'bundle.js', // 指定构建生成的文件名
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // 开发服务器启动路径
    hot: true,
  },
  optimization: {
    // useExports: true, // 模块内未使用的部分不进行导出
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      name: 'common', // 给分离出来的 chunk 起个名字
    },
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
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                // 压缩 jpeg 的配置
                progressive: true,
                quality: 65,
              },
              optipng: {
                // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: {
                // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                // 压缩 gif 的配置
                interlaced: false,
              },
              webp: {
                // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // 配置文件模版
      minify: {
        // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true, // 压缩 HTML 中出现的 JS 代码
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true, // 和上一个配置配合，移除无用的空格和换行
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
});
