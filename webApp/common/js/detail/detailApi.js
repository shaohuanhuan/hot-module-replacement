/**
 * @author shaohuan
 * Date: 17/4/7
 */
import {Utils} from '../serveice'

class Api extends Utils {
  constructor () {
    super()
    this.hostname = window.apiHost
  }
  getDetail (params) {
    return this.get('/buyer/product/detail', params)
  }
  getDownload (params) {
    return this.get('/buyer/content/file/list', params)
  }
  submitSupplier (params) {
    return this.post('/buyer/msg/product/add', params)
  }
  addCart (params) {
    return this.post('/buyer/cart/addproduct', params)
  }
}

export default new Api()
