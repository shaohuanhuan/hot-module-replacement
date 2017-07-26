/**
 * @author monkeywang
 * Date: 17/4/13
 */
import {Utils} from '../serveice'
let RSAUtils = window.RSAUtils
class UserApi extends Utils {
  constructor () {
    super()
    this.hostname = window.apiHost
    this.modules = ''
    this.exponent = ''
    this.rediskey = ''
  }

  /**
   * 获取 UserKey
   * @returns {Promise.<TResult>}
   * @private
   */
  getUserKey () {
    return this.get('/buyer/login/key/get', {}).then(res => {
      this.modules = res.data.data.modulus
      this.exponent = res.data.data.exponent
      this.rediskey = res.data.data.rediskey
    })
  }

  /**
   * 封装一个加密方法
   * @param context 明文
   * @private
   */
  _encryptRSA (context) {
    let key = RSAUtils.getKeyPair(this.exponent, '', this.modules)
    return RSAUtils.encryptedString(key, context)
  }

  /**
   * 用户登录方法
   * @param username
   * @param pwd
   * @param captcha
   * @returns {Promise}
   */
  login (username, pwd, captcha) {
    return this.post('/buyer/login', {
      loginAccount: username,
      password: this._encryptRSA(pwd),
      rediskey: this.rediskey
    })
  }
  /**
   * facebook授权
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  facebookOuth (url) {
    return this.post('/buyer/fblogin/outh/binding', {
      callbackHtml: url
    })
  }
  /**
   * 重置密码第一步 ，检测邮箱
   * @param  {[type]} username [description]
   * @param  {[type]} captcha  [description]
   * @return {[type]}          [description]
   */
  checkName (username, captcha) {
    return this.post('/buyer/forget/account/check', {
      loginAccount: username,
      captcha: captcha
    })
  }
  /**
   * 设置新密码
   * @param {[type]} username [description]
   * @param {[type]} captcha  [description]
   */
  setNewPasswd (username, password, code) {
    return this.post('/buyer/forget/password/new', {
      loginAccount: username,
      password: password,
      code: code
    })
  }
  /**
   * 发邮件
   * @param  {[type]} username [description]
   * @param  {[type]} password [description]
   * @param  {[type]} code     [description]
   * @return {[type]}          [description]
   */
  sendMail (username) {
    return this.post('/buyer/email/send', {
      email: username,
      type: 2
    })
  }

  /**
   * 注册
   * @param  {[type]} username [description]
   * @param  {[type]} pwd      [description]
   * @param  {[type]} captcha  [description]
   * @return {[type]}          [description]
   */
  register (username, pwd, captcha) {
    return this.post('/buyer/register/confirm', {
      loginAccount: username,
      password: pwd,
      regSource: 0,
      captcha: captcha
    })
  }
}
export default new UserApi()
