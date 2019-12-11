import { login, logout, userMenu } from '@/api/user'
import { getToken, setToken, removeToken, getUserName, getAvatar, getAccount, setRouter, getRouter, setFlash, removeFlash } from '@/utils/auth'
import { resetRouter } from '@/router'
// import router from '../../router'

const state = {
  token: getToken(),
  name: getUserName(),
  avatar: getAvatar(),
  account: getAccount(),
  rout: getRouter()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ACOUNT: (state, account) => {
    state.account = account
  },
  SET_ROUTER: (state, data) => {
    state.rout = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password, system } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password, system: system }).then(response => {
        let data = response.data;
        data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        commit('SET_TOKEN', data.api_token)
        commit('SET_NAME', data.user_name)
        commit('SET_ACOUNT', data.account)
        commit('SET_AVATAR', data.avatar)
        setToken(data)
        setFlash(1)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        removeFlash()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  menu({ commit }) {
    return new Promise((resolve, reject) => {
      userMenu({system: 1}).then(res => { //总后台
      // userMenu({system: 2}).then(res => { //商家后台
        // let routes = recursionRouter(res.data, changeRouter);
        // let newMenu = constantRoutes.concat(routes);
        commit('SET_ROUTER', JSON.stringify(res.data));
        setRouter(JSON.stringify(res.data));
        // router.options.routes = newMenu;
        // router.addRoutes(newMenu);
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      removeFlash()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

