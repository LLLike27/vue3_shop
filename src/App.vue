<template>
  <router-view class="router-view" v-slot="{ Component }">
          <component :is="Component" />
  </router-view>

  <div id="nav">
    <router-link class="tab-bar-item" to="/">
      <div class="icon"><i class="iconfont icon-shouye"></i></div>
      <div>首页</div>
    </router-link>
    <router-link class="tab-bar-item" to="/category">
      <div class="icon"><i class="iconfont icon-categorynormal"></i></div>
      <div>分类</div>
    </router-link>
    <router-link class="tab-bar-item" to="/shopcart">
      <van-badge class="badgeindex" :content="$store.state.cartCount" max="99">
        <div class="icon"><i class="iconfont icon-cart"></i></div>
      </van-badge>
      <div>购物车</div>
    </router-link>
    <router-link class="tab-bar-item" to="/profile">
      <div class="icon"><i class="iconfont icon-custom-user"></i></div>
      <div>我的</div>
    </router-link>


  </div>

</template>


<script>

  import {onMounted } from 'vue'
  import{ useStore } from 'vuex'
  export default {
    name:'App',
    setup(){
      const store =useStore();
      onMounted(()=>{
        if (store.state.user.isLogin){
          store.dispatch('updateCart')
        }
      })
    }
  }
</script>


<style lang="scss">

  @import "assets/css/base.css";
  @import "assets/css/iconfont.css";

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  #nav {
    background-color: #F6F6F6;
    display: flex;
    position: fixed;
    left:0;
    right:0;
    bottom:0;
    box-shadow: 0 -3px 1px rgba(100, 100, 100, 0.1);

    a {

      color: #2c3e50;

      &.router-link-exact-active {
        color: var(--color-high-text);
      }
    }

    .tab-bar-item {
      flex: 1;
      text-align: center;
      height:50px;
      font-size:var(--font-size);
      .icon {
        margin-top: 5px;
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
</style>
