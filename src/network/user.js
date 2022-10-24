import {request} from "@/network/request";


export function register(data){
    return request({
        url:'/api/auth/register',
        method:'post',
        data
    })
}

export function login(data){
    return request({
        url:'/api/auth/login',
        method:'post',
        data
    })
}

export function logout(){
    return request({
        url:'/api/auth/logout',
        method:'post'
    })
}

export function getUser(){
    return request({
        url:'/api/user'
    })
}

export function setUserName(name) {
    return request({
        url:'/api/user',
        method:'put',
        data:{name}
    })
}

export function uploadAvatar(data) {
    return request({
        url:'/api/user/avatar',
        headers: {'Content-Type': 'multipart/form-data'},
        method:'post',
        data
    })
}

export function updatePassWord(data) {
    return request({
        url:'/api/auth/password/update',
        headers: {'Content-Type': 'multipart/form-data'},
        method:'post',
        data
    })
}

