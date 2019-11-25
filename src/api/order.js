import request from '@/utils/request'

export function orderList(data) {
    return request({
      url: '/order/list',
      data
    })
}

export function orderDetails(data) {
    return request({
      url: '/order/details',
      data
    })
}

export function rejectList(data) {
    return request({
      url: '/reject/list',
      data
    })
}

export function rejectDetails(data) {
  return request({
    url: '/reject/details',
    data
  })
}
export function rejectDeal(data) {
    return request({
        url: '/reject/deal',
        data
    })
}

export function abnormalDetails(data) {
    return request({
        url: '/abnormal/details',
        data
    })
}

export function abnormalList(data) {
    return request({
        url: '/abnormal/list',
        data
    })
}

export function abnormalDeal(data) {
    return request({
        url: '/abnormal/deal',
        data
    })
}