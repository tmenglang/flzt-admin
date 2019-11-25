import request from '@/utils/request'

/**
 * 商品页面查询字典
 * 
 */
export function skuSelect(data) {
    return request({
      url: '/sku/select',
      data
    })
}

/**
 * sku列表查询
 * page_size	否	int	分页大小，不传默认为30
page_index	否	int	第几页
order_by	否	string	排序字段
order_type	否	string	desc 或者asc
search	否	string	例如：{“device_type”:1,”sku_type”:1,”id”:1}
可检索字段：
name，id，bar_code，sku_type，device_type
 */
export function skuList(data) {
    return request({
      url: '/sku/list',
      data
    })
}

/**
 * sku更新和新增接口
 * id	是	int	主键id，为列表接口返回的值
name	否	string	名字
pic1	否	string	商品图片1
pic2	否	string	商品图片2
sku_type	否	int	sku类型，具体值参考为select接口返回的字典
bar_code	否	string	sku二维码
label	否	string	训练标签
device_type	否	int	适用的设备类型，具体值参考为select接口返回的字
 */
export function skuUpdate(data) {
    return request({
      url: '/sku/update',
      data
    })
}

/**
 * 商品查询列表
 * page_size	否	int	分页大小，不传默认为30
page_index	否	int	第几页
order_by	否	string	排序字段
order_type	否	string	desc 或者asc
search	否	string	例如：{“sku_id”:1,”company_id”:1,”id”:1}
可检索字段：
id,sku_id, company_id,goods_name,shop_id
 */
export function goodsList(data) {
  return request({
    url: '/goods/list',
    data
  })
}

export function goodsUpdate(data) {
  return request({
    url: '/goods/update',
    data
  })
}

export function skutypeList(data) {
  return request({
    url: '/skutype/list',
    data
  })
}

export function skutypeUpdate(data) {
  return request({
    url: '/skutype/update',
    data
  })
}