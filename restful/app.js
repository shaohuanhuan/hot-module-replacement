var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
global.version = require('./common/config').version //版本号
var log4js=require('log4js')

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/log.log',
      maxLogSize: 1024*10,
      backups:3,
      category: 'normal'
    }
  ],
  replaceConsole: true
});


var options = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'  ? {
  viewsPath: '../static',
  publicPath: '../static'
} : {viewsPath: '../webApp', publicPath: '../static'};

  // console.log(options);
global.config = require('./conf/'+process.env.NODE_ENV);
var index = require('./routes/index');

var app = express();
// 处理静态资源的中间件
var webpackDevMiddleware = require("webpack-dev-middleware");
// 实现无刷新更新的中间件
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');
var compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));
app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));


var logger = log4js.getLogger('normal');
logger.setLevel('debug');
app.use(log4js.connectLogger(logger, {level:log4js.levels.debug}));

const nativeLog = console.log;
console.log = function(){
  logger.info(arguments);
}


app.locals.domain = config.domain;
app.locals.apiHost = config.api_host;
app.locals.analyzeDomain = config.analyze_domain;
app.locals.serverApiHost = config.server_api_host;

// view engine setup
app.set('views', path.join(__dirname, options.viewsPath));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, options.publicPath),{maxAge:1000*60*60}));
app.use('/plugins', express.static(path.join(__dirname, '../node_modules'),{maxAge:1000*60*60}));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/views/error');
});
module.exports = app;
