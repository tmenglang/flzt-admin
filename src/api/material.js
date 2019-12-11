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

export function adMaterial(data) {
  return request({
    url: '/ad/material',
    data
  })
}

export function adDetails(data) {
  return request({
    url: '/ad/details',
    data
  })
}

export function dictInfo(data) {
  return request({
    url: '/dict/info',
    data
  })
}
