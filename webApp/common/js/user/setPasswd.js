/**
 * @author monkeywang
 * Date: 17/4/13
 */
import userApi from './userApi'
let $ = window.$
let $loginAccount = $('.username')
let $captcha = $('.captcha')
let $newPasswd = $('#new-passwd')
let $resetPwdBtn = $('#reset-pwd')
let $setNewPasswd = $('#setNewPasswd')
let $showPwd = $('.show-pwd')
/**
 * 点击 重置密码
 */
$resetPwdBtn.on('click', (e) => {
  if (!$resetPwdBtn.hasClass('able')) {
    console.log('灰色重置密码发送邮件按钮点击')
    return
  }
  let loginAccount = $loginAccount.val()
  let captcha = $captcha.val()
  userApi.checkName(loginAccount, captcha).then(res => {
    console.log(res)
    if (res.data.code === 0) {
      console.log('邮箱存在成功!')
      localStorage.email = loginAccount
      /**
       * 发邮件
       * @type {String}
       */
      userApi.sendMail(loginAccount).then(res2 => {
        if (res.data.code === 0) {
          window.location.href = '/users/sendSuccess?shopId=' + window.shopId
        } else {
          console.log('发送邮件失败!')
          $('.validate-wrap').addClass('error')
          $('.login-head-tip').text(res2.data.message)
        }
      })
    } else {
      console.log('检测失败!')
      $('.validate-wrap').addClass('error')
      $('.login-head-tip').text(res.data.message)
    }
  })
})
/**
 * url 中取值
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getParams (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return unescape(r[2])
  }
  return null
}
/**
 * 设置新密码
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$setNewPasswd.on('click', (e) => {
  if (!$setNewPasswd.hasClass('able')) {
    console.log('灰色设置密码按钮点击')
    return
  }
  let loginAccount = getParams('loginAccount')
  let code = getParams('code')
  let newPasswd = $newPasswd.val()
  userApi.setNewPasswd(loginAccount, newPasswd, code).then(res => {
    if (res.data.code === 0) {
      window.location.href = '/users/resetSuccess?shopId=' + window.shopId
    } else {
      console.log('设置新密码失败!')
      $('.validate-wrap').addClass('error')
      $('.login-head-tip').text(res.data.message)
    }
  })
})
/**
 * 展现密码
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
$showPwd.on('click', (e) => {
  // $newPasswd.attr('type', 'text')
  if ($newPasswd.attr('type') === 'password') {
    $newPasswd.attr('type', 'text')
    $showPwd.html('Hide password')
  } else {
    $newPasswd.attr('type', 'password')
    $showPwd.html('Show password')
  }
})
