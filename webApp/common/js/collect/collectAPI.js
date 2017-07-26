/**
 * Created by admin on 2017/5/12.
 */
import {Utils} from '../serveice'

class CollectAPI extends Utils {
  getCollect (params) {
    return this.get('/bshop/datareport/visit/collect', params)
  }
}

export default new CollectAPI()
