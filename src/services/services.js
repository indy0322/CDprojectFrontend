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
                
                return await err.response.data
            }
            if(err.response.data.code == '419'){
                
                return await err.response.data
            }
            
        }
    }

    async register(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/register`,data)
            .then((res) => {
                console.log(res.data)
                return res.data
            })
    }

    async changePassword(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/changepassword',data)
            .then((res) => {
                return res.data
            })
    }

    async changeLang(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/changelang',data)
            .then((res) => {
                return res.data
            })
    }

    async reviewRegister(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewregister`,data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async reviewRemove(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewremove`,data)
                .then(async (res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async reviewInfo(data) {
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/reviewinfo`,data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async wishRegister(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/wishregister',data)
                .then(async(res) => {
                    console.log(res)
                    return await res.data
                })
    }

    async wishRemove(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/wishremove',data)
                .then(async(res) => {
                    console.log(res)
                })
    }

    async wishRemove2(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/wishremove2',data)
                .then(async(res) => {
                    console.log(res)
                })
    }

    async wishInfo(data) {
        return await axios.post('https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/wishinfo',data)
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

    async speechToText(file){
        const formData = new FormData()
        formData.append('file', file)

        return await axios.post(
            'https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/speech/stt',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
    }

    async fetchTourAPI(place){
        return await axios.get(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/tour/search`,
            {
                params: { keyword: place }
            }
        )
    }

    async tourExplain(tourTitle, chatgptLang){
        return await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/tour/explain`,
          {
            tourTitle: tourTitle,
            lang: chatgptLang
          }
        )
    }
}

export default new Services()