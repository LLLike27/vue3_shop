import {request} from "@/network/request";

/**
 * 获取商城首页全部数据
 *  -获取商城首页slides 轮播图数据
 *  -获取商城首页categories 分类数据
 */
export function getHomeAllData() {
    return request({
        url:'/api/index',
    })
}

//获取商城首页goods 推荐商品数据 'sales', 'new', 'recommend'
export function getHomeGoodsData(type='sales',page=1) {
    return request({
        url:`/api/index?${type}=1&page=${page}`,
    })
}
