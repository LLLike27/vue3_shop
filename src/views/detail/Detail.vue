<template>
    <div id="detail">
        <nav-bar>
            <template v-slot:default>{{detail.title}}详情</template>
        </nav-bar>
        <van-image style="margin-top:50px"
                   width="100%"
                   :src="detail.cover_url"
        />
        <div class="title">{{detail.title}}</div>

        <van-card style="text-align: left">
            <template #desc>
                <div class="desc">{{detail.description}}</div>
            </template>
            <template #tags>
                <div class="tags">
                    <van-tag plain type="danger">新书</van-tag>
                    <van-tag plain type="danger">推荐</van-tag>
                    <van-tag plain type="danger">特价</van-tag>
                    <van-tag plain type="danger">节日活动</van-tag>
                </div>
            </template>
            <template #price>
                <div class="price"><small>￥</small>{{detail.price+'.00'}}</div>
            </template>>
            <template #num>
                <div class="num">剩余 <span>{{detail.stock}}</span> 件</div>
            </template>
            <template #bottom>
                <div class="bottom">
                    <div>我要买</div>
                    <div>
                        <span>(不限购)</span>
                        <van-stepper v-model="gnum" min="1" :max="detail.stock" />
                    </div>
                </div>
            </template>
            <template #footer>
                <button class="collect" @click="collectClick">
                    <div v-if="isCollect">
                        <img src="~assets/images/collect1.png" alt="">
                        <br>
                        <span>已收藏</span>
                    </div>
                    <div v-else>
                        <img src="~assets/images/collect.png" alt="">
                        <br>
                        <span>收藏</span>
                    </div>
                </button>
                <button  class="vbtn vbtn1" @click="handleAddCart">加入购物车</button>
                <button  class="vbtn vbtn2" @click="goToCart">立即购买</button>
            </template>
        </van-card>
        <van-tabs v-model="active">
            <van-badge :content="detail.comments.length" max="99">
                <div class="child" />
            </van-badge>
            <van-tab title="概述">
                <div class="con" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="热评">
                <div v-if="detail.comments.length==0" class="con">
                    <van-empty description="该商品还没有评论呀！">
                        <van-button @click="$router.push('/')" round type="danger" class="bottom-button">去发表评论</van-button>
                    </van-empty>
                </div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import {useRoute,useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import {getDetail} from "@/network/detail";
    import {setCollect} from "@/network/collect";
    import {onMounted,ref,reactive,toRefs} from 'vue'
    import NavBar from "@/components/common/navbar/NavBar";
    import {addCart} from "@/network/cart";
    import {Toast,Notify} from 'vant'
    import 'vant/es/toast/style';
    import 'vant/es/notify/style';
    export default {
        name: "Detail",
        components: {NavBar},
        setup(){
            const route=useRoute();
            const router=useRouter();
            const store=useStore()
            const value = ref(1);
            let gnum = ref(1);
            let active = ref(1);
            let id=ref(0)
            let isCollect =ref(false)
            let book = reactive({
                detail:{
                    comments:[]
                },
                like_goods:[]
            });
            onMounted(()=>{
                id.value=route.query.id;
                getDetail(id.value).then(res=>{
                    console.log(id.value)
                    book.detail = res.data.goods;
                    isCollect.value = !!book.detail.is_collect;
                    book.like_goods = res.data.like_goods;
                      console.log(book.detail);
                })
            })
            // 设置收藏
            const collectClick = ()=>{
                setCollect(id.value).then(res=>{
                    if (res.status == '201') {
                        console.log('添加收藏')
                        isCollect.value = true
                    }
                    else if(res.status == '204'){
                        console.log('取消收藏')
                        isCollect.value = false
                    }
                })
            }
            //添加购物车
            const handleAddCart = ()=>{
                addCart({goods_id:book.detail.id,num:gnum.value}).then(res=>{
                    if (res.status == '201' || res.status == '204' ){
                        Toast.success('添加成功');
                        store.dispatch('updateCart');
                    }
                })
            }
            //立即购买
            const goToCart = ()=>{
                addCart({goods_id: book.detail.id,num:gnum.value}).then(res=>{
                    if (res.status == '201' || res.status == '204' ){
                        Toast.success('立即购买，显示购物车');
                        router.push({path:'/shopcart'})
                        store.dispatch('updateCart');
                    }
                })
            }
            return{
                ...toRefs(book),
                id,
                value,
                collectClick,
                isCollect,
                active,
                gnum,
                handleAddCart,
                goToCart
            }
        }
    }
</script>

<style lang="scss">

    #detail {
        .bottom-button {
            width: 160px;
            height: 40px;
        }
        .van-tag {
            margin-right:5px;
        }
        .van-badge--fixed {
            position: relative;
            top:-35px;
            right:-5px;
        }
        .van-tabs {
            margin-bottom: 50px;
        }
        .title {
            font-size:18px;
            font-weight: bold;
            color:#FFFFFF;
            width:100%;
            height:30px;
            line-height:30px;
            background:#ff6a00;
            text-align: center;
        }

        .desc {
            width:100%;
            height:50px;
            line-height:20px;
            padding:5px;
            background-color: #FCFCFC;
        }

        .tags {
            margin:10px 0;
        }

        .price {
            color:#ff6a00;
            font-size:18px;
        }
        .bottom {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            span {
                font-size:12px;
                color:var(--color-high-text);
                margin-right:10px;
            }
        }
        .num {
            span {
                font-weight: bold;
            }
        }
        .collect {
            width:50px;
            height:40px;
            line-height: 15px;
            border:0px;
            position: relative;
            top:-5px;
            background-color: unset;

            text-align: center;
            img {
                width:14px;
                height:14px;
            }
            span {

            }
        }

    }

    .con {
        padding:10px;
        min-height: 200px;
        text-align: left;
    }

    .vbtn {
        height:40px;
        width:103px;
        line-height:40px;
        text-align: center;
        color:#ffffff;
        border:0px;
    }

    .vbtn1 {
        border-radius: 20px 0 0 20px;
        background: linear-gradient(to right, #ffd01e, #ff8917);
    }

    .vbtn2 {
        border-radius: 0 20px  20px 0;
        background: linear-gradient(to right, #ff6034, #ee0a24);
    }


</style>