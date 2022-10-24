import {request} from '@/network/request';


// 添加购物车 返回值201数据添加成功 204数据已经存在 数量增加
export function addCart(data) {
    return request({
        url: '/api/carts',
        method: 'post',
        data
    })
}

// 修改购物车， data = {num:1}
export function modifyCart(id, data) {
    return request({
        url: `/api/carts/${id}`,
        method: 'put',
        data
    })
}

//  获取购物车列表
export function getCart(data='') {
    return request({
        // api/carts?include=goods
        url: '/api/carts?'+data,
    })
}

//  选择商品的状态 checked,  所有选中的ID
export function checkedCart(data) {
    return request({
        url: '/api/carts/checked',
        method: 'patch',
        data
    })
}

//  删除购物车
export function deleteCartItem(id) {
    return request({
        url: `/api/carts/${id}`,
        method: 'delete'
    })
}