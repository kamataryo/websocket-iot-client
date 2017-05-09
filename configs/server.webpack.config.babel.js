import path          from 'path'
import webpack       from 'webpack'
import nodeExternals from 'webpack-node-externals'

export default {
  entry: path.join(__dirname, '/../src/server/index.js'),
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, '/../dist/server/'),
    publicPath: '',
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  node: {
    __dirname: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test : /.js$/,
        use  : [{ loader: 'babel-loader?compact=false' }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __PROD__: process.env.NODE_ENV === 'production',
    }),
  ]
}
