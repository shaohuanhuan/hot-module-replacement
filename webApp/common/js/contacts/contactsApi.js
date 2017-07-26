/**
 * Created by admin on 2017/4/21.
 */
import {Utils} from '../serveice'

class contactsApi extends Utils {
  sendInfo (params) {
    return this.post('/buyer/msg/product/add', params)
  }
}

export default new contactsApi()