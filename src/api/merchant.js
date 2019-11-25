import request from '@/utils/request'
export function merchantList(data) {
  return request({
    url: '/company/list',
    data
  })
}

export function createMerchant(data) {
  return request({
    url: '/company/update',
    data
  })
}

export function updateMerchant(data) {
  return request({
    url: '/company/update',
    data
  })
}

export function shopList(data) {
  return request({
    url: '/shop/list',
    data
  })
}

export function shopUpdate(data) {
  return request({
    url: '/shop/update',
    data
  })
}