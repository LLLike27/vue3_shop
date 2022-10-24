<template>
    <div>
        <nav-bar>
            <template v-slot:default>商品分类</template>
        </nav-bar>
        <div id="mainbox">
            <div class="topTab">
                <van-tabs v-model:active="activetabs" @click-tab="tabsClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>
                </van-tabs>
            </div>
            <van-sidebar class="leftTab" v-model="activesidebar">
                <van-collapse v-model="activeNames" accordion>
                    <van-collapse-item :title="item.name"
                                       v-for="item in categories"
                                       :key="item.id"
                                       :name="item.name">
                            <van-sidebar-item v-for="sub in item.children"
                                              :title="sub.name"
                                              :key="sub.name"
                                              @click="getGoods(sub.id)"
                            />
                    </van-collapse-item>
                </van-collapse>
            </van-sidebar>
            <div class="goodslist">
                <div class="content">
                    <van-card
                            style="padding:5px;"
                            v-for="item in showGoods" :key="item.id"
                            @click="itemClick(item.id)"
                            :tag="item.comments_count >= 0 ? '流行' : '标签'"
                            :title="item.title"

                    >
                        <template #thumb>
                            <div class="thumb"><img v-lazy="item.cover_url" alt=""></div>
                        </template>

                        <template #desc>
                            <div class="price"><small>￥</small>{{item.price+'.00'}}</div>
                        </template>
                        <template #price>
                            <div class="sales">商品销量</div>
                        </template>

                        <template #num>
                            <div class="num">x{{item.sales}}</div>
                        </template>
                    </van-card>

                </div>
            </div>
        </div>
        <back-top @click="bTop" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
    import NavBar from "@/components/common/navbar/NavBar";
    import {getCategoryGoods,getCategory} from "@/network/category";
    import {ref,onMounted,computed,reactive,nextTick,watchEffect} from 'vue'
    import BackTop from "@/components/common/backtop/BackTop";
    import {useRouter} from 'vue-router'
    import  BScroll from 'better-scroll'
    export default {
        name: "CateGory",
        components: {BackTop, NavBar},
        setup() {
            let activetabs = ref(0);
            let activesidebar = ref(0);
            let activeNames = ref('1');
            let categories=ref([]);
            let isShowBackTop = ref(false);
            //当前的排序条件
            let currentOrder = ref('sales');
            //当前的分类ID
            let currentCid = ref(0);
            //排序选项卡
            const tabsClick = (e)=>{
                // console.log(e)
                let orders = ['sales', 'price', 'comments_count'];
                currentOrder.value = orders[e.name];

                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list = res.data.goods.data;
                })
                 //console.log(goods[currentOrder.value].list)

                nextTick(()=>{
                    // 重新计算高度
                    bscroll &&  bscroll.refresh();
                })

            }
            //通过分类get商品
            const getGoods = (Subid)=>{
                currentCid.value=Subid;
                init();
                // console.log(currentCid.value)
            }
            //数据模型
            const goods = reactive({
                sales:{page:0, list:[]},
                price:{page:0, list:[]},
                comments_count:{page:0, list:[]}
            })
            //计算不同分类数据
            const showGoods = computed(()=>{
                return goods[currentOrder.value].list;
            })
            const init = ()=>{
                getCategoryGoods('sales',currentCid.value).then(res=>{
                    goods.sales.list=res.data.goods.data;
                  //  console.log(res.data.goods.data);
                })
                getCategoryGoods('price',currentCid.value).then(res=>{
                    goods.price.list=res.data.goods.data;
                })
                getCategoryGoods('comments_count',currentCid.value).then(res=>{
                    goods.comments_count.list=res.data.goods.data;
                })
            }

            let bscroll = reactive({});
            onMounted(()=>{
                getCategory().then((res)=>{
                    categories.value=res.data.categories;
                })
                init();

                // 创建BetterScroll对象
                bscroll =new BScroll(document.querySelector('.goodslist'),{
                    probeType: 3,  // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
                    click: true, // 是否允许点击
                    pullUpLoad: true //上拉加载更多， 默认是false
                })
                // 注册滚动事件
                bscroll.on('scroll',(position)=>{
                        isShowBackTop.value = (-position.y) > 500
                })

                // 上拉加载数据,触发pullingUp
                bscroll.on('pullingUp',()=>{

                    const page = goods[currentOrder.value].page + 1;

                    getCategoryGoods(currentOrder.value,page).then(res=>{
                        goods[currentOrder.value].list.push(...res.data.goods.data);
                        goods[currentOrder.value].page +=1;
                    })

                    setTimeout(()=>{
                        // 完成上拉， 等数据请求完成， 要将新数据展示出来
                        bscroll.finishPullUp();
                    },20)
                    //重新计算高度
                    nextTick(()=>{
                        // 重新计算高度
                        bscroll &&  bscroll.refresh();
                    })
                })
            })
            // 监听 任何一个变量有变量
            watchEffect(()=>{
                nextTick(()=>{
                    // 重新计算高度
                    bscroll &&  bscroll.refresh();
                })
            })

            //回到顶部
            const bTop = ()=>{
                bscroll.scrollTo(0, 0, 300);
            }

            //
            const router=useRouter();
            const itemClick=(id)=>{
                router.push({path:'/detail', query:{id}});
            }
            return {
                activetabs,
                activesidebar,
                activeNames,
                categories,
                tabsClick,
                currentCid,
                currentOrder,
                getGoods,
                init,
                goods,
                showGoods,
                bTop,
                isShowBackTop,
                itemClick
            };
        },
    }
</script>

<style scoped lang="scss">
    #mainbox{
        margin-top: 45px;
        display: flex;
        .topTab{
            flex: 1;
            float:right;
            height:50px;
            z-index: 9;
            position: fixed;
            top:45px;
            right:0;
            left:130px;
        }
        .leftTab{
            position: fixed;
            top:95px;
            left:0;
            width:130px;
        }
        .goodslist{
            flex:1;
            position: absolute;
            top:100px;
            left:120px;
            right:0;
            height:100vh;
            padding:10px;
            text-align: left !important;
            .content {

            }
        }
        .price {
            color:#ff6a00;
            font-size:16px;
            margin-top:10px;
        }
        .sales {
            position: relative;
            top:-10px;
            color:#666;
            font-size:12px;
        }

        .num {
            position: relative;
            top:-10px;
        }
        .thumb {
            width:80px;
            img {
                width:80px
            }
        }
    }
    .van-card__thumb {
        width:68px !important
    }
</style>