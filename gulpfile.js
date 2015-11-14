var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js')

gulp.task('webpack:build', function(callback) {
  // modify some webpack config options
  var buildConfig = Object.create(webpackConfig);
  buildConfig.plugins = buildConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin()
  );

  webpack(buildConfig, function(err, stats) {
    if(err) {
      throw new gutil.PluginError("webpack:build", err);
    }

    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', function(callback) {
  // modify some webpack config options
  var devServerConfig = Object.create(webpackConfig);
  devServerConfig.devtool = 'eval';
  devServerConfig.debug = true;
  devServerConfig.entry = [
    'webpack-dev-server/client?http://celerity.dev:8080/',
    'webpack/hot/only-dev-server'
  ].concat(devServerConfig.entry);
  devServerConfig.plugins = devServerConfig.plugins.concat(
    new webpack.HotModuleReplacementPlugin()
  );

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devServerConfig), {
    publicPath: '/' + devServerConfig.output.publicPath,
    hot: true,
    inline: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    stats: {
      colors: true
    }
  }).listen(8080, '0.0.0.0', function(err) {
    if(err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    gutil.log('[webpack-dev-server]', 'http://celerity.dev:8080/index.html');
  });
});

gulp.task('default', ['webpack-dev-server']);
gulp.task("build", ["webpack:build"]);
