<template>
    <div id="collect">
        <nav-bar>
            <template v-slot:default>我的收藏（{{collects.pagination.total}}件）</template>
        </nav-bar>
        <div class="wrapper">
            <div v-if="collects.pagination.total > 0" class="content">
                <van-card @click="goToDetail(item.goods.id)" style="text-align: left"
                          v-for="(item,index) in collects.list" :key="index"
                          tag="特价"
                          :thumb="item.goods.cover_url"
                    >
                    <template #title>
                        <div class="title">{{item.goods.title}}</div>
                    </template>
                    <template #desc>
                        <div class="desc">{{item.goods.description}}</div>
                    </template>
                    <template #tags>
                        <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
                    </template>
                    <template #price>
                        <div>收藏日期：{{item.updated_at.substr(0,10)}}</div>
                    </template>
                    <template #num>
                        <button class="collect" @click.stop="removeCollect(item.goods.id)">
                            取消收藏
                        </button>
                    </template>
                </van-card>
            </div>
            <div v-else class="content">
                <van-empty description="还没有收藏的商品">
                    <van-button @click="goToCollect" round type="danger" class="bottom-button">去逛逛</van-button>
                </van-empty>
            </div>
        </div>
        <back-top @bTop="bTop" v-show="isTabFixed"></back-top>
    </div>
</template>

<script>
    import NavBar from "@/components/common/navbar/NavBar";
    import BackTop from "@/components/common/backtop/BackTop";
    import {reactive,ref,onMounted,computed,watchEffect,nextTick} from 'vue'
    import {useRouter} from 'vue-router'
    import {myCollects,setCollect} from "@/network/collect";
    import BScroll from 'better-scroll'
    import {Toast} from 'vant'
    import 'vant/es/toast/style';
    export default {
        name: "Collect",
        components: {BackTop, NavBar},
        setup(){
            let isTabFixed=ref(false);
            const router = useRouter();
            const collects =reactive({
                page:1,
                list:[],
                pagination:{}//收藏商品
            })

            const goToDetail = (id)=>{
                router.push({path:'/detail',query:{id}})
            }
            const goToCollect =()=>{
                router.push({path:'/'})
            }
            const removeCollect=(id)=>{
                setCollect(id).then(res=>{
                    if (res.status == '204'){
                        Toast.success('取消成功')
                        setTimeout(()=>{
                            router.go(0)
                        },100)
                    }
                })
            }
            let bscroll = null;
            onMounted(()=>{
                myCollects().then(res=>{
                    collects.list=res.data.data;
                    collects.pagination=res.data.meta.pagination;
                    console.log(collects.list)
                    console.log(collects.pagination)
                })

                bscroll =new BScroll(document.querySelector('.wrapper'),{
                    click:true,
                    pullUpLoad:true,
                    probeType:3
                })
                bscroll.on('scroll', (position)=>{
                    isTabFixed.value = (-position.y) >= 500
                })
                bscroll.on('pullingUp',()=>{
                    // console.log('上拉加载更多.....')
                    const page=collects.page+1;
                    myCollects(page).then(res=>{
                        collects.list.push(...res.data.data)
                        collects.page += 1;
                    })
                    bscroll.finishPullUp();
                    bscroll.refresh();
                })
            })
            const bTop = ()=>{
                bscroll.scrollTo(0, 0, 500);
            }
            watchEffect(()=>{
                nextTick(()=>{
                    bscroll && bscroll.refresh();
                })
            })
            return{
                collects,
                isTabFixed,
                bTop,
                goToDetail,
                goToCollect,
                removeCollect
            }
        }
    }
</script>

<style scoped lang="scss">
    #collect {
        height: 100vh;
        position: relative;

        .title {
            font-size:14px;
            font-weight: bold;
        }
        .desc{
            margin:10px 0;
        }

        .price {
            color:#ff6a00;
            font-size:16px;
            margin-top:10px;
        }
        .bottom-button {
            width: 160px;
            height: 40px;
        }
        .collect {
            border:0px;
            border-radius: 2px;
            padding:2px 5px;
        }
        .wrapper {
            position: absolute;
            top:45px;
            bottom: 50px;
            left:0px;
            right:0px;
            overflow: hidden;//溢出隐藏
            .content {

            }
        }
    }
</style>