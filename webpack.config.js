const path      = require('path');
const merge     = require('webpack-merge');
const webpack   = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    //loaders are evaluated from right to left and from bottom-up
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        //include accepts either a path or an array of paths
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  }
};

//default config
if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: '#eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      //enable history API fallback
      historyApiFallback: true,
      hot:true,
      inline:true,
      progress:true,

      //display only errors
      stats:'errors-only',

      //parse host and port from env
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common,{});
}