import request from '@/utils/request'
export function deviceList(data) {
  return request({
    url: '/device/list',
    data
  })
}

export function deviceSelect(data) {
    return request({
        url: '/device/select',
        data
    })
}


export function createDevice(data) {
  return request({
    url: '/device/update',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/device/update',
    data
  })
}

export function fileQrcode(data) {
  return request({
    url: '/file/qrcode',
    data
  })
}

//设备日志
export function deviceLog(data) {
  return request({
    url: '/device/log',
    data
  })
}
//设备设置更新
export function deviceConf(data) {
  return request({
    url: '/device/conf',
    data
  })
}
//货柜配置新增下发
export function deviceAddconf(data) {
  return request({
    url: '/device/addconf',
    data
  })
}
//设备状态
export function deviceState(data) {
  return request({
    url: '/device/state',
    data
  })
}
//设备故障记录
export function deviceError(data) {
  return request({
    url: '/device/error',
    data
  })
}
//设备控制 
export function deviceOperate(data) {
  return request({
    url: '/device/operate',
    data
  })
}