/**
 * @author
 * Date: 17/4/19
 */
import homeApi from '../../../../common/js/home'

const $ = window.$
const shopId = homeApi.getUrlParams('shopId')
const $describe = $('.discrible-text')
// const $img = $('#img-left')

// const $backToTop = $('.backTop')
// $backToTop.on('click', function () {
//   document.documentElement.scrollTop = document.body.scrollTop = 0
//   // $('.glyphicon-top').css('color','#359af6')
// })
// $(window).scroll(function () {
//   let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
//   if (scrollTop + document.body.clientHeight === document.body.scrollHeight) {
//     $('.backTop').addClass('btp-hidden')
//   } else {
//     $('.backTop').removeClass('btp-hidden')
//   }
// })

/**
 * about us 图标+描述
 */

homeApi.getAboutus({shopId: shopId, previewTag: 0}).then(res => {
  if (!res.data.code) {
    if (res.data.data.wholeDescImgUrl !== '' && res.data.data.wholeDescImgUrl !== null) {
      let apImg = ''
      apImg = `<img class="img-left" src="${res.data.data.wholeDescImgUrl}">`
      $('.ab-img-container').append(apImg)
      // $img.attr('src', res.data.data.wholeDescImgUrl)
      $('.img-hold').remove()
    } else {
      let apImg = `<img class="img-left df-img" src="/images/CombinedShape1.png">`
      $('.ab-img-container').append(apImg)
      $('.img-hold').remove()
    }
    let desc = res.data.data.shopDesc
    if (desc !== '' && desc !== null) {
      if (desc && desc.indexOf('\n') >= 0) {
        desc = desc.replace(/\n/g, '<br/>')
      }
      $describe.html(desc)
      $('.discrible').append(`<a href="/profile?shopId=${shopId}" class="jump-to"><p class="btn-blue learn-btn margin-30">LEARN MORE<i class="glyphicon-Pathone icon-arror"></i></p></a>`)
      $('.text-loading').remove()
    }
  }
})
