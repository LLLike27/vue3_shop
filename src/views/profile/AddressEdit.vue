<template>
    <div class="address-edit-box">
      <nav-bar>
          <template v-slot:default>{{title}}</template>
      </nav-bar>

        <van-address-edit class="edit"
                :area-list="areaList"
                :address-info="addressInfo"
                :show-delete="type == 'edit'"
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
        />
    </div>
</template>

<script>
    import NavBar from "@/components/common/navbar/NavBar";
    import { ref,onMounted,reactive,toRefs,computed } from 'vue';
    import {tdist} from "@/utils/address";
    import {useRoute,useRouter} from 'vue-router'
    import {addAddress,editAddress,deleteAddress,getAddressDetail} from "@/network/address";
    import { Toast } from 'vant';
    import 'vant/es/toast/style';
    export default {
        name: "AddressEdit",
        components: {NavBar},
        setup() {
            const route = useRoute();
            const router = useRouter();

            const state = reactive({
                areaList:{//地区列表
                    province_list:{},
                    city_list:{},
                    county_list:{}
                },
                searchResult: [],//详细地址搜索结果待补全
                addressInfo:{},//地址信息初始值
                title:'',
                type:'add',
                addressId: '',
            })

            onMounted(()=>{
                // 省市区 列表 构造出来
                let _province_list={};
                let _city_list={};
                let _county_list={}

                tdist.getLev1().forEach(p=>{
                    _province_list[p.id] = p.text;
                    tdist.getLev2(p.id).forEach(c=>{
                        _city_list[c.id] = c.text;
                        tdist.getLev3(c.id).forEach(q=>{
                            _county_list[q.id] = q.text;
                        })
                    })
                })
                state.areaList.province_list = _province_list;
                state.areaList.city_list = _city_list;
                state.areaList.county_list = _county_list;
                // 接收参数
                const { type,addressId} = route.query;

                state.type = type;
                state.addressId = addressId;
                // console.log(state.addressId)
                if (type == 'edit'){
                    getAddressDetail(addressId).then(res=>{
                        const addressDetail = res.data;//全部数据 省市区
                        let _areaCode = ''
                        const province = tdist.getLev1();//省份

                        Object.entries(state.areaList.county_list).forEach(([id,text])=>{
                            // console.log('----'+id,'====='+text)
                            //先找出当前对应的区
                            if (text == addressDetail.county) {
                                // 通过区id前面两个与省前面两个id相同 找区对应的省份
                                const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
                                // 找到区对应的几个市区
                                const cityIndex = Object.entries(state.areaList.city_list).filter(
                                    ([cityId,city])=> cityId.substr(0,4) == id.substr(0,4)
                                )[0]
                                //对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
                                if (province[provinceIndex].text == addressDetail.province && cityIndex[1] == addressDetail.city){
                                    _areaCode = id;

                                }
                            }
                        })
                        state.addressInfo ={
                            name:addressDetail.name,
                            tel:addressDetail.phone,
                            province: addressDetail.province,
                            city:addressDetail.city,
                            county:addressDetail.county,
                            areaCode:_areaCode,
                            addressDetail:addressDetail.address,
                            isDefault: !!addressDetail.is_default
                        }
                    })
                }
            })
            const title =computed(()=>{
                return state.type == 'add' ? '新增地址' : '编辑地址'
            })
            const searchResult = ref([]);

            //保存
            const onSave = (content) => {
                //数据模型 把表单内容赋给默认信息
                const params = {
                    name:content.name,
                    phone:content.tel,
                    province:content.province,
                    city:content.city,
                    county:content.county,
                    address:content.addressDetail,
                    is_default:content.isDefault ? 1 : 0
                }
                //根据传过来的type 分别调用不同的接口
                if (state.type =='edit'){
                    //调用接口编辑地址
                    editAddress(state.addressId,params);
                }else if(state.type ='add') {
                    //调用接口添加数据
                    addAddress(params);
                }
                Toast('保存成功');
                setTimeout(()=>{
                    router.back();
                }, 1000)
            }
            //删除
            const onDelete = () =>{
                deleteAddress(state.addressId).then(res=>{
                    Toast('删除成功');
                    setTimeout(()=>{
                        router.back();
                    }, 1000)
                })
            }

            return {
                ...toRefs(state),
                onSave,
                searchResult,
                title,
                onDelete
            };
        },
    }
</script>

<style lang="scss">
    .edit {
        .van-field__body {
            textarea {
                height: 26px!important;
            }
        }
    }
    .address-edit-box {
        margin-top: 44px;
        .van-address-edit {
            .van-button--danger {
                background: var(--color-tint);
                border-color: var(--color-tint);
            }
            .van-switch--on {
                background:var(--color-tint);
            }
        }
    }
</style>