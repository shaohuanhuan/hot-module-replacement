/**
 * @author monkeywang
 * Date: 17/4/7
 */
import {Utils} from '../serveice'

class ProfileApi extends Utils {
  /*
   * About Us
   * */
  getAboutUs (params) {
    return this.get('/buyer/aboutus/desc/detail', params)
  }

  /*
  * Company Profile
  * */
  getProfile (params) {
    return this.get('/buyer/shop/company/find', params)
  }
  /*
   * pay listall
   * */
  getPayList (params) {
    return this.get('/bshop/config/pay/listall', params)
  }
  /*
   * business Info
   * */
  getBusinessInfo (params) {
    return this.get('/buyer/shop/company/business/find', params)
  }
  /*
   * Company Cert List
   * */
  getCertList (params) {
    return this.get('/buyer/shop/company/cert/list', params)
  }

  /*
   * Download List
   * */
  getDownload (params) {
    return this.get('/buyer/content/file/list', params)
  }
}

export default new ProfileApi()
