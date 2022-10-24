import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'default-passive-events'//解决控制台报错问题
//引入vant组件库
import {List,PullRefresh,Overlay,Grid,GridItem,Empty,AddressList,AddressEdit,Area,Popup,Checkbox, CheckboxGroup,SwipeCell,SubmitBar,Badge,Button,Icon,Uploader,Form, Field, CellGroup,Stepper,Image as VanImage,Lazyload,NavBar,Swipe,SwipeItem,Tab, Tabs,Sticky,Collapse,Card, CollapseItem,Sidebar, SidebarItem } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(List).use(PullRefresh).use(Overlay).use(Grid).use(GridItem).use(Empty).use(AddressList).use(AddressEdit).use(Area).use(Popup).use(Checkbox).use(CheckboxGroup).use(SwipeCell).use(SubmitBar).use(Button).use(Badge).use(Icon).use(Uploader).use(Form).use(Field).use(CellGroup).use(Stepper).use(VanImage).use(Lazyload,{
loading:require('@/assets/images/default.png')
}).use(Card).use(Collapse).use(CollapseItem).use(SidebarItem).use(Sidebar).use(Sticky).use(Tabs).use(Tab).use(SwipeItem).use(Swipe).use(NavBar)
    .use(store).use(router).mount('#app')
