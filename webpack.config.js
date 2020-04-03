const path = require('path')
const webPack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')

const config = {
  entry: {
    main: ['./src/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 80,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style-loader','css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),
    new CopyWebPackPlugin([
      {from:'./public/textures',to:'textures'},
      {from:'./public/models',to:'models'},
      {from:'./public/sounds',to:'sounds'},
    ])
  ],
  stats:{
    children:false
  }
}

module.exports = config