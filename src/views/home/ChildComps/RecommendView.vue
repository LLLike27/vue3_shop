<template>
    <div class="recommend">
        <div class="recommends-item" v-for="(item,index) in recommends.slice(0,4)" :key="index">
            <a href="" @click.prevent="goD(item.id)">
                <img v-lazy="item.cover_url" alt="">
                <div>{{item.title}}</div>
            </a>
        </div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'
    export default {
        name: "RecommendView",
        props:{
            recommends:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        setup(){
            const router=useRouter();
            const goD=(id)=>{
                router.push({path:'/detail',query:{id}})
            }
            return {
                goD
            }
        }
    }
</script>

<style scoped lang="scss">
.recommend{
    display: flex;
    border-bottom: 8px solid #eee;
    padding:15px 0px 20px;
    text-align: center;
    width:100%;
    .recommends-item{
        flex: 1;
        font-size:12px;
        img{
            width:70px;
            height:70px;
            margin-bottom: 10px;
        }
    }
}
</style>