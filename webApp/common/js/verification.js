/**
 * @author monkeywang
 * Date: 17/4/13
 */
class Verification {
  /**
   * 用户名验证 数字、字母、中文 、划线不能以下划线开头 2-12位
   * @param value
   * @returns {boolean}
   */
  checkName (value) {
    let filter = /^(?!_)[A-Za-z0-9_\s\u4e00-\u9fa5_:！]{2,12}$/
    if (filter.test(value)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 手机号验证 13(0-9)、145、147、15(0-235-9)、170、177、18(0-9)开头 11位
   * @param value
   * @returns {boolean}
   */
  checkPhone (value) {
    let filter = /^(13[0-9]|145|147|15[0-235-9]|170|176|177|18[0-9])[0-9]{8}$/
    if (filter.test(value)) return true
    else {
      return false
    }
  }

  /**
   * 邮箱验证
   * @param value
   * @returns {boolean}
   */
  checkEmail (value) {
    let filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (filter.test(value)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 密码验证 必须同时含有数字和字母，特殊字符可有可无
   * @param value
   * @returns {boolean}
   */
  checkPassword (value) {
    // let filter = /^(?![0-9]+$)(?![a-zA-Z]+$)(?=.*[A-Za-z])(?=.*\d)[0-9A-Za-z#@!~%^&*]{6,20}$/
    let filter = /.{6,20}$/
    if (filter.test(value)) {
      return true
    } else {
      return false
    }
  }
  /**
   * 密码验证 必须同时含有数字和字母，特殊字符可有可无
   * @param value
   * @returns {boolean}
   */
  checkPasswordTwo (value) {
    let filter = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,20}$/
    if (filter.test(value)) {
      return true
    } else {
      return false
    }
  }
  /**
   * 验证码 4-10位英文或数字
   * @param value
   * @returns {boolean}
   */
  checkCode (value) {
    let filter = /[a-zA-Z0-9]{4,20}/
    if (filter.test(value)) {
      return true
    } else {
      return false
    }
  }
}
export default new Verification()
