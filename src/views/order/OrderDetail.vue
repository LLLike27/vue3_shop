<template>
    <div class="order-detail-box">
        <nav-bar>
            <template #default>定单详情{{id}}</template>
        </nav-bar>
        <div class="order-status">
            <div class="status-item">
                <label>订单状态：</label>
                <span>{{statusString}}</span>
            </div>
            <div class="status-item">
                <label>订单编号：</label>
                <span>{{datail.order_no}}</span>
            </div>
            <div class="status-item">
                <label>下单时间：</label>
                <span>{{datail.created_at}}</span>
            </div>
            <van-button v-if="true" type="primary" style="margin-bottom: 10px" color="#ff6a00" @click="showPayFn" block>去支付</van-button>
            <van-button v-if="false" type="primary" style="margin-bottom: 10px" color="#ff6a00" @click="handleConfirmOrder" block>确认订单</van-button>
        </div>

        <div class="order-price">
            <div class="price-item">
                <label>商品金额：</label>
                <span>{{total}}</span>
            </div>
            <div class="price-item">
                <label>配送方式：</label>
                <span>普通快递</span>
            </div>
        </div>
        <van-card
                v-for="item in datail.orderDetails.data " :key="datail.id"
                :num="item.num"
                :thumb="item.goods.cover_url"
        >
            <template #title>
                <div class="title">{{item.goods.title}}</div>
            </template>
            <template #price>
                <div class="price"><small>￥</small>{{item.price+'.00'}}</div>
            </template>
            <template #desc>
                <div class="desc">全场包邮</div>
            </template>
        </van-card>
        <div style="width:100%;height:50px;">
        </div>
        <van-popup
                closeable
                :close-on-click-overlay="false"
                v-model:show="showPay"
                position="bottom"
                :style="{ height: '30%',display:'flex'}"
        >
            <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0',}">
                <van-button :style="{ marginBottom: '10px' }" color="#1989fa" @click="payAliyunShow" block>支付宝支付</van-button>
                <van-button color="#4fc08d" @click="payAliyunShow" block>微信支付</van-button>
            </div>

            <van-overlay :show="payShow" @click="payShow = false">
                <div class="wrapper">
                    <div class="block">
                        <img v-lazy="aliyun" alt="">
                    </div>
                </div>
            </van-overlay>
        </van-popup>
    </div>
</template>

<script>
    import {useRoute,useRouter} from 'vue-router'
    import {ref,toRefs,reactive,onMounted,computed} from 'vue'
    import {payOrder,getOrderDetail,confirmOrder,payOrderStatus,viewExpress} from "@/network/order";
    import {Toast,Dialog} from 'vant'
    import 'vant/es/toast/style';
    import 'vant/es/dialog/style';
    export default {
        name: "OrderDetail",
        setup(){

            const route =useRoute()
            const state=reactive({
                showPay:false,
                payShow:false,
                aliyun:'',
                orderNo:'',//订单id
                datail:{
                    orderDetails:{
                        data:[]
                    },
                    status:0
                }
            })
            const showPayFn=()=>{
                state.showPay=true
            }
            const payAliyunShow=()=>{
                state.payShow=true;
                payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
                    state.aliyun = res.data.qr_code_url;

                    // 轮询查看
                    const timer = setInterval(()=>{
                        payOrderStatus(state.orderNo).then(res=>{
                            // console.log('===',res)
                            if(res=='2') {
                                clearInterval(timer);
                                router.push({path:'/orderdetail', query:{id:state.orderNo}})
                            }
                        })
                    }, 2000)

                })

            }
            onMounted(()=>{
                Toast.loading({message:'加载中',forbidClick:true});
                init();
                Toast.clear();
            })
            const init=()=>{
                const {id} =route.query;
                state.orderNo=id;
                getOrderDetail(id).then(res=>{
                    // console.log(res)
                    state.datail=res.data;
                })
            }
            const statusString =computed(()=>{
                // 1下单 2支付 3发货 4收货 5过期
                let status = ['', '已下单', '已支付', '等待发货', '确认收货', '已过期'];
                return status[state.datail.status]
            })
            const total=computed(()=>{
                let sum=0;
                state.datail.orderDetails.data.forEach(item=>{
                    sum += item.num * item.price;
                })
                return sum
            })
            return {
                ...toRefs(state),
                route,
                showPayFn,
                payAliyunShow,
                statusString,
                total
            }
        }
    }
</script>

<style scoped lang="scss">
.order-detail-box{
    text-align: left;
    background:#f7f7f7;
    .order-status{
        background: #fff;
        margin-top: 44px;
        padding: 20px;
        font-size: 15px;
        .status-item{
            margin-bottom: 10px;
            label{
                color: #999;
            }
            span{

            }
        }
    }

    .order-price{
        background: #fff;
        margin: 20px 0;
        padding: 20px;
        font-size: 15px;
        .price-item{
            margin-bottom: 10px;
            label{
                color: #999;
            }
            span{

            }
        }
    }
    .van-card {
        margin-top: 0;
    }
    .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
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

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .block {
        width: 200px;
        height: 200px;
        background-color: #fff;
    }
}
</style>