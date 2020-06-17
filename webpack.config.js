const path = require('path')
const webPack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const fs = require('fs')

let dotenv = fs.readFileSync('./.env').toString()
dotenv = dotenv.split('\n')
dotenv = dotenv.map( item => {
  const vars = item.split('=')
  return{
    type:vars[0],
    param: vars.length > 1 ? vars[1] : true
  }
})

const parsaVersion = () => {
  const pad = (input) => { return input < 10 ? `0${input}` : input }
  let versionDate = new Date()
  return `V ${versionDate.getFullYear()}${pad(versionDate.getMonth()+1)}${pad(versionDate.getDate())}A`
}

const dotenvGet = (type) => {
  const result = dotenv.find( item => item.type === type )
  if( result !== undefined ){
    return result.param
  }else return undefined
}

let config = {
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
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'ws://localhost:8080',
          replace: dotenvGet('WSOCK'),
          flags: 'i'
        }
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'V YYYYMMDDX',
          replace: parsaVersion(),
          flags: 'i'
        }
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),
    new CopyWebPackPlugin([
      {from:'./public/misc',to:'misc'},
      {from:'./public/textures',to:'textures'},
      {from:'./public/models',to:'models'},
      {from:'./public/sounds',to:'sounds'},
    ])
  ],
  stats:{
    children:false
  }
}

module.exports = (env, argv) => {
  if( argv.mode === 'development' ){
    console.log("Development mode active")
  }else{
    console.log("Production mode, building")
    const TerserPlugin = require('terser-webpack-plugin')
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        })
      ]
    }
  }
  return config
}