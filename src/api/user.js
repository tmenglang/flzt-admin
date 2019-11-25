import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    data
  })
}

export function userMenu(data) {
  return request({
    url: '/user/menu',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
  })
}
