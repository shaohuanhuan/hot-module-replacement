/**
 * @author shaohuan
 * Date: 17/7/4
 * theme12, 13, 14, 15, 16, 17,18,19,20模板的详情js的公共
 */
import api from './detailApi'
import Utils from '../serveice'
// import '../../theme' + window.them + '/js/home/common/header.js'
// import './common/supplier.js'
// import './common/download.js'
// import mainTpl from '../../theme' + window.them + '/views/detail/indexTemplate/mainPictpl.jade'
import 'babel-polyfill'
import base64 from 'js-base64'

const plat = window.plat
const apiHost = window.apiHost
const $ = window.$
let mainEl = $('#main-pic')
let com = {
  unitsMap: {
    'Cubic Foot': 'Feet',
    'Foot': 'Feet',
    'Square Foot': 'Feet',
    'Box': 'es',
    'Cubic Inch': 'es',
    'Gross': 'es',
    'Inch': 'es',
    'Perch': 'es',
    'Quart': 'es',
    'Square Inch': 'es',
    'Hertz': '',
    'Kilohertz': '',
    'Megahertz': ''
  },
  supportMap: {
    '1': 'Refuse',
    '0': 'Available'
  },
  dayUnitMap: {
    '2': 'Day',
    '0': 'Week',
    '1': 'Month'
  }
}
let base = base64.Base64
let mainTpl = null

let detail = {
  pid: Utils.getUrlParams('productId'),
  shopId: Utils.getUrlParams('shopId'),
  params: {},
  skuSpec: {},
  firstPic: '',
  prodDetail: base.decode(window.prodDetail),
  prodDesc: base.decode(window.prodDesc),

  init (mainT) {
    mainTpl = mainT
    this.render()
    this.events()
    window.onresize = this.adjust
    this.adjust()
  },
  render () {
    /**
     * 详情数据
     */
    let res = JSON.parse(detail.prodDetail)
    // api.getDetail({productId: detail.pid}).then(res => {
    let info = {}
    let data = res.data
    let prod = data.product
    let extend = data.productExtends

    extend.productPicUrlsWhole = extend.productPicUrlsWhole.split(';')
    // 天周月
    prod.suptype = com.dayUnitMap[prod.supplyType]
    // paymenthod
    // prod.paymentMethod = prod.paymentMethod // .substring(0, prod.paymentMethod.length - 1)
    Object.assign(info, prod)
    if (prod.quotationMethod === 0) { // 0数量
      prod.dupunit = com.unitsMap[prod.productUnitEn] ? prod.productUnitEn + ' (' + com.unitsMap[prod.productUnitEn] + ')' : prod.productUnitEn + '(s)'
      Object.assign(info, {
        productNumPrices: data.productNumPrices
      })
    } else if (prod.quotationMethod === 1) { // 1 sku
      let sku = {}
      sku.specMap = data.specMap

      sku.skuprice = Utils.toFl(prod.priceMin)
      if (prod.priceMin !== prod.priceMax) {
        sku.skuprice += ' ~ ' + Utils.toFl(prod.priceMax)
      }

      Object.assign(info, sku)
    } else { // 2 fob
      let fob = data.productFobs[0] // 商品FOb报价
      fob.unitEn = $.trim(fob.productUnitEn) ? fob.productUnitEn : prod.productUnitEn
      fob.dupunit = com.unitsMap[fob.unitEn] ? fob.unitEn + ' (' + com.unitsMap[fob.unitEn] + ')' : fob.unitEn + '(s)'

      if (fob.fobMinPrice === fob.fobMaxPrice) {
        fob.fobprice = Utils.toFl(fob.fobMinPrice)
      } else {
        fob.fobprice = Utils.toFl(fob.fobMinPrice) + '~' + Utils.toFl(fob.fobMaxPrice)
      }

      Object.assign(info, fob)
    }

    // 商品主图
    Object.assign(info, prod, extend, {
      iSBindPayAccount: data.iSBindPayAccount
    })

    let $productList = $(mainTpl(info))
    // $productList.data(products)
    mainEl.find('.row').html($productList)
    mainEl.removeClass('detail-loading')

    // sku
    if (prod.quotationMethod === 1) {
      detail.skuShow(data.productSpecs, prod.priceUnit, data.specMap)
    }
    // 商品属性
    let descattr = $('#desc-attr')
    if (!extend.productAttr) {
      descattr.hide()
    }

    let attrArr = extend.productAttr.split(';')
    let attrdesc = ''
    if (data.properties) {
      data.properties.forEach(item => {
        attrdesc += `<li class="col-lg-4 col-md-6 col-sm-6 col-xs-12"><label>${item.propertyNameEn} </label><em>:</em><span>${item.propertyValueNameEn}</span></li>`
      })
    }

    attrArr.forEach(item => {
      let lbl = item.split(':')[0]
      let spn = item.split(':')[1]
      if (!lbl || !spn) return
      // attr[item.split(':')[0]] = item.split(':')[1]
      attrdesc += `<li class="col-lg-4 col-md-6 col-sm-6 col-xs-12"><label>${lbl} </label><em>:</em><span>${spn}</span></li>`
    })

    descattr.find('ul').html(attrdesc)
    // 商品描述
    let desc = $('#desc-img')
    // desc.html(extend.productDesc)
    desc.html(detail.prodDesc)
    desc.parents('.detail-loading').removeClass('detail-loading')

    // 放大镜
    mainEl.magnifying()
    mainEl.find('.img-main').trigger('mouseout')

    // 主图 轮播
    let maip = $('#carousel-mainpic')
    maip.carousel({
      pause: true,
      interval: false
    })
    maip.on('slide.bs.carousel', function (d) {
      let len = $(d.relatedTarget).prevAll('.item').length
      $('#img-list').find('a').eq(len).addClass('select').siblings('a').removeClass('select')
      maip.next('.magnify-show').find('img').attr('src', $(d.relatedTarget).find('img').attr('src'))
    }) //, data-original="#{productFirstPic}"

    detail.shopId = data.shopId
    // 设置meta
    let fburl = window.location.href
    // let serv = 'server.onloon.com.cn'
    $('#faceUrl').attr('content', prod.productFirstPic) // 获取详情页主图赋给meta
    $('#faceTit').attr('content', prod.productName) // 商品名称赋给meta
    $('#fbUrl').attr('content', fburl)

    detail.firstPic = prod.productFirstPic
    // 询盘数据
    let pic = extend.productPicUrls
    if (pic && pic.split(';')[0]) {
      pic = pic.split(';')[0]
    }

    detail.params = {
      'details[0].productId': detail.pid,
      'details[0].productName': prod.productName,
      'details[0].productModel': prod.productModel,
      'details[0].productPic': extend.productPicUrls.split(';')[0],
      'details[0].productPrice': prod.priceUnit + ' ' + Utils.toFl(prod.priceMin) + '-' + Utils.toFl(prod.priceMax)
    }

    detail.phoneSwiper()
    // })

    // 下拉列表
    $('select.ui-select').select3()
  },

  events () {
    // 数量加减
    mainEl.on('click', 'a.glyphicon-reduce', (e) => {
      let num = $(e.target).parents('.calu-wrap').find('input')
      if (num.val() && num.val() > 1) {
        let n = Number(num.val())
        n--
        num.val(n)
      }
    })

    mainEl.on('click', 'a.glyphicon-plus', (e) => {
      let num = $(e.target).parents('.calu-wrap').find('input')
      if (num.val()) {
        let n = Number(num.val())
        n++
        num.val(n)
      }
    })

    mainEl.on('input', '.calu-wrap .ui-input', (e) => {
      let num = $(e.target)
      let numv = num.val()
      if (isNaN(numv)) {
        num.val(1)
      }
      if (numv < 1) {
        num.val(1)
      }
      if (numv.indexOf('.') !== -1) {
        num.val(new Number(numv).toFixed(0)) // eslint-disable-line
      }
    })
    // 选择规格
    mainEl.on('change', '.spec-select .ui-select', (e) => {
      let allselect = mainEl.find('.spec-select').find('.select3-options')
      let specgroup = ''
      // let flag = false
      for (let i = 0, len = allselect.length; i < len; i++) {
        let selectli = allselect.eq(i).find('li.selected')
        if (!selectli.length) {
          selectli = allselect.eq(i).find('li:eq(0)')
        }
        let lbl = allselect.eq(i).parents('.select3').prev('label').attr('data-val')
        specgroup += lbl + ':' + selectli.attr('rel') + ';'
      }
      detail.skuPriceShow(false, specgroup)
    })
    // 下单
    mainEl.on('click', '#buy-now', (e) => {
      e.preventDefault()
      if (!detail.buynowValid()) { // 判断数量是否合理
        return
      }
      let product = {
        shopId: detail.shopId,
        productId: detail.pid
      }
      let p = $('#spec-box')
      let amount = +p.find('.ui-input').val()
      // 规格对应的库存
      let allselect = mainEl.find('.spec-select').find('.ui-select')
      let specgroup = ''
      let flag = false
      for (let i = 0, len = allselect.length; i < len; i++) {
        if (!allselect.eq(i).val()) {
          flag = true
          break
        }
        let lbl = allselect.eq(i).parents('.select3').prev('label').attr('data-val')
        specgroup += lbl + ':' + allselect.eq(i).val() + ';'
      }
      if (flag) {
        Utils.alert('you should choice product', 'warning')
        return
      }
      product.quantity = amount
      product.specName = specgroup

      let user = localStorage.getItem('isLogin')
      if (!user) {
        localStorage.setItem('currHref', window.location.href)
        window.location.href = '/users/login?shopId=' + detail.shopId
        return
      }
      api.addCart(product).then(res => {
        let data = res.data
        if (!data.code) {
          Utils.alert('add to shopping cart success!')
          window.location.href = apiHost + '/b2b_pc/static/view/order/shoppingCart.html?shopId=' + detail.shopId
        }
      })
    })

    // 询盘提交
    $('.desc-container').on('click', '.btn-send', () => {
      let params = {}
      let form = $('#form')
      let data = form.serializeArray()
      for (let i = 0, len = data.length; i < len; i++) {
        params[data[i].name] = data[i].value
      }
      params['shopId'] = detail.shopId
      let str = '产品页'
      if (plat === 1) {
        str = 'Facebook产品页'
      }
      params['source'] = str + detail.params['details[0].productName']
      Object.assign(params, detail.params)
      api.submitSupplier(params).then(res => {
        if (!res.data.code) {
          form[0].reset()
          form.find('.form-group').removeClass('valid')
          form.find('.form-group').removeClass('error')
          form.find('.btn-send').prop('disabled', true)
          Utils.alert('Thanks for your feedback, we will have sales contact later')
        } else {
          Utils.alert(res.data.message, 'info')
        }
      })
    })

    // 小图片显示
    let imgListTimeout = null
    mainEl.on('mouseenter', '#img-list>a', (e) => {
      let _this = $(e.target)
      imgListTimeout = setTimeout(function () {
        if (_this[0].nodeName === 'IMG') {
          _this = _this.parent('a')
        }
        _this.addClass('select').siblings('a').removeClass('select')
        let index = +_this.attr('data-index')
        $('#carousel-mainpic').carousel(index)
      }, 500)
    }).on('mouseleave', '#img-list>a', (e) => {
      clearTimeout(imgListTimeout)
    })

    mainEl.on('click', '.glyphicon-share', function (e) {
      $(e.target).next('div.share-four-toggle').toggle()
    })
    $('body').click(function (e) {
      if (!$(e.target).hasClass('glyphicon-share') && !$(e.target).hasClass('share-four-xs')) {
        if ($('.share-four-xs').is(':visible')) {
          $('div.share-four-toggle').hide()
        }
      }
    })
    /**
     * 商品渠道分享
     */
    mainEl.on('click', '.glyphicon-facebook', function () {
      window.open('http://www.facebook.com/sharer.php?u=' + detail.getShareUrl(1) + '&t=' + Math.random(), 'sharer', 'toolbar=0,status=0,width=626,height=436')
      // window.open('http://www.facebook.com/sharer.php?u=https://buyer.onloon.com.cn/detail?shopId=149468631254729157&productId=5820bcf9f03a4f4890acc7d9690a1a6a&t=' + Math.random(), 'sharer', 'toolbar=0,status=0,width=626,height=436')
      return false
    })
    mainEl.on('click', '.glyphicon-twitter', function () {
      window.open('http://twitter.com/home/?status=' + detail.getShareUrl(2), 'sharer', 'toolbar=0,status=0,width=626,height=436')
      return false
    })
    mainEl.on('click', '.glyphicon-pinterest', function () {
      window.open('http://www.pinterest.com/pin/create/extension/?spm=&url=' + detail.getShareUrl(4) + '&media=' + detail.firstPic, '_blank')
      return false
    })
    mainEl.on('click', '.glyphicon-linkedIn', function () {
      window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + detail.getShareUrl(3) + '&media=' + detail.firstPic, 'sharer', 'toolbar=0,status=0,width=626,height=436')
      return false
    })
  },
  getShareUrl (type) {
    return encodeURIComponent(apiHost + '/buyer/product/genshareinfo?shopId=' + detail.shopId + '&productId=' + detail.pid + '&type=' + type)
  },
  /**
   * [skuShow description]
   * @param  array specData  [规格列表]
   * @param  string priceUnit [价格单位]
   * @param  object specMap   [规格map]
   * @return {[type]}           [description]
   */
  skuShow (specData, priceUnit, specMap) {
    for (let i = 0, len = specData.length; i < len; i++) {
      let spenum = specData[i].productSpecNums
      let startNumPirce = []
      if (spenum.length) {
        for (let j = 0, spenumlen = spenum.length; j < spenumlen; j++) {
          if (j < spenumlen - 1) {
            startNumPirce.push({startNum: spenum[j].startNum + ' ~ ' + Number(spenum[j + 1].startNum - 1), price: Utils.toFl(spenum[j].price)})
          } else {
            startNumPirce.push({startNum: '≥ ' + spenum[j].startNum, price: Utils.toFl(spenum[j].price)})
          }
        }
      }
      detail.skuSpec[specData[i].specName] = {specPrice: specData[i].specPrice, priceUnit: priceUnit, invenory: specData[i].invenory, spenum: spenum, startNumPirce: startNumPirce}
    }
    detail.skuPriceShow(true, specMap)
  },

  skuPriceShow (isFirst, specMap) {
    let tpl = ``
    let specName = ''
    if (isFirst) { // 初始化
      for (let key in specMap) {
        specName += key + ':' + specMap[key][0] + ';'
      }
    } else { // 规格下拉选择
      specName = specMap
    }
    // 显示的价格/起批量表格
    let specVals = detail.skuSpec[specName]
    let firstSpec = specVals.startNumPirce
    let tit = `<li class="tit"><p>Price<em>(${detail.skuSpec[specName].priceUnit})</em></p><p>Quantity</p></li>`
    let skuprice = $('#sku-price')
    let allskusprice = $('#sku-allprice')
    if (firstSpec.length) {
      firstSpec.forEach(item => {
        tpl += `<li><p class="price">${item.price}</p><p class="quant">${item.startNum}</p>`
      })
      skuprice.parents('.price-tab').show()
      allskusprice.hide()
      skuprice.html(tit + tpl)
    } else {
      allskusprice.html(specVals.priceUnit + ' ' + Utils.toFl(specVals.specPrice))
      allskusprice.show()
      skuprice.parents('.price-tab').hide()
    }
  },

  buynowValid () {
    let parent = $('#spec-box').find('.spec-select')
    let sel = parent.find('.ui-select')
    let quantity = parent.find('.ui-input').val()
    let specVN = ''

    sel.each((i, item) => {
      specVN += $(item).parents('.select3').prev('label').attr('data-val') + ':' + $(item).val() + ';'
    })

    let specNum = detail.skuSpec[specVN]
    let isGo = true
    if (specNum.invenory < quantity) { // 输入数量大于库存
      // Utils.alert('Please enter a lower number.', 'warning')
      Utils.alert('The product does not have enough stock', 'warning')
      isGo = false
    }

    if (specNum.spenum.length) { // 有起批价
      if (quantity < specNum.spenum[0].startNum) { // 小于最小起批量
        Utils.alert('Please enter a number larger than ' + specNum.spenum[0].startNum, 'warning')
        // Utils.alert('Please enter a larger number.', 'warning')
        isGo = false
      }
    }
    return isGo
  },

  /**
   * 手机端滑动
   */
  phoneSwiper () {
    let $advContainer = $('.img-main')
    let maip = $('#carousel-mainpic')
    // let $advItem = $('.row', $advContainer)
    // const $advertCon = $advContainer.find('.item>img')
    let x1
    let x2

    /**
     * 获取触摸起点
     */
    $advContainer.on('touchstart', (e) => {
      let _touch = e.targetTouches[0]
      x1 = _touch.pageX
    })

    /**
     * 滑动结束点
     */
    $advContainer.on('touchend', (e) => {
      let _touch = e.changedTouches[0]
      x2 = _touch.pageX
      if (x2 - x1 > 10) {
        maip.carousel('prev')
      } else if (x2 - x1 < -10) {
        maip.carousel('next')
      }
    })
  },
  // 详情描述里的table
  adjust () {
    let div = $('#desc-img')
    let w = div[0].clientWidth
    div.find('table').each((indx, item) => {
      if ($(item).parents('table').length === 0) {
        let wd = $(item).css('width')
        let wdn = Number(wd.replace(/[^0-9]/ig, ''))
        if (wd.indexOf('pt') !== -1) {
          if (wdn * 4 / 3 > w) {
            $(item).css('width', w)
          }
        } else if (wd.indexOf('px') !== -1) {
          if (wdn > w) {
            $(item).css('width', w)
          }
        }
      }
    })
  }
}
export default detail
// detail.init()
