/**
 * @author monkeywang
 * Date: 17/3/27
 */
import homeApi from '../../../common/js/home'
import listT from '../../views/components/list.jade'
import './common/header'
import './common/advert'
import './common/productList'
import './common/carousel'
import './common/aboutUs'

let $ = window.$
let NProgress = window.NProgress

/**
 * 滚动分页
 */
let pagedata = {loading: false, page: 1, innerHeight: window.innerHeight}

// 滚动加载
$(window).scroll(() => {
  let scrollTop = homeApi.getScrollHeight()     // 获取垂直滚动条到顶部的距离
  let windowHeight = homeApi.getClientHeight()       // 浏览器窗口的高度
  let scrollHeight = homeApi.getScrollHeight()      // 整个网页的高度
  if (scrollTop >= scrollHeight - windowHeight - 260 && pagedata.loading === false) {
    pagedata.loading = true
    pagedata.page++
    renderList(pagedata.page, true)
  }
})
/**
 * 列表加载
 * @param page
 * @param isScroll
 */
let renderList = (page, isScroll) => {
  let homelist = $('#home-list')
  let loadicon = '<div class="load"><img src="../../static/image/home/load.gif"/></div>'
  let nodata = '<div class="no-data">No More Data...</div>'
  homelist.append(loadicon)
  pagedata.loading = true
  let data = {
    code: 1
  }
  // homeApi.getProductList().then(data => {
  let load = homelist.find('.load')
  if (data.code === 0) {
    let result = data.data.records
    console.log('result', result)
    if (result.length === 0) {
      homelist.append(nodata)
      $(window).unbind('scroll')
      load.remove()
      return
    }
    let container = homelist.find('ul')
    for (let i = 0; i < result.length; i++) {
      let item = result[i]
      item.priceMin = (parseFloat(item.priceMin) / 100).toFixed(2)     // 价格转换
      item.priceMax = (parseFloat(item.priceMax) / 100).toFixed(2)
      let $list = $(listT(item))
      console.log(9911)
      container.append($list)
      pagedata.loading = false
      load.remove()
    }
  } else {
    if (isScroll) {
      $(window).unbind('scroll')
    }
    load.remove()
  }
}

renderList(pagedata.page, false)

window.say = function (src) {
  $('.logo-img').attr('src', src)
}
window.set = function (editTag, text) {
  $(editTag).text(text)
}
NProgress.done()
