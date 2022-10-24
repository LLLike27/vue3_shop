<template>
    <div>
        <nav-bar>
            <template v-slot:default>密码修改</template>
        </nav-bar>
        <div class="userform">
            <van-form @submit="onSubmit">
                <van-field
                        v-model="old_password"
                        type="password"
                        name="旧密码"
                        label="旧密码"
                        autocomplete=" "
                        placeholder="旧密码"
                        :rules="[{ required: true, message: '旧密码' }]"
                />
                <van-field
                        v-model="password"
                        type="password"
                        name="密码"
                        label="密码"
                        autocomplete=" "
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                />

                <van-field
                        v-model="password_confirmation"
                        type="password"
                        name="确认密码"
                        label="确认密码"
                        autocomplete=" "
                        placeholder="确认密码"
                        :rules="[{ required: true, message: '请填写一致密码' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" color="#ff6a00" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>
    </div>
</template>

<script>
    import {reactive,toRefs,ref,} from 'vue'
    import {useRouter} from 'vue-router';
    import {Toast,Notify} from 'vant'
    import 'vant/es/toast/style';
    import 'vant/es/notify/style';
    import {updatePassWord,logout} from "@/network/user";
    import NavBar from "@/components/common/navbar/NavBar";
    export default {
        name: "Setting",
        components: {NavBar},
        setup(){
            const router=useRouter();
            const state=reactive({
                old_password:'',
                password:'',
                password_confirmation:''
            })
            const onSubmit=()=>{
                if (state.password!=state.password_confirmation){
                    Notify('两次密码不一致')
                }
                else{
                    updatePassWord(state).then(res=>{
                        if (res.status =='400'){
                            Toast.success('旧密码错误')
                        }
                        else if (res.status == '204'){
                            Toast.success('修改成功')
                            state.old_password='';
                            state.password='';
                            state.password_confirmation='';
                            setTimeout(()=>{
                                router.push({path:'/login'})
                            },500)
                            window.localStorage.setItem('token', '');
                            store.commit('setIsLogin', false);//状态管理 设置为退出状态
                        }
                    })
                }

            }
            return{
                ...toRefs(state),
                onSubmit,
                router
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
    }
</style>