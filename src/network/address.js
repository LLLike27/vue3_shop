import {request} from '@/network/request';

// 添加地址
export function addAddress(params) {
    return request({
        url:'/api/address',
        method: 'post',
        params
    })
}

// 编辑地址
export function editAddress(id, params) {
    return request({
        url:`/api/address/${id}`,
        method: 'put',
        params
    })
}

// 删除地址
export function deleteAddress(id) {
    return request({
        url:`/api/address/${id}`,
        method: 'delete'
    })
}

// 地址列表
export function getAddressList() {
    return request({
        url:'/api/address'
    })
}

// 地址详情
export function getAddressDetail(id) {
    return request({
        url:`/api/address/${id}`,
    })
}