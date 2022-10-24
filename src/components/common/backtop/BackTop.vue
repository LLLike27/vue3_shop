<template>
    <div class="backTop" @click="backtop"></div>
</template>

<script>
    export default {
        name: "BackTop",
        setup(props, {emit}){
            const backtop= ()=>{
                emit('bTop')
            }
            return {
                backtop
            }
        }
    }
</script>

<style scoped>
    .backTop {
        position: fixed;
        bottom: 80px;
        right:30px;
        width:40px;
        height:40px;
        z-index: 10;
        border-radius: 50%;
        box-shadow: 5px 5px 5px #999999;
        background: #FCFCFC url("~assets/images/up.png") no-repeat center center;
    }

</style>