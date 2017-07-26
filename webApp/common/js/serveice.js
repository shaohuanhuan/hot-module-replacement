/**
 * @author monkeywang
 * Date: 17/3/27
 */
import promise from 'es6-promise'
import axios from 'axios'
import qs from 'qs'

promise.polyfill()
const plat = window.plat
export class Utils {
  constructor () {
    this.hostname = window.apiHost
    if (plat !== 1 && this.getCookie('fb') === '1') {
      this.deleteCookie('fb')
    }
  }
  /**
   * get请求方法
   * @param url
   * @param params
   * @returns {Promise}
   */
  get (url, params) {
    if (plat === 3 || plat === 2) {
      params.previewTag = 1
    } else {
      params.previewTag = 0
    }
    if (!params.shopId) {
      params.shopId = this.getCookie('shopId')
    }
    return new Promise((resolve, reject) => {
      axios.get(this.hostname + url, {
        params: params,
        withCredentials: true
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        resolve(error)
      })
    })
  }

  /**
   * post请求方法
   * @param url
   * @param params
   * @returns {Promise}
   */
  post (url, params) {
    if (plat === 3 || plat === 2) {
      params.previewTag = 1
    } else {
      params.previewTag = 0
    }
    if (!params.shopId) {
      params.shopId = this.getCookie('shopId')
    }

    return new Promise((resolve, reject) => {
      axios.post(this.hostname + url, qs.stringify(params), {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        resolve(error)
      })
    })
  }

  /**
   * 获取url参数
   * @param name
   * @returns {null}
   */
  getUrlParams (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (name === 'shopId' && r == null) {
      return this.getCookie('shopId')
    }
    if (r != null) return unescape(r[2])
    return null
  }

  /**
   * 获取滚动条当前的位置
   * @returns {number}
   */
  getScrollTop () {
    let scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  }

  /**
   * 获取当前可视范围的高度
   * @returns {number}
   */
  getClientHeight () {
    let clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
    } else {
      clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    }
    return clientHeight
  }

  /**
   * 获取文档完整的高度
   * @returns {number}
   */
  getScrollHeight () {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  }
  /**
   * 分转元保留2位小数
   */
  toFl (num) {
    return (num / 100).toFixed(2)
  }

  /*
   * author hideyoshi
   * 时间转换函数
   * */
  format (time, format) {
    let createTime = new Date(time)
    let timeFunc = function (i) {
      return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (e) {
      switch (e) {
        case 'yyyy':
          return timeFunc(createTime.getFullYear())
        case 'MM':
          return timeFunc(createTime.getMonth() + 1)
        case 'mm':
          return timeFunc(createTime.getMinutes())
        case 'dd':
          return timeFunc(createTime.getDate())
        case 'HH':
          return timeFunc(createTime.getHours())
        case 'ss':
          return timeFunc(createTime.getSeconds())
      }
    })
  }
  /*
   * author shaohuan
   * 提示框
   * text ：弹出文字
   * type ：success warning info
   * */
  alert (text, alerttype) {
    let type = ''
    alerttype ? type = alerttype : type = 'success'
    let html = `<div class="alert alert-${type} fade in"><i class="glyphicon-tip${type}"></i>${text}</div>`
    let div = document.createElement('div')
    div.innerHTML = html
    document.body.appendChild(div)
    setTimeout(function () {
      let alert = document.getElementsByClassName('alert')[0]
      alert = alert.parentNode
      alert.parentNode.removeChild(alert)
    }, 2000)
  }

  getCookie (name) {
    var strCookie = document.cookie
    var arrCookie = strCookie.split('; ')
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split('=')
      if (arr[0] === name) return arr[1]
    }
    return ''
  }

  addCookie (name, value, expiresHours) {
    var cookieString = name + '=' + escape(value)
    // 判断是否设置过期时间
    if (expiresHours > 0) {
      var date = new Date()
      date.setTime(date.getTime + expiresHours * 3600 * 1000)
      cookieString = cookieString + '; expires=' + date.toGMTString()
    }
    document.cookie = cookieString
  }

  deleteCookie (name) {
    var date = new Date()
    date.setTime(date.getTime() - 10000)
    document.cookie = name + '=v; expires=' + date.toGMTString()
  }
}

export default new Utils()
