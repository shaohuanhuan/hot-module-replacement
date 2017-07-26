import userApi from './userApi'
// import Service from '../serveice.js'
let $ = window.$
let $register = $('#register')
let $captcha = $('#captcha')
var $email = $('.username')
var $showPasswd = $('.show-passwd')
var $onloonService = $('.onloon-service')
var $password = $('.password')
var $rePassword = $('.confirm-password')
console.log($rePassword)
/**
 * 点击注册
 */
$register.on('click', (e) => {
  if (!$register.hasClass('able')) {
    console.log('灰色注册按钮点击')
    return
  }
  let loginAccount = $email.val()
  let password = $password.val()
  let captcha = $captcha.val()
  userApi.register(loginAccount, password, captcha).then(res => {
    if (res.data.code === 0) {
      console.log('注册成功!')
      sessionStorage.setItem('user', JSON.stringify(res.data.data))
      // var orderHref = Service.getUrlParams('orderHref')
      // window.location.href = orderHref || '/?shopId=' + window.shopId
      window.location.href = '/users/login/?shopId=' + window.shopId
    } else {
      $('.validate-wrap').addClass('error')
      $('.login-head-tip').text(res.data.message)
    }
  })
})
/**
 * 密码展现
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$showPasswd.on('click', (e) => {
  if ($password.attr('type') === 'password') {
    $password.attr('type', 'text')
    $rePassword.attr('type', 'text')
    $showPasswd.html('Hide password')
  } else {
    $password.attr('type', 'password')
    $rePassword.attr('type', 'password')
    $showPasswd.html('Show password')
  }
})
/**
 * 点开政策条例
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$onloonService.on('click', (e) => {
  window.open('/users/policy')
})
