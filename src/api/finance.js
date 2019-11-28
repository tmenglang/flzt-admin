import request from '@/utils/request'
export function shareOrder(data) {
  return request({
    url: '/share/order',
    data
  })
}

export function shareList(data) {
    return request({
        url: '/share/list',
        data
    })
}

