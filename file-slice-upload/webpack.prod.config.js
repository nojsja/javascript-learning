const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 拆分样式文件
const extractSass = new ExtractTextPlugin({
  filename: 'style.scss.css',
});

const extractCss = new ExtractTextPlugin({
  filename: 'style.css',
});

// 拆分静态库
const dllRefPlugin = new webpack.DllReferencePlugin({
  context: __dirname,
  manifest: require('./dist/vendor-manifest.json'),
});

module.exports = {
  entry: [
    './app/index',
  ],
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      resources: path.resolve(__dirname, 'resources'),
      app: path.resolve(__dirname, 'app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: 'css-loader',
          publicPath: path.join(__dirname, 'dist/'),
        }),
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader', // 在开发环境使用 style-loader
          publicPath: path.join(__dirname, 'dist/'),
        }),
      },
      // { // parse error
      //   test: /\.(png|jpg|gif|svg|ico|jpeg)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 8192,
      //         name: '[path][name].[ext]',
      //         fallback: 'file-loader',
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico|woff|eot|ttf|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    dllRefPlugin,
    extractSass,
    extractCss,
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({ template: 'app/index.html', inject: false }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
  target: 'electron-renderer',
};
