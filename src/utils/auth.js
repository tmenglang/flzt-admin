import Cookies from 'js-cookie'

const TokenKey = 'x-token'
const UserName = 'username'
const Avatar = 'avatar'
const Account = 'account'
const UserMenu = 'usermenu'
const Flash = 'flash_state'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(data) {
  return (() => {
    Cookies.set(TokenKey, data.api_token)
    Cookies.set(UserName, data.user_name)
    Cookies.set(Avatar, data.avatar)
    Cookies.set(Account, data.account)
  })()
}

export function setRouter(data) {
  return localStorage.setItem(UserMenu, data);
}

export function removeToken() {
  return (() => {
    Cookies.remove(TokenKey)
    Cookies.remove(UserName)
    Cookies.remove(Avatar)
    Cookies.remove(Account)
    localStorage.setItem(UserMenu, '')
  })()
}

export function getUserName() {
  return Cookies.get(UserName)
}

export function getAvatar() {
  return Cookies.get(Avatar)
}

export function getAccount() {
  return Cookies.get(Account)
}

export function getRouter() {
  return localStorage.getItem(UserMenu)
}

export function setFlash(s) {
  return localStorage.setItem(Flash, s)
}
export function removeFlash() {
  return localStorage.removeItem(Flash)
}
export function getFlash() {
  return localStorage.getItem(Flash)
}
