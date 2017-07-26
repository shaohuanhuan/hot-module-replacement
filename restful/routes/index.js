'use strict'
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let templateConf = require('../conf/templateConf')
/* GET home page. */
router.get('/', (req, res, next) => {
  templateConf(req, res, {
    url: '/views/homePage/index',
    title: 'home',
    pageCode:'index'
  })
});
/**
 * 广告位查询接口
 */
router.get('/bshop/shop/advert/show', (req, res, next) => {
  httpRequest.get(`/bshop/shop/advert/show${req._parsedUrl.search}`, (data) => {
    if (res._header) return;
    res.send(data);
  })
});

module.exports = router;
