import request from '@/utils/request'

const api = {
  //一对一
  marketMarketToPageList: '/marketMarketTo/pageList',
}
export default api
//一对一
export function marketMarketToPageList (parameter) {
  return request({
    url: api.marketMarketToPageList,
    method: 'post',
    params: parameter
  })
}
