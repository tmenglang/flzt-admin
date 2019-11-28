import request from '@/utils/request'
export function materialList(data) {
  return request({
    url: '/material/list',
    data
  })
}

export function materialUpdate(data) {
    return request({
        url: '/material/update',
        data
    })
}


export function adList(data) {
  return request({
    url: '/ad/list',
    data
  })
}

export function adUpdate(data) {
  return request({
    url: '/ad/update',
    data
  })
}