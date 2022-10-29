<template>
    <div class="order-box">
        <nav-bar>
            <template v-slot:default>定单列表</template>
        </nav-bar>
        <van-tabs ref="tabs" @click-tab="onChangeTabs" class="order-tabs">
            <van-tab title="全部"></van-tab>
            <van-tab title="待付款"></van-tab>
            <van-tab title="已支付"></van-tab>
            <van-tab title="发货"></van-tab>
            <van-tab title="交易完成"></van-tab>
            <van-tab title="过期"></van-tab>
        </van-tabs>
        <div class="orede-content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
                <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                        @offset="10"
                >
                  <div @click="goToDetail(item.id)" class="order-item-box" v-for="(item,index) in list" :key="index">
                      <div class="order-item-header">
                          <span style="line-height:30px;">订单号：{{item.order_no}}<br>创建时间：{{item.created_at}}</span>
                      </div>
                      <van-card
                              v-for="sub in item.orderDetails.data"
                          :num="sub.num"
                          :thumb="sub.goods.cover_url"
                      >
                          <template #title>
                              <div class="title">{{sub.goods.title}}</div>
                          </template>
                          <template #price>
                              <div class="price"><small>￥</small>{{sub.goods.price+'.00'}}</div>
                          </template>
                          <template #desc>
                              <div class="desc">全场包邮</div>
                          </template>
                      </van-card>
                  </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
    import { ref,onMounted,reactive,toRefs } from 'vue';
    import {getOrderList} from "@/network/order";
    import {useRouter} from 'vue-router'

    export default {
        name: "Order",
        setup() {
            const tabs =ref(null)
            const router=useRouter()
            const state=reactive({
                loading:false,
                refreshing:false,
                finished:false,
                list:[],
                page:1,
                totalPage:0,
                status:0,
            })

            onMounted(()=>{
                onRefresh(); //初始化
            })
            //切换tabs
            const onChangeTabs =(e)=>{
                // console.log(e)
                state.status = e.name;
                onRefresh();
            }
            //页面加载中 状态进行切换
            const onRefresh = () => {
                //顶部refreshing是否处于加载状态，加载过程中不触发load事件
                state.refreshing = true;
                // 清空列表数据 没有更多了
                state.finished = false
                //重新加载数据
                //设置底部loading的加载状态
                state.loading=true;
                state.page=1;

                onLoad();
            }
            //页面刷新或加载中 状态进行切换 页增加
            const onLoad = ()=>{
                //满足条件 顶部refreshing未加载 页码小于尾页 页码才会会增加
                if (!state.refreshing && state.page< state.totalPage)
                {
                    state.page=state.page+1;
                }
                //顶部refreshing加载中 列表清空 并 取消加载后 请求数据后 渲染数据
                if (state.refreshing)
                {
                    state.list=[];
                    state.refreshing=false;
                }
                ListData();
            }

            //请求数据
            const ListData = ()=>{
                getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res=>{
                    // console.log(res)
                    state.list =state.list.concat(res.data.data);
                    state.loading = false;
                    state.totalPage=res.data.meta.pagination.total_pages;
                    if (state.page >=state.totalPage){
                        state.finished = true;//页没有数据
                    }
                })
            }

            //到订单详情页
            const goToDetail = (id)=>{
                router.push({path:'/orderdetail',query:{id}})
            }
            return {
                ...toRefs(state),
                tabs,
                onChangeTabs,
                onLoad,
                onRefresh,
                goToDetail

            };
        }
    }
</script>

<style scoped lang="scss">
    .order-box {
        text-align: left;
        .order-header {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10000;
            width:100%;
            height:44px;
            line-height: 44px;
            padding: 0 10px;
            color: #252525;
            background: #fff;
            border-bottom: 1px solid #dcdcdc;
            .order-name {
                font-size: 14px;
            }
        }
        .order-tabs {
            margin-top: 44px;
            position: fixed;
            left: 0;
            z-index: 1000;
            width: 100%;
            border-bottom: 1px solid #e9e9e9;
        }

        .orede-content {
            height:100vh;
            overflow: hidden;
            overflow-y: scroll;
            padding-top: 100px;
        }
        .order-list-refresh {
            .van-card__content {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .van-pull-refresh__head {
                background: #f9f9f9;
            }

            .order-item-box {
                margin: 20px 10px;
                background-color: #FAFAFA;
                .order-item-header {
                    padding: 10px 20px 0 20px;
                    display: flex;
                    justify-content: space-between;
                }
                .van-card {
                    background-color: #FFFFFF;
                    border-radius: 3px;
                    margin-top: 10px;
                }
            }
        }

        .title {
            font-size:14px;
            font-weight: bold;
        }
        .desc {
            margin:10px 0;
        }
        .price {
            font-size:16px;
            color:#ff6a00;
        }
    }
</style>