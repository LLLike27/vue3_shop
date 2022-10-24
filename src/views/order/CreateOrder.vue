<template>
    <div class="create-order">
        <nav-bar>
            <template v-slot:default>订单创建</template>
        </nav-bar>
        <div class="address-wrap" >
            <div class="name">
                <span>{{address.name}}</span>
                <span>{{address.phone}}</span>
            </div>
            <div class="address">
                {{address.province}} {{address.city}} {{address.county}} {{address.address}}
            </div>
            <van-icon class="arrow" @click="goToSetAddress" name="arrow" />
        </div>
        <div class="good">
            <div class="good-item" v-for="(item,index) in cartList" :key="index">
                <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                <div class="good-desc">
                    <div class="good-title">
                        <span>{{item.goods.title}}</span>
                    </div>
                    <div class="good-btn">
                        <div class="price"><small>¥</small> {{item.goods.price+'.00'}}</div>
                        <span>x{{item.num}}</span>
                    </div>
                </div>
            </div>
        </div>
        <van-submit-bar class="submit-all" :price="total * 100" button-text="提交订单" @submit="handleCreateOrder" > 商品金额
        </van-submit-bar>
        <van-popup
                closeable
                :close-on-click-overlay="false"
                v-model:show="showPay"
                position="bottom"
                :style="{ height: '30%',display:'flex'}"
                @close="close"
        >
            <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0',}">
                <van-button :style="{ marginBottom: '10px' }" color="#1989fa" @click="payAliyunShow" block>支付宝支付</van-button>
                <van-button color="#4fc08d" @click="payWachatShow" block>微信支付</van-button>
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
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import NavBar from "@/components/common/navbar/NavBar";
    import {getOrderPreview,createOrder,payOrder,payOrderStatus} from "@/network/order";
    import {ref,toRefs,onMounted,reactive,computed} from 'vue'
    import {Toast} from 'vant'
    import 'vant/es/toast/style';
    export default {
        name: "CreateOrder",
        components: {NavBar},
        setup(){
            const router = useRouter();
            const store = useStore();
            const state = reactive({
                cartList:[],
                address:{},
                showPay:false,
                payShow:false,
                orderNo:'',
                aliyun:'',
                wechat:''
            })
            const goToSetAddress = ()=>{
                router.push({path:'/address'})
            }
            const init = ()=>{
                Toast.loading({message:'加载中...', forbidClick:true});
                getOrderPreview().then(res=>{
                    let address = res.data.address.filter(n=>n.is_default == '1');
                    if (address.length == 0){
                        state.address={
                            address:'还没有设置默认地址，请选择或填写地址信息'
                        }
                    }
                    else {
                        state.address = address[0];
                    }
                    state.cartList = res.data.carts;
                    Toast.clear();
                })
            }
            const total = computed(()=>{
                let sum = 0;
                state.cartList.forEach(item=>{
                    sum += parseInt(item.num) * parseFloat(item.goods.price);
                })
                //  console.log(sum);
                return sum;
            })
            const handleCreateOrder = ()=>{
                const params = {
                    address_id:state.address.id
                }
                createOrder(params).then(res=>{
                    Toast('创建订单成功')
                    store.dispatch('updateCart')
                    state.showPay = true;
                    // 订单ID
                    state.orderNo = res.data.id;

                    payOrder(state.orderNo, {type:'aliyun'}).then(res=>{
                        state.aliyun =res.data.qr_code_url;
                        state.wechat =res.data.qr_code_url;
                        // console.log(res)
                    })
                    /* payOrder(state.orderNo, {type:'wechat'}).then(res=>{
                         console.log(res);
                         state.wechat = res.data.qr_code_url;
                     })*/

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
            const payAliyunShow = ()=>{
                state.payShow=true;
            }
            const payWachatShow = ()=>{
                state.payShow=true;
            }
            onMounted(()=>{
                init();
            })
            const close = () => {
                router.push({path:'/orderdetail', query:{id:state.orderNo}})
            }
            return {
                ...toRefs(state),
                goToSetAddress,
                init,
                total,
                handleCreateOrder,
                payAliyunShow,
                payWachatShow,
                close
            }
        }
    }
</script>

<style scoped lang="scss">
    .create-order {
        background: #f9f9f9;
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
        .address-wrap {
            text-align: left;
            margin-bottom: 20px;
            background: #fff;
            position: relative;
            margin-top: 44px;
            font-size: 14px;
            padding: 15px;
            color: #222333;
            .name, .address {
                margin: 10px 0;
            }
            .arrow {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px;
            }
            &::before {
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 2px;
                background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
                background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
                background-size: 80px;
                content: '';
            }
        }
        .good {
            margin-bottom: 120px;
        }
        .good-item {
            padding: 10px;
            background: #fff;
            display: flex;
            .good-img {
                img {
                    width:100px;
                    height:auto;
                }
            }
            .good-desc {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 20px;
                .good-title {
                    display: flex;
                    justify-content: space-between;
                }
                .good-btn {
                    display: flex;
                    justify-content: space-between;
                    .price {
                        font-size: 16px;
                        color: red;
                        line-height: 28px;
                    }
                    .van-icon-delete {
                        font-size: 20px;
                        margin-top: 4px;
                    }
                }
            }
        }
        .pay-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #fff;
            padding: 10px 0;
            padding-bottom: 50px;
            border-top: 1px solid #e9e9e9;
            >div {
                display: flex;
                justify-content: space-between;
                padding: 0 5%;
                margin: 10px 0;
                font-size: 14px;
                span:nth-child(2) {
                    color: red;
                    font-size: 18px;
                }
            }
            .pay-btn {
                position: fixed;
                bottom: 7px;
                right: 0;
                left: 0;
                width: 90%;
                margin: 0 auto;
            }
        }
    }
    .submit-all {
        margin-bottom: 60px;
        z-index: 9 !important;
    }
</style>