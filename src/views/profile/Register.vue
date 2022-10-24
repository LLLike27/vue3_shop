<template>
    <div>
        <nav-bar>
            <template v-slot:default>用户注册</template>
        </nav-bar>
        <div class="userform">
            <div class="logo">
                <img src="~assets/images/ewshop_logo.png" alt="">
            </div>
            <van-form @submit="onSubmit">
                <van-field
                        v-model="name"
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

                <van-field
                        v-model="password_confirmation"
                        type="password"
                        name="确认密码"
                        label="确认密码"
                        placeholder="确认密码"
                        autocomplete=" "
                        :rules="[{ required: true, message: '请填写一致密码' }]"
                />

                <van-field
                        v-model="email"
                        name="电子邮箱"
                        label="电子邮箱"
                        placeholder="请输入正确电子邮箱格式"
                        autocomplete=" "
                        :rules="[{ required: true, message: '请输入正确电子邮箱格式' }]"
                />
                <div style="margin: 16px;">
                    <div class="link-login" @click="goLogin">
                        已有账号，立即登录
                    </div>
                    <van-button round block type="info" color="#ff6a00" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>
    </div>
</template>

<script>
    import {reactive,toRefs,ref} from 'vue'
    import {register} from '@/network/user'
    import {useRouter} from 'vue-router';
    import {Toast,Notify} from 'vant'
    import 'vant/es/toast/style';
    import 'vant/es/notify/style';
    import NavBar from "@/components/common/navbar/NavBar";
    export default {
        name: "Register",
        components: {NavBar},
        setup(){
            const router = useRouter();
            const goLogin = ()=>{
                router.push({path:'/login'})
            }
            const userinfo = reactive({
                name:'',
                password:'',
                password_confirmation:'',
                email:''
            })
            const onSubmit = ()=>{
                //先验证
                if (userinfo.password !=userinfo.password_confirmation){
                    Notify('两次密码不一致');
                }
                else {
                    register(userinfo).then(res=>{
                        if(res.status == '201'){
                            Toast.success('注册成功')
                            setTimeout(()=>{
                                router.push({path:'/login'})
                            }, 1000)
                        }
                        userinfo.password='';
                        userinfo.password_confirmation='';
                    })
                }
            }
            return {
                ...toRefs(userinfo),
                onSubmit,
                goLogin
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