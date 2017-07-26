/**
 * @author monkeywang
 * Date: 17/4/19
 */
import homeApi from '../../../../common/js/home'

const $ = window.$
const $container = $('.carousel-container')
const shopId = homeApi.getUrlParams('shopId')
const $carouselInner = $('.carousel-inner', $container)
/**
 * banner轮播
 */

// if (plat === 2) {
//   $('.glyphicon-chevron-right').hide()
//   $('.glyphicon-chevron-left').hide()
// }
$('#carousel-banner').carousel({
  interval: 5000
})
homeApi.getAdvert({shopId, position: 'BANNAER'}).then((res) => {
  if (!res.data.code) {
    let carouselNd = ''
    let olRight = ''
    let active = 'active'
    // 当返回 data为null时候
    if (!res.data.data) {
      $('.glyphicon-chevron-right').hide()
      $('.glyphicon-chevron-left').hide()
      $('#carousel-banner', $container).show()
      $('.banner-loading', $container).remove()
      return
    }
    // 当返回为空数组的时候
    if (res.data.data && res.data.data.length === 0) {
      $('.glyphicon-chevron-right').hide()
      $('.glyphicon-chevron-left').hide()
      $('#carousel-banner', $container).show()
      $('.banner-loading', $container).remove()
      return
    }
    if (res.data.data.length === 1) {
      $('.glyphicon-chevron-right').hide()
      $('.glyphicon-chevron-left').hide()
    }
    if (res.data.data.length !== 0) {
      $carouselInner.html('')
    }
    res.data.data.forEach((obj, i) => {
      if (i === 0) {
        let img = new Image()
        img.src = obj.pircUrlWhole
        img.onload = () => {
          $('#carousel-banner', $container).show()
          $('.banner-loading', $container).remove()
        }
        olRight += `<li class="active" data-target="#carousel-banner" data-slide-to="0"></li>`
      } else {
        active = ''
        olRight += `<li class="only-one" data-target="#carousel-banner" data-slide-to="${i}"></li>`
      }
      if (obj.linkTag === 0) {
        carouselNd += `<div class="item ${active}"><a href="${obj.linkUrl}" target="_blank"><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      } else if (obj.linkTag === 1) {
        carouselNd += `<div class="item ${active}"><a href="/detail?shopId=${shopId}&productId=${obj.linkUrl}" target="_blank"><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      } else if (obj.linkTag === -1) {
        carouselNd += `<div class="item ${active}"><a><img src="${obj.pircUrlWhole}", alt=""></a></div>`
      }
    })
    $('.carousel-indicators').append(olRight)
    $carouselInner.append(carouselNd)
  }
})
