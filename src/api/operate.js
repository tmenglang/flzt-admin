import request from '@/utils/request'

export function stocksList(data) {
  return request({
    url: '/stocks/list',
    data
  })
}

export function stocksDetails(data) {
  return request({
    url: '/stocks/details',
    data
  })
}

export function manageDetails(data) {
  return request({
    url: '/manage/details',
    data
  })
}

export function manageList(data) {
  return request({
    url: '/manage/list',
    data
  })
}