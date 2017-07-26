import userApi from '../user/userApi'
// const shopId = userApi.getUrlParams('shopId')
const plat = window.plat
/**
 * facebook登录
 * @param  {[type]} 'click' [description]
 * @param  {[type]} (e      [description]
 * @return {[type]}         [description]
 */
let url = location.protocol + '//' + window.location.host + '/users/facebookBack/' // + shopId
userApi.facebookOuth(url).then(res => {
  if (res.data.code === 0) {
    if (plat === 1) {
      window.location.href = res.data.data
    }
  }
})
