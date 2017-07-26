import homeApi from '../../../../common/js/home'
import collectApi from '../../../../common/js/collect/collectAPI'
import groupT from '../../../views/components/group.jade'
import productMenu from '../../../views/products/products/product-menu.jade'
import '../../../../common/js/sw-config'
import '../../../../common/js/home/index'

let $ = window.$
let apiHost = window.apiHost
let $searchBar = $('.search-bar')
let $hiddenSearch = $('.hidden-search')
let $logoImg = $('.logo-img')
let $pcSearch = $('.hidden-search')
let $mbSearch = $('.mbSearch')

/**
 * footer区域
 */
const $footer = $('.footer-container')
const $iconTop = $('.icon-top')
const $xsList = $('#xs-list')
const $tel = $('.tel', $footer)
const $email = $('.email', $footer)
const $location = $('.location', $footer)
const $icon = $('.icon-num', $footer)
// const $fb = $('.icon-num', $icon)
// const $in = $('.icon-num', $icon)
// const $tw = $('.icon-num', $icon)
// const $backToTop = $('.backTop')
$('body').on('click', '.backTop', function () {
  document.documentElement.scrollTop = document.body.scrollTop = 0
})
$(window).scroll(function () {
  let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  if (scrollTop + document.body.clientHeight === document.body.scrollHeight) {
    // $('.backTop').css('visibility','hidden')
    $('.backTop').removeClass('retop')
  } else {
    // $('.backTop').css('visibility','visible')
    $('.backTop').addClass('retop')
  }
})
/**
 * 获取头部banner
 */
const shopId = homeApi.getUrlParams('shopId')
homeApi.getCompanyDetail({shopId}).then((res) => {
  if (!res.data.code) {
    if (res.data.data) {
      $logoImg.show()
      if (res.data.data.shopLogoWhole !== null && res.data.data.shopLogoWhole !== '') {
        $logoImg.removeClass('logo-default')
        $logoImg[0].style.backgroundImage = 'url(' + res.data.data.shopLogoWhole + ')'
        // $logoImg.attr('src', res.data.data.shopLogoWhole)
      } else {
        $logoImg[0].style.backgroundImage = 'url(/images/DefaultLogo.png)'
        // $logoImg.attr('src', '/images/DefaultLogo.png')
      }

      $tel.text(res.data.data.contactTelephone)
      $email.text(res.data.data.contactEmail)
      $location.text(res.data.data.address)
      // if ((res.data.data.facebookUrl === null || res.data.data.facebookUrl === '') && (res.data.data.twitterUrl === null || res.data.data.twitterUrl === '') && (res.data.data.linkedinUrl === null || res.data.data.linkedinUrl === '')) {
      //   $('#footer').hide()
      // }
      if (res.data.data.facebookUrl !== null && res.data.data.facebookUrl !== 'null' && res.data.data.facebookUrl !== '') {
        $icon.append(`<a href="${res.data.data.facebookUrl}" target="_blank" ><i class="glyphicon glyphicon-facebook"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.facebookUrl}" target="_blank" class="ff"><i class="glyphicon glyphicon-facebook"></i></a>`)
        $xsList.append(`<a href="${res.data.data.facebookUrl}" target="_blank" class="social-container"><i class="glyphicon glyphicon-facebook"></i></a>`)
      } else {
        $icon.append(`<a><i class="glyphicon glyphicon-facebook"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-facebook"></i></a>`)
        $xsList.append(`<a><i class="glyphicon glyphicon-facebook"></i></a>`)
      }
      if (res.data.data.twitterUrl !== null && res.data.data.twitterUrl !== 'null' && res.data.data.twitterUrl !== '') {
        $icon.append(`<a href="${res.data.data.twitterUrl}" target="-_blank"><i class="glyphicon glyphicon-twitter"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.twitterUrl}" target="_blank"><i class="glyphicon glyphicon-twitter"></i></a>`)
        $xsList.append(`<a href="${res.data.data.twitterUrl}" target="_blank" class="social-container"><i class="glyphicon glyphicon-twitter"></i></a>`)
      } else {
        $icon.append(`<a><i class="glyphicon glyphicon-twitter"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-twitter"></i></a>`)
        $xsList.append(`<a><i class="glyphicon glyphicon-twitter"></i></a>`)
      }
      if (res.data.data.linkedinUrl !== null && res.data.data.linkedinUrl !== 'null' && res.data.data.linkedinUrl !== '') {
        $icon.append(`<a href="${res.data.data.linkedinUrl}" target="_blank"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $iconTop.append(`<a href="${res.data.data.linkedinUrl}" target="_blank"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $xsList.append(`<a href="${res.data.data.linkedinUrl}" target="_blank" class="social-container"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
      } else {
        $icon.append(`<a style="margin-right:auto"><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $iconTop.append(`<a><i class="glyphicon glyphicon-linkedIn"></i></a>`)
        $xsList.append(`<a><i class="glyphicon glyphicon-linkedIn"></i></a>`)
      }
    }
  }
})
/**
 * 获取登录用户信息
 */
homeApi.getUserInfo({}).then(res => {
  if (!res.data.code) {
    localStorage.setItem('isLogin', 1)
    let usename = $('.username')
    usename.text(res.data.data.nickName)
    usename.attr('href', apiHost + '/b2b_pc/static/view/account/myCenter.html')
    $('.user-loged').show()
  } else {
    localStorage.removeItem('isLogin')
    $('.user-opration').show()
  }
})
/**
 * 获取分组列表
 */
homeApi.getGroup({shopId}).then((res) => {
  if (!res.data.code) {
    let groups = res.data.data
    if (groups.length > 0) {
      let $groups = $(groupT({groups, shopId}))
      $groups.data(groups)
      $('.drop-menu').append($groups)
      // products列表分组
      if (window.location.href.indexOf('/products') !== -1) {
        let $productMenu = $(productMenu({groups: groups}))
        $productMenu.data(groups)
        $('.product-menu-loading').remove()
        $('.product-menu').append($productMenu)
      }
    }
  }
})

$searchBar.on('click', (e) => {
  e.preventDefault()
  $hiddenSearch.removeClass('zoomOut').addClass('zoomIn')
  $hiddenSearch.css('display', 'block')
})
$('.close-input', $hiddenSearch).on('click', (e) => {
  $hiddenSearch.removeClass('zoomIn').addClass('zoomOut').one('animationend', () => {
    $hiddenSearch.css('display', 'none')
  })
})
$('.navbar-toggle', '#company-p', '#contacts').on('click', function (e) {
  if (!$(this).hasClass('active')) {
    $(this).addClass('active')
    $('.menu-close').show()
    $('.menu-open').hide()
  } else {
    $(this).removeClass('active')
    $('.menu-close').hide()
    $('.menu-open').show()
  }
})
let searchFn = function () {
  let searchValue = encodeURI(encodeURI($('input', $(this).parent()).val()))
  window.location.href = `/search?searchText=${searchValue}&shopId=${shopId}`
}
let searchFn1 = function () {
  let searchValue = encodeURI(encodeURI($('#input-down').val()))
  window.location.href = `/search?searchText=${searchValue}&shopId=${shopId}`
}
$('.search-btn', $pcSearch).on('click', searchFn)
$('.search-btn', $mbSearch).on('click', searchFn)
$('#input-down').on('keydown', function () {
  if (event.keyCode === 13) {
    searchFn1()
  }
})

collectApi.getCollect({'shopId': shopId})
