/**
 * @author monkeywang
 * Date: 17/4/7
 */
import {Utils} from './serveice'

class HomeApi extends Utils {
  getProductList (parmas) {
    return this.get('/buyer/product/poision/list', parmas)
  }
  // porducts页面所需商品列表/搜索页面
  getProductNum (parmas) {
    return this.get('/buyer/product/list', parmas)
  }
  getAdvert (parmas) {
    return this.get('/buyer/shop/guide/show', parmas)
  }
  getCompanyDetail (parmas) {
    return this.get('/buyer/aboutus/contact/detail', parmas)
  }
  getGroup (parmas) {
    return this.get('/buyer/product/group/listall', parmas)
  }

  getProfile (params) {
    return this.get('/buyer/shop/company/find', params)
  }

  getUserInfo (params) {
    return this.get('/buyer/person/account/info', params)
  }

  getAboutus (parmas) {
    return this.get('/buyer/aboutus/contact/detail', parmas)
  }
}

export default new HomeApi()
