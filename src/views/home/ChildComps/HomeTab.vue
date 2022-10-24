<template>
        <div class="tab-item">
            <van-tabs v-model:active="active" @click-tab="itemClick">
                <van-tab v-for="(item,index) in tites " :title="item" :key="index"
                >
                </van-tab>
            </van-tabs>
        </div>
</template>

<script>
    import {ref} from 'vue'
    export default {
        name: "HomeTab",
        props:{
            tites:{
                type:Array,
                default(){
                    return []
                }
            },
        },
        setup(props, {emit}) {
            const active = ref(0);
            const itemClick = (e)=> {
                emit('tabClick', e)
                // console.log(e)
            }
            return {
                active,
                itemClick
            };
        },
    }
</script>

<style  scoped lang="scss">
.tab-item{
    top: 45px;
    position:sticky;
    z-index: 9;
}
</style>