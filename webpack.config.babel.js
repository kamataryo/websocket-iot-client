import path from 'path'

export default {
  entry: './public/main.jsx',
  output: {
    path: path.join(__dirname, '/public/'),
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
        test: /.jsx?$/,
        use: [{ loader: 'babel-loader?compact=false' }]
      }
    ]
  },
  plugins: [],
  devServer: {
    contentBase: path.join(__dirname, '/public/'),
    compress: true,
    port: 3001
  }
}
