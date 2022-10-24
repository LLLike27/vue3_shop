import { createStore } from 'vuex'
import {getCart} from '@/network/cart'

export default createStore({
  state: {
    cartCount:0,
    user:{
      //判断token在不在本地
      isLogin:window.localStorage.getItem('token') ? true : false
    }
  },
  getters: {
  },
  mutations: {
    setIsLogin(state, payload) {
      state.user.isLogin = payload;
    },
    addCart(state,payload){
      state.cartCount = payload.count;
    }
  },
  actions: {
    //写业务逻辑的地方 给mutatis用
    //从服务器异步请求购物车长度 然后更新状态管理中的 cartCount
    updateCart({commit}){
      // console.log('-----',commit)
      getCart().then(res=>{
        commit('addCart',{count:res.data.data.length || 0})
      })
    }
  },
  modules: {
  }
})
