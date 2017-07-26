/**
 * @author monkeywang
 * Date: 17/3/31
 */
var https = require('https');
var hostname = global.config.server_api_host;
var querystring = require("querystring");

/**
 * HttpRequest 类
 * @constructor
 */
var HttpRequest = function(){};
/**
 * function 请求函数
 * @param opts
 */
HttpRequest.prototype.requestUrl = function (opts) {
  var bodyString = querystring.stringify(opts.params);
  var options = {
    hostname: hostname,
    rejectUnauthorized:false,
    port: 443,
    path: opts.url,
    method: opts.method,
    headers: {
      "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6",
      "Cache-Control":"max-age=0",
      "Connection":"keep-alive",
      "User-Agent":"Mozilla/5.0 (Windows NT 5.2) AppleWebKit/537.36 (KHTML, like Gecko)",
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(bodyString, 'utf8')
    }
  };
  var req = https.request(options, (res) => {
    var buffers = []
    res.on('data', (d) => {
      buffers.push(d)

    });
    res.on('end', (chunk) => {
      console.log(123)
      var wholeData = Buffer.concat(buffers);
      var dataStr = wholeData.toString('utf8');
      opts.cb(wholeData)
    })
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.write(bodyString)
  req.end();
};
/**
 * post 请求
 * @param url
 * @param params
 * @param cb
 */
HttpRequest.prototype.post = function(url, params, cb){
 this.requestUrl({
   method: 'POST',
   url: url,
   params: params,
   cb: cb
 })
};
/**
 * get 请求
 * @param url
 * @param params
 * @param cb
 */
HttpRequest.prototype.get = function(url, params, cb){
  if(arguments.length === 2){
    cb = params;
    params = undefined;
  }
  this.requestUrl({
    method: 'GET',
    url: url,
    params: params,
    cb: cb
  })
};

module.exports = new HttpRequest;
