import {request} from "@/network/request";

/**
 * 我的收藏
 */
export function myCollects(page=1) {
    return request({
        url:`/api/collects?page=${page}`,
    })
}
//收藏和取消
export function setCollect(id) {
    return request({
        url:'/api/collects/goods/'+id,
        method:'post'
    })
}