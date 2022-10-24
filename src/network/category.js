import {request} from "@/network/request";

/**
 * 获取商城分类 goods商品列表全部数据
 *  -获取商城首分类 goods.data 商品数据
 */
export function getCategory() {
    return request({
        url:'/api/goods'
    })
}
//获取商城分类 goods商品排序数据
export function getCategoryGoods(order='sales',cid=0,page=1) {
    return request({
        url:'/api/goods?category_id='+cid+'&page='+page+'&'+ order+'=1'
    })
}