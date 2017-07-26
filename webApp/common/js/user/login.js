/**
 * @author monkeywang
 * Date: 17/4/13
 */
import Validator from '../verification.js'
// import Base64 from 'base64url'
import userApi from './userApi'
// import Service from '../serveice.js'
let $ = window.$
let $loginAccount = $('.username')
let $password = $('.password')
let $captcha = $('.captcha')
let $loginBtn = $('.login-btn')
let $forgot = $('.forgot')
let $goToLogin = $('.go-to-login')
let $facebook = $('.facebook-login')
let $validateInput = $('.validate-input')
let $confirmNewpasswd = $('#confirm-new-passwd')
let $newPasswd = $('#new-passwd')
const plat = window.plat
// const base64url = require('base64url')
// console.log(Base64)
console.log(77)
window.Fshop = {
  loginSuccess: function () {
    window.location.href = '/?shopId=' + window.shopId
  },
  loginFail: function (errMsg) {
    alert(errMsg)
  }
}

/**
 * facebook登录
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */

let url = location.protocol + '//' + window.location.host + '/users/facebookBack/?shopId=' + window.shopId
userApi.facebookOuth(url).then(res => {
  console.log(res)
  if (res.data.code === 0) {
    if (plat === 1) {
      window.location.href = res.data.data
    } else {
      $facebook.on('click', (e) => {
        window.open(res.data.data, 'newwindow', 'height=400, width=600, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
      })
    }
  }
})
/**
 * 记住我
 */
// $('#check').click(function () {
//   if ($('#check').attr('checked') === 'checked') {
//     $('# check').attr('checked', false)
//     $(this).attr('data-value', 0)
//   } else {
//     $('#check').attr('checked', true)
//     $(this).attr('data-value', 1)
//   }
// })

$('#check').click(function () {
  if ($(this).attr('class') === 'glyphicon-checked') {
    $(this).removeClass('glyphicon-checked')
    $(this).attr('data-value', 0)
  } else {
    $(this).addClass('glyphicon-checked')
    $(this).attr('data-value', 1)
  }
})

// 如果选择记住密码
if (localStorage.getItem('rememberCheck') === '1') {
  // $('#check').attr('checked', true)
  $('#check').attr('data-value', 1)
  $('#check').addClass('glyphicon-checked')
  $('#email').val(localStorage.getItem('email'))
}

/**
 * redisKey
 */
userApi.getUserKey()
/**
 * 登录页面表单验证
 * @return {[type]} [description]
 */
function validateLogin () {
  let email = $('#email').val()
  let passwd = $('#passwd').val()
  // console.log(email + 'email' + Validator.checkEmail(email))
  // console.log(passwd + 'passwd:' + Validator.checkPassword(passwd))
  return Validator.checkEmail(email) && Validator.checkPassword(passwd)
}
/**
 * 设置密码界面，填写email
 * @return {[type]} [description]
 */
function validateSetpasswd1 () {
  let emailPwd = $('#email').val()
  // console.log(email + 'email' + Validator.checkEmail(email))
  // console.log(passwd + 'passwd:' + Validator.checkPassword(passwd))
  return Validator.checkEmail(emailPwd)
}
/**
 * 设置密码界面2 填写密码
 * @return {[type]} [description]
 */
function validateSetpasswd2 () {
  let pswd = $('#new-passwd').val()
  return Validator.checkPasswordTwo(pswd)
}
/**
 * 注册登录按钮 的显示
 * @return {[type]} [description]
 */
function validateRegister () {
  let emailReg = $('#email').val()
  let pswdReg = $('#new-passwd').val()
  let pswdEqual = $newPasswd.val() === $confirmNewpasswd.val()
  return Validator.checkEmail(emailReg) && Validator.checkPasswordTwo(pswdReg) && pswdEqual
}
$('#email').on('keydown', function () {
  if (event.keyCode === '13') { // keyCode=13是回车键
    if (!$('#login-btn').hasClass('able')) {
      console.log('灰色登录按钮点击')
      return
    }
    loginsub()
  }
})
$('#passwd').on('keydown', function () {
  if (event.keyCode === '13') { // keyCode=13是回车键
    if (!$('#login-btn').hasClass('able')) {
      console.log('灰色登录按钮点击')
      return
    }
    loginsub()
  }
})
/**
 * 点击登录
 */
$loginBtn.on('click', (e) => {
  // $('#check').attr('check')
  if (!$('#login-btn').hasClass('able')) {
    console.log('灰色登录按钮点击')
    return
  }
  loginsub()
})
function loginsub () {
  let loginAccount = $loginAccount.val()
  let password = $password.val()
  let captcha = $captcha.val()
  console.log(password)
  /**
   * 如果选择remember me，cookie存储数据
   */
  if ($('#check').attr('data-value') === '1') {
    localStorage.setItem('rememberCheck', $('#check').attr('data-value'))
    localStorage.setItem('email', loginAccount)
  } else {
    localStorage.removeItem('rememberCheck')
    localStorage.removeItem('email')
  }
  userApi.login(loginAccount, password, captcha).then(res => {
    console.log('res', res)
    if (res.data.code === 1) {
      $('.validate-wrap').addClass('error')
      $('.login-head-tip').text(res.data.message)
    } else {
      $('.validate-wrap').removeClass('error')
      sessionStorage.setItem('user', JSON.stringify(res.data.data))
      localStorage.setItem('user', JSON.stringify(res.data.data))

      let currHref = localStorage.getItem('currHref')

      if (currHref !== 'undefined' && currHref !== 'null' && currHref !== null && currHref !== '') {
        localStorage.removeItem('currHref')
        window.location.href = currHref
      } else {
        window.location.href = '/?shopId=' + window.shopId
      }
  //       let sUrl = document.referrer
  //
  //       if (sUrl) {
  //         if (sUrl.indexOf('/users/register') > -1) {
  //           window.location.href = '/?shopId=' + window.shopId
  //         } else {
  //           window.location.href = '/?shopId=' + window.shopId
  //           // window.location.href = sUrl
  //         }
  // // 中途跳过来登录的详情页
  //       } else {
  //         var orderHref = Service.getUrlParams('orderHref')
  //         window.location.href = orderHref || '/?shopId=' + window.shopId
  //       }
    }
  })
}
/**
 * 点击忘记密码
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$forgot.on('click', (e) => {
  window.location.href = '/users/setPasswd1/?shopId=' + window.shopId
})
/**
 * 返回登录页面
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$goToLogin.on('click', (e) => {
  window.location.href = '/users/login/?shopId=' + window.shopId
})

/**
 * 输入验证
 * @param  {[type]} 'input' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$validateInput.on('input', (e) => {
  /**
   * 登录界面效验
   * @param  {[type]} validateLogin() [description]
   * @return {[type]}                 [description]
   */
  if (validateLogin()) {
    $('#login-btn').addClass('able')
  } else {
    $('#login-btn').removeClass('able')
  }
  /**
   * 设置密码界面1 填写email
   * @param  {[type]} validateSetpasswd1() [description]
   * @return {[type]}                      [description]
   */
  if (validateSetpasswd1()) {
    $('#reset-pwd').addClass('able')
  } else {
    $('#reset-pwd').removeClass('able')
  }
  /**
   * 设置密码页面2
   * @param  {[type]} validateSetpasswd2() [description]
   * @return {[type]}                      [description]
   */
  if (validateSetpasswd2()) {
    $('#setNewPasswd').addClass('able')
  } else {
    $('#setNewPasswd').removeClass('able')
  }
  /**
   * 注册页面 注册按钮
   * @param  {[type]} validateRegister() [description]
   * @return {[type]}                    [description]
   */
  if (validateRegister()) {
    $('#register').addClass('able')
  } else {
    $('#register').removeClass('able')
  }
}).on('blur', (e) => {
  let $thisObj = $(e.target)
  let inputValue = $thisObj.val()
  let vtype = $thisObj.attr('vtype')
  switch (vtype) {
    case 'email':
      let ifValidEmail = Validator.checkEmail(inputValue)
      if (!ifValidEmail) {
        $thisObj.parent().addClass('error')
      } else {
        $thisObj.parent().removeClass('error')
      }
      break
    case 'password':
      let ifValidPwd = Validator.checkPassword(inputValue)
      if (!ifValidPwd) {
        $thisObj.parent().addClass('error')
      } else {
        console.log('延迟触发')
        setTimeout(function () {
          $thisObj.parent().removeClass('error')
        }, 500)
      }
      break
    case 'passwordreg':
      let ifValidPwdTwo = Validator.checkPasswordTwo(inputValue)
      if (!ifValidPwdTwo) {
        $thisObj.parent().addClass('error')
      } else {
        $thisObj.parent().removeClass('error')
      }
      break
    case 'passwordConfirm':
      let ifValidPwdConfirm = $newPasswd.val() === $confirmNewpasswd.val()
      if (!ifValidPwdConfirm) {
        $thisObj.parent().addClass('error')
      } else {
        $thisObj.parent().removeClass('error')
      }
      break
    default:
      console.log('input失去焦点没匹配到vtype')
  }
})
