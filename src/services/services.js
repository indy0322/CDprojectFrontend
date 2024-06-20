import axios from "axios";
import { json } from "react-router-dom";


class Services{

    async searchStay(setTourList,key){
        return await axios.get(`https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${key}&numOfRows=30&MobileOS=WIN&_type=json&MobileApp=test&listYN=Y&keyword=경복궁`)//https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${key}&MobileOS=WIN&_type=json&MobileApp=test&contentId=130511&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&mapinfoYN=Y => 간송미술관 데이터만 조회
                .then((res) => {
                    console.log(res.data.response.body.items.item)
                    setTourList(res.data.response.body.items.item)
                })
    }

    nodetest(){
        return axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/nodetest`,{title: "fffff"})
    }

    async login(data){
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/login`, data)
                .then((res) => {
                    console.log(res.data)
                    return res.data
                    //setToken(res.data.token)
                })
    }

    async auth(option){
        try{
            return await axios.get(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/auth`,option)
                .then(async (res) => {
                    return await res.data
                })
                .then(async (res) => {
                    
                    return await res
                })  
        }
        catch(err){
            
            if(err.response.data.code == '401'){
                //console.log(err.response.data.message)
                return await err.response.data
            }
            if(err.response.data.code == '419'){
                //console.log(err.response.data.message)
                return await err.response.data
            }
            
        }
        /*return fetch('/api/auth',option)
                .then(async(res) => {
                    return await res.json()
                })
                .then((res) => {
                    console.log(res.message)
                    if(res.message === "정상 토큰"){
                        console.log(res.data.nickname)
                    }
                    else{
                        console.log("잘못된 토큰 또는 토큰이 없다")
                    }
                })*/
    }

    async register(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/register`,data)
            .then((res) => {
                console.log(res.data)
                return res.data
            })
    }

    async reviewRegister(data) {
        return await axios.post(`/api/reviewregister`,data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
        /*try{
            return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewregister`,data)
                .then(async(res) => {
                    console.log(res.data)
                    return await res.data
                })
        }catch(err){
            
            console.log(err)
            return await err
        }*/
        
    }

    async reviewRemove(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewremove`,data)
                .then(async (res) => {
                    console.log(res)
                    return await res.data
                })
        /*try{
            return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewremove`,data)
                .then(async (res) => {
                    console.log(res.data)
                    return await res.data
                })
        }catch(err){
            console.log(err)
            return await err
        }*/
    }

    async reviewInfo(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewinfo`,data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
        /*try{
            return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewinfo`,data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
        }catch(err){
            console.log(err)
            return await err
        }*/
    }

    async wishRegister(data) {
        return await axios.post('/api/wishregister',data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async wishRemove(data) {
        return await axios.post('/api/wishremove',data)
                .then(async(res) => {
                    console.log(res)
                })
    }

    async wishInfo(data) {
        return await axios.post('/api/wishinfo',data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async authNumber(data){
        try{
            return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/authnumber',data)
                .then(async(res) => {
                    console.log(res.data)
                    return res.data
                    
                })
                
                
                
        }catch(err){
            console.log(err)
        }
    }

    async audioMp3(data){
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/audio',data,{responseType:'blob'})
            .then((res) => {
                console.log(res)
                const audioObjectUrl = URL.createObjectURL(res.data)
                return audioObjectUrl
            })
    }
}

export default new Services()