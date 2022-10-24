<template>
    <div class="nav-bar">
        <div @click="goback" class="left">
            <slot name="left">
                <img src="~assets/images/left.png" alt="">
            </slot>
        </div>
        <div class="center">
            <slot>EWShop</slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavBar",
        setup() {
            const goback =()=>{
                history.back();
            }
            return {
                goback
            }
        }
    }
</script>

<style scoped lang="scss">
    .nav-bar {
        background:var(--color-tint);
        color:#fff;
        position: fixed;
        left:0;
        right:0;
        top:0;
        z-index: 9;
        height:45px;
        line-height: 45px;
        text-align: center;
        display: flex;
    }
    .left, .right {
        width:60px;
        padding:12px;

    }

    .left img {
        width:25px;
        height:25px;
    }
    .center {

        flex: 1;
    }

</style>