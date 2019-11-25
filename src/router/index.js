import Vue from 'vue'
import Router from 'vue-router'
const localMenu = localStorage.getItem('usermenu')
const hasMenu = localMenu ? true : false;
Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    show: true,
    name: 'dashboard',
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      show: true,
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  }
]
export const changeRouter = [
  {
    path: '/merchant',
    component: Layout,
    show: false,
    redirect: '/merchant/index',
    name: 'merchant',
    meta: { title: '商家管理', icon: 'nested' },
    children: [
      {
        path: 'index',
        flat: '/merchant/index',
        show: false,
        component: () => import('@/views/merchant/index'),
        name: 'merchant',
        meta: { title: '商家管理', affix: false }
      }
      // {
      //   path: 'shop',
      //   component: () => import('@/views/merchant/shop'),
      //   name: 'shop',
      //   meta: { title: '门店管理', affix: false }
      // }
    ]
  },

  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    name: 'device',
    show: false,
    meta: { title: '设备管理', icon: 'table' },
    children: [
      {
        path: 'index',
        flat: '/device/index',
        show: false,
        component: () => import('@/views/device/index'),
        name: 'device',
        meta: { title: '货柜管理', affix: false }
      },
      {
        path: 'state',
        flat: '/device/state',
        show: false,
        component: () => import('@/views/device/state'),
        name: 'state',
        meta: { title: '货柜状态', affix: false }
      },
      {
        path: 'configure',
        flat: '/device/configure',
        show: false,
        component: () => import('@/views/device/configure'),
        name: 'configure',
        meta: { title: '配置更新', affix: false }
      },
      {
        path: 'log',
        flat: '/device/log',
        show: false,
        component: () => import('@/views/device/log'),
        name: 'log',
        meta: { title: '货柜日志', affix: false }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/goods',
    name: 'goods',
    show: false,
    meta: { title: '商品管理', icon: 'form' },
    children: [
      {
        path: 'goods',
        flat: '/goods/goods',
        show: false,
        component: () => import('@/views/goods/goods'),
        name: 'goods',
        meta: { title: '商品管理',  affix: false }
      },
      {
        path: 'sku',
        flat: '/goods/sku',
        show: false,
        component: () => import('@/views/goods/sku'),
        name: 'sku',
        meta: { title: '总商品库',  affix: false }
      },
      {
        path: 'skutype',
        flat: '/goods/skutype',
        show: false,
        component: () => import('@/views/goods/skutype'),
        name: 'skutype',
        meta: { title: '分类管理',  affix: false }
      },
    ]
  },

  {
    path: '/operate',
    component: Layout,
    show: false,
    redirect: '/operate/operate',
    name: 'operate',
    meta: { title: '商品运营', icon: 'link' },
    children: [
      {
        path: 'operate',
        flat: '/operate/operate',
        show: false,
        component: () => import('@/views/operate/operate'),
        name: 'operate',
        meta: { title: '库存查询',  affix: false }
      },
      {
        path: 'settle',
        flat: '/operate/settle',
        show: false,
        component: () => import('@/views/operate/settle'),
        name: 'settle',
        meta: { title: '理货记录',  affix: false }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/order',
    name: 'order',
    show: false,
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'order',
        flat: '/order/order',
        show: false,
        component: () => import('@/views/order/order'),
        name: 'order',
        meta: { title: '订单管理',  affix: false }
      },
      {
        path: 'reject',
        flat: '/order/reject',
        show: false,
        component: () => import('@/views/order/reject'),
        name: 'reject',
        meta: { title: '退款管理',  affix: false }
      },
      {
        path: 'error',
        flat: '/order/error',
        show: false,
        component: () => import('@/views/order/error'),
        name: 'error',
        meta: { title: '异常订单',  affix: false }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    show: false,
    redirect: '/system/account',
    name: 'system',
    meta: { title: '权限管理', icon: 'user' },
    children: [
      {
        path: 'account',
        flat: '/system/account',
        show: false,
        component: () => import('@/views/system/account'),
        name: 'account',
        meta: { title: '账号管理',  affix: false }
      },
      {
        path: 'role',
        flat: '/system/role',
        show: false,
        component: () => import('@/views/system/role'),
        name: 'role',
        meta: { title: '角色管理',  affix: false }
      }
    ]
  }
]
export function recursionRouter(userRouter = [], allRouter = []) {
  var realRoutes = []
  allRouter.forEach(v => {
    userRouter.forEach(k => {
      if (k.parent_menu === v.meta.title) {
        let r = Object.assign({}, v);
        r.show = true;
        r.children = [];
        v.children.forEach(l => {
          k.child_menu.forEach(m => {
            if (l.flat === m.url) {
              let c = Object.assign({}, l);
              c.show = true;
              r.children.push(c);
            }
          })
        });
        realRoutes.push(r)
      }
    })
  })
  realRoutes.push({ path: '*', redirect: '/404', hidden: true })
  return realRoutes
}

function showAllMenu(allRouter = []) {
  var realRoutes = []
  allRouter.forEach(v => {
    v.show = true;
    if (v.children) {
      v.children.forEach(k => {
        k.show = true;
      })
    }
    realRoutes.push(v);
  })
  realRoutes.push({ path: '*', redirect: '/404', hidden: true })
  return realRoutes
}
// 权限控制项，正式情况下放开
// let addRouters = hasMenu ? recursionRouter(JSON.parse(localMenu), changeRouter) : [];
// 自测用
let addRouters = showAllMenu(changeRouter);
console.log(constantRoutes.concat(changeRouter));
const createRouter = (h) => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 权限控制项，正式情况下放开
  // routes: h ? constantRoutes.concat(addRouters) : constantRoutes
  // 自己测试用
  routes: constantRoutes.concat(addRouters)
})

const router = createRouter(hasMenu)

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
