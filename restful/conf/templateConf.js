/**
 * @author monkeywang
 * Date: 17/5/15
 */
let express = require('express');
let router = express.Router();
let httpRequest = require('../common/https-request')
let config = require('./'+process.env.NODE_ENV)

let request = require('request')


module.exports = function (req, res, params) {

  let template =  0
  let src = params.type ? `${params.url}` : `theme${template}${params.url}`
  let fb = req.query.fb ? req.query.fb : req.cookies.fb
  res.cookie("fb", fb, {maxAge: 1000 * 60 * 60 * 24 * 30});

  res.cookie("shopId", req.query.shopId, {maxAge: 1000 * 60 * 60 * 24 * 30});
  //  获取主题
  httpRequest.get('/buyer/shop/templaterela/getByShopId?shopId=' + req.query.shopId, '', (d) => {
    let rest = JSON.parse(d.toString())
    if (!rest.code) {
      let template = rest.data.templateCode
      let src = params.type ? `${params.url}` : `theme${template}${params.url}`
      res.cookie("template", template, {maxAge: 1000 * 60});
      renderSrc(src, req.query.shopId ? req.query.shopId : req.cookies.shopId, template)
    }else{
      console.log("______")
    }
  })

  function renderSrc (src, shopId, template) {
    res.render(src, {
      shopId: shopId,
      title: params.title,
      desc: params.desc,
      keywords: params.keywords,
      them: template,
      version: version,
      fb: fb,
      params: JSON.stringify(params),
      prodDetail: JSON.stringify(params.prodDetail),
      prodDesc: params.prodDesc,
      pageCode: params.pageCode
    });
  }


}