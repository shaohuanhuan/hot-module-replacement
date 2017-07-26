/**
 * @author monkeywang
 * Date: 17/4/18
 */
import homeApi from '../../../../common/js/home'
import productListT from '../../../views/components/list.jade'
const $ = window.$
const plat = window.plat
const shopId = homeApi.getUrlParams('shopId')
const size = 8 // 默认显示的条目数
// const $containerProduct = $('.newest-products')

homeApi.getProductList({shopId, size}).then((res) => {
  if (!res.data.code) {
    let records = res.data.data
    if ((records.length === 0 || records === null)) {
      if (plat !== 2) {
        $('.newest-products').hide()
      }
      if (plat === 0) {
        $('.list-loading').remove()
      }
      // return
    } else {
      records.forEach((item) => {
        let products = {
          shopId,
          index: true,
          src: item.wholeProductFirstPic,
          desc: item.productName,
          productId: item.productId,
          i: null
        }
        let $productList = $(productListT(products))
        $productList.data(products)
        $('.productList').append($productList)
      })
      $('.list-loading').remove()
    }
  }
})

$('.show-all').on('click', function () {
  window.location.href = `/products?shopId=${shopId}`
})
