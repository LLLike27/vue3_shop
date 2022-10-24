<template>
    <div>
        <nav-bar>
            <template v-slot:default>用户登录</template>
        </nav-bar>
        <div class="userform">
            <div class="logo">
                <img src="~assets/images/ewshop_logo.png" alt="">
            </div>
            <van-form @submit="onSubmit">
                <van-field
                        v-model="email"
                        name="用户名"
                        label="用户名"
                        placeholder="用户名"
                        autocomplete=" "
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                        v-model="password"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        autocomplete=" "
                        :rules="[{ required: true, message: '请填写密码' }]"
                />

                <div style="margin: 16px;">
                    <div class="link-login" @click="goRegister">
                        没有账号，立即注册
                    </div>
                    <van-button round block  color="#ff6a00" native-type="submit">提交</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import {login} from "@/network/user";
    import {reactive,toRefs} from 'vue'
    import {Toast,Notify} from 'vant'
    import 'vant/es/toast/style';
    import 'vant/es/notify/style';
    import NavBar from "@/components/common/navbar/NavBar";
    export default {
        name: "Login",
        components: {NavBar},
        setup(){
            const router=useRouter();
            const store = useStore();
            const goRegister = ()=>{
                router.push({path:'/register'})
            }
            const userinfo=reactive({
                email:'',
                password:''
            })
            const onSubmit = ()=>{
                login(userinfo).then(res=>{
                        // 将token window.localStorage    setItem(key, value)   getItem(key)
                        window.localStorage.setItem('token',res.data.access_token);
                        store.commit('setIsLogin',true);//状态管理 设置为登录状态
                        Toast.success('登录成功')

                        userinfo.email = '';
                        userinfo.password = '';
                        setTimeout(()=>{
                            router.push({path:'/profile'})
                        }, 500)
                })
            }
            return {
                goRegister,
                ...toRefs(userinfo),
                onSubmit
            }
        }
    }
</script>

<style scoped lang="scss">
    .link-login {
        font-size:14px;
        margin-bottom: 20px;
        color:var(--color-high-text);
        display: inline-block;
        text-align: left;
        float:left;
    }
    .userform {
        margin:100px 0;
        .logo {
            padding-bottom: 50px;
            img {
                width:150px;
                height:auto;
            }
        }
    }
</style>