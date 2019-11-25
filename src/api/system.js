import request from '@/utils/request'
/**
 * 菜单新增修改接口
 * id	是	int	主键id，为列表接口返回的值
name	否	string	名字
url	否	int	菜单url
sequ	否	int	菜单顺序
state	否	int	状态，0:无效，1：有效
parent_id	否	int	一级菜单为0
icon	否	string	菜单图标
 */
export function menuUpdate(data) {
    return request({
      url: '/menu/update',
      data
    })
}

/**
 * 用户列表查询
 * page_size	否	int	分页大小，不传默认为30
page_index	否	int	第几页
order_by	否	string	排序字段
order_type	否	string	desc 或者asc
search	否	string	例如：{“name”:”xxxx”}
 */
export function menuList(data) {
    return request({
      url: '/menu/list',
      data
    })
}

/**
 * 用户列表查询
 * page_size	否	int	分页大小，不传默认为30
page_index	否	int	第几页
order_by	否	string	排序字段
order_type	否	string	desc 或者asc
search	否	string	例如：{“account”:”xxx”}
 */
export function userList(data) {
    return request({
      url: '/user/list',
      data
    })
}

/**
 * 角色新增和修改接口
 * id	是	int	主键id，为列表接口返回的值
    role_name	否	string	角色名字
    state	否	int	角色状态，设置为无效
    description	否	string	描述
 */
export function roleUpdate(data) {
  return request({
    url: '/role/update',
    data
  })
}
/**
 * 角色列表接口
 * page_size	否	int	分页大小，不传默认为30
    page_index	否	int	第几页
    order_by	否	string	排序字段
    order_type	否	string	desc 或者asc
    search	否	string	例如：{“role_name”:”xxx”}
 */
export function roleList(data) {
    return request({
        url: '/role/list',
        data
    })
}

/**
 * 角色菜单更新
 * role_id	是	int	角色id
menu_ids	否	string	选择的菜单，用逗号分隔，例如：1,2,3,4,5,6
 */

export function roleMenuUpdate(data) {
  return request({
    url: '/role/menuupdate',
    data
  })
}

/**
 * 用户菜单列表
 * id	是	int	主键id，为列表接口返回的值
account	否	string	账户名字，用于登陆
user_name	否	string	用户显示的名字
phone	否	string	电话
company_id	否	int	商户公司id
password	否	string	密码
state	否	int	状态，1有效，2无效
type	否	int	用户类型，0超级管理，1商家管理员，2商家职员 
 */

export function userUpdate(data) {
  return request({
    url: '/user/update',
    data
  })
}

/**
 * 角色菜单权限接口
 * role_id	是	int	角色id
 */

export function roleMenu(data) {
    return request({
      url: '/role/menu',
      data
    })
  }