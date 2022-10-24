import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
const Home = ()=> import('../views/home/Home')
const CateGory = ()=> import('../views/category/CateGory')
const ShopCart = ()=> import('../views/shopcart/ShopCart')
const Detail = ()=> import('../views/detail/Detail')

const ProFile = ()=> import('../views/profile/ProFile')
const Login = ()=> import('../views/profile/Login')
const Register = ()=> import('../views/profile/Register')
const Setting = ()=> import('../views/profile/Setting')
const Address = ()=> import('../views/profile/Address')
const AddressEdit = ()=> import('../views/profile/AddressEdit')

const CreateOrder = ()=> import('../views/order/CreateOrder')
const Order = ()=> import('../views/order/Order')
const OrderDetail = ()=> import('../views/order/OrderDetail')

const Collect = ()=> import('../views/collect/Collect')
const About = ()=> import('../views/about/About')


import store from '../store'
import {Toast,Notify} from 'vant'
import 'vant/es/toast/style';
import 'vant/es/notify/style';

const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component:Home,
    meta:{
      title:'图书兄弟',
      // keepAlive:true //页面缓存
    }
  },
  {
    path: '/home',
    name: 'Home',
    component:Home,
    meta:{
      title:'图书兄弟',
    }
  },
  {
    path: '/category',
    name: 'CateGory',
    component:CateGory,
    meta:{
      title:'商品分类',
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component:ShopCart,
    meta:{
      title:'购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'ProFile',
    component:ProFile,
    meta:{
      title:'个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'商品详情',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'用户登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'用户注册'
    }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta:{
      title:'账号管理',
      isAuthRequired:true
    }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: Collect,
    meta:{
      title:'我的收藏',
      isAuthRequired:true
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta:{
      title:'创建订单'
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta:{
      title:'订单列表',
      isAuthRequired:true
    }
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta:{
      title:'订单详情',
      isAuthRequired:true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:'地址管理',
      isAuthRequired:true
    }
  },
  {
    path: '/addressEdit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta:{
      title:'选择地址',
      isAuthRequired:true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta:{
      title:'关于我们',
    }
  }
]

const router = createRouter({
  // vue3中历史模式默认改为了HTML5模式 服务器配置添加个回退路由
  // history: createWebHistory(process.env.BASE_URL),
  //https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-%E6%A8%A1%E5%BC%8F
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})


//前置路由守卫
router.beforeEach((to,form,next)=>{
  if (to.meta.isAuthRequired && store.state.user.isLogin == false){//判断是否需要鉴权
    Notify('你还没有登录,请先登录')
    return next('/login')
  }else {
    next();
  }

})
//后置路由守卫
router.afterEach((to,form)=>{
  document.title = to.meta.title
})
export default router
