import {request} from "@/network/request";


//获取商品详情
export function getDetail(id) {
    return request({
        url:'/api/goods/'+id,
    })
}