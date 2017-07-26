/**
 * @author monkeywang
 * Date: 17/3/27
 */

/* 引入操作路径模块和webpack */
var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var entries = getEntry('./webApp/**/js/**/index.js'); // 获得入口js文件

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname, name;

  glob.sync(globPath).forEach(function (entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-4);
    name = tmp[0] + '/'+tmp[1]+'/' +tmp[2]; // 正确输出js和html的路径
    entries[name] = entry;
  });
  return entries;
}
// 与webpack-dev-middleware配合需要使用到webpack-hot-middleware，
// 在内存中使用时需要为入口文件添加一个'webpack-hot-middleware/client'，
Object.keys(entries).forEach(function (name) {
  entries[name] = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'].concat(entries[name])
})
// 同时输出的文件也和原来不同，文件不再带有根目录，因此，Path和publicpath均需要修改
module.exports = {
  /* 输入文件 */
  entry: entries,
  output: {
    /* 输出目录，没有则新建 */
    path: path.resolve(__dirname, './static/'),
    /* 静态目录，可以直接从这里取文件 */
    publicPath: './static/',
    /* 文件名 .[name]是文件名字是entry的键值*/
    filename: '[name].js',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  module: {
    rules: [
      /* 配置ESlint */
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: "pre",
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      /* 用babel来解析js文件并把es6的语法转换成浏览器认识的语法 */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        /* 排除模块安装目录的文件 */
        exclude: /node_modules/,
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader',
        /* 排除模块安装目录的文件 */
        exclude: /node_modules/
      }
    ]
  },
  // 添加相应的热重载插件
  plugins: [
    // 根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，
    // 使得ids可预测，降低文件大小，该模块推荐使用
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}