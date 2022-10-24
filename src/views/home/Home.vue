<template>
    <div id="home">
        <nav-bar>
            <template v-slot:default>图书兄弟</template>
        </nav-bar>

<!--            <home-tab v-if="isTabFixed" @tabClick="tabClick" :tites="['畅销', '新书', '精选']"></home-tab>-->
        <van-tabs v-model:active="active" class="tabsClass" v-if="isTabFixed" @click-tab="onClickTab">
            <van-tab title="畅销"></van-tab>
            <van-tab title="新书"></van-tab>
            <van-tab title="精选"></van-tab>
        </van-tabs>
        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <home-swiper :banners="banners"></home-swiper>
                    <recommend-view :recommends="recommends"></recommend-view>
                </div>
<!--                    <home-tab  @tabClick="tabClick" :tites="['畅销', '新书', '精选']"></home-tab>-->
                <van-tabs v-model:active="active" @click-tab="onClickTab">
                    <van-tab title="畅销"></van-tab>
                    <van-tab title="新书"></van-tab>
                    <van-tab title="精选"></van-tab>
                </van-tabs>
                <goods-list :goods="showGoods"></goods-list>
            </div>
        </div>
        <back-top v-show="isTopFixed" @bTop="goTop"></back-top>
    </div>
</template>

<script>
    import NavBar from '@/components/common/navbar/NavBar'
    import HomeSwiper from "@/views/home/ChildComps/HomeSwiper";
    import {getHomeAllData,getHomeGoodsData} from "@/network/home";
    import {ref,onMounted,reactive,computed,nextTick,watchEffect} from 'vue'
    import RecommendView from "@/views/home/ChildComps/RecommendView";
    import HomeTab from "@/views/home/ChildComps/HomeTab";
    import GoodsList from "@/components/content/goods/GoodsList";
    import BScroll from 'better-scroll'
    import BackTop from "@/components/common/backtop/BackTop";
    export default {
        name: "Home",
        components:{
            BackTop,
            GoodsList,
            HomeTab,
            RecommendView,
            HomeSwiper,
            NavBar,
        },
        setup() {
            const active=ref(0)
            const banners=ref([])
            const recommends=ref([])
            let currentType = ref('sales');
            let isTopFixed=ref(false)
            let isTabFixed=ref(false)
            let banref=ref(null);

            //如果用HomeTab组件 这边onClickTab要改成自定义事件tabClick接收参数 orders[e.name]也要改
            const onClickTab=(e)=>{
                let orders=['sales','new','recommend']
                currentType.value = orders[e.name];
                nextTick(()=>{
                    bscroll && bscroll.refresh();
                    //重新计算 refresh BetterScroll，
                    // 当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
                })
                console.log(e)
                // console.log(currentType.value)
            }
            const goods=reactive({
                sales:{page: 1,list:[]},
                new:{page: 1,list:[]},
                recommend:{page: 1,list:[]},
            })
            //计算当前点击的数据
            const showGoods = computed(()=>{
                return goods[currentType.value].list
            })
             let bscroll=null;
            onMounted(()=>{
                getHomeAllData().then(res=>{
                    banners.value = res.data.slides;
                    recommends.value = res.data.goods.data;
                })
                getHomeGoodsData('sales').then(res=>{
                    goods.sales.list=res.data.goods.data;
                })
                getHomeGoodsData('new').then(res=>{
                    goods.new.list=res.data.goods.data;
                })
                getHomeGoodsData('recommend').then(res=>{
                    goods.recommend.list=res.data.goods.data;
                })
                bscroll = new BScroll(document.querySelector('.wrapper'),{
                    mouseWheel:true,
                    click:true,
                    observeDOM:true,
                    observeImage:true,
                    pullUpLoad:true,
                    probeType:3
                });

                bscroll.on('scroll',(position)=>{
                        isTopFixed.value=(-position.y)>=1000
                    //banref的高度大于等于下拉高度为true 否则为false
                    isTabFixed.value = (-position.y) >= banref.value.offsetHeight
                    // console.log(banref.value.offsetHeight)
                })
                bscroll.on('pullingUp', ()=>{
                      // console.log('上拉加载更多.....')

                    const page = goods[currentType.value].page + 1;
                    getHomeGoodsData(currentType.value, page).then(res=>{
                        goods[currentType.value].list.push(...res.data.goods.data)
                        goods[currentType.value].page += 1;
                    })
                        // 完成上拉， 等数据请求完成， 要将新数据展示出来
                        bscroll.finishPullUp();
                        bscroll &&  bscroll.refresh();

                      // console.log('当前类型：'+currentType.value+",当前页："+page)
                })
            })
            watchEffect(()=>{
                nextTick(()=>{
                    bscroll && bscroll.refresh();
                })

            })
            const goTop = ()=>{
                bscroll.scrollTo(0, 0, 500);
            }
            return {
                banners,
                recommends,
                onClickTab,
                currentType,
                showGoods,
                goods,
                goTop,
                isTopFixed,
                isTabFixed,
                banref,
                active
            };
        },
    }
</script>

<style scoped lang="scss">
    #home {
        height: 100vh;
        position: relative;
    }
    .van-nav-bar__content {
        position: relative;
        top: 0px;
    }
    .tabsClass{
        position: absolute;
        margin-top: 44px;
        width: 100%;
        z-index: 999;
    }
    .wrapper {
        position: absolute;
        top:45px;
        bottom: 50px;
        left: 0px;
        right: 0px;
        overflow: hidden;
        .content {

        }
    }
</style>