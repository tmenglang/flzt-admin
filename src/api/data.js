import request from '@/utils/request'
export function saleGoods(data) {
  return request({
    url: '/sale/goods',
    data
  })
}

export function saleDevice(data) {
    return request({
        url: '/sale/device',
        data
    })
}


export function saleCompany(data) {
  return request({
    url: '/sale/company',
    data
  })
}
