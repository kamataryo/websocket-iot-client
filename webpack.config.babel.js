import path              from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack           from 'webpack'

export default {
  entry: path.join(__dirname, '/src/client/main.jsx'),
  output: {
    path: path.join(__dirname, '/dist/client/'),
    publicPath: '',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test : /.jsx?$/,
        use  : [{ loader: 'babel-loader?compact=false' }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template : path.join(__dirname, '/src/client/index.html'),
      hash     : false,
      favicon  : path.join(__dirname, '/src/client/favicon.ico'),
      filename : 'index.html',
      inject   : 'body',
      minify   : {
        collapseWhitespace : true
      }
    }),
    new webpack.DefinePlugin({
      __PROD__: process.env.NODE_ENV === 'production',
    })
  ],
  devServer: {
    contentBase        : path.join(__dirname, '/dist/client/'),
    compress           : true,
    port               : 3000,
    historyApiFallback : true
  }
}
