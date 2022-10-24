import axios from "axios";
import router from "../router";
import {Notify, Toast} from 'vant';
import 'vant/es/toast/style';
import 'vant/es/notify/style';
//使用对axios的二次封装
export function request(config) {

    const instance=axios.create({
        // baseURL:'https://api.shop.eduwork.cn',
        baseURL:'https://shop.api.eduwork.cn',
        // baseURL:'http://apishop.test',
        timeout:5000
    })

    //请求拦截
    instance.interceptors.request.use(config=>{
        // 如果API需要认证， 在这统一设置
        const token =window.localStorage.getItem('token');

        if (token){
            config.headers.Authorization = 'Bearer' + token;
        }

        return config
    },err => {

    })

    //响应拦截
    instance.interceptors.response.use(res=>{
        return res
    },err => {
        // 如果没有授权， 去login
        if (err.response.status =='401'){
            Toast.fail('请先登录')
            router.push({path: '/login'})
        }
        else if (err.response.status == '400'){
            Toast.fail('密码错误')
        }
        // 如果有错误， 在这里可以提示
        //获取所以键值Object.keys(err.response.data.errors)
        //err.response.data.errors[email][0] email不是固定的 用键值方式获取第一项
        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
    })

    return instance(config)
}