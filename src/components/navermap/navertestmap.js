import React, { useRef, useState, useEffect } from 'react';
import 'bulma/css/bulma.css'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from "react-router-dom";
import { Translate,Translator } from 'react-auto-translate';
//import Services from "../services/services";

function NaverTestMap() {

    const [lng, setLng] = useState('')
    const [lat, setLat] = useState('')

    useEffect(() => {


        const initMap = (lng, lat) => {

            var map = new window.naver.maps.Map('map', {
                center: new window.naver.maps.LatLng(lat, lng),
                zoom: 20,
                zoomControl: true,
                zoomControlOptions: { 
                    position: window.naver.maps.Position.TOP_RIGHT
                }
            });


            var marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(lat, lng),
                map: map
            });

            var marker2 = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(37.5760222, 126.9169000),
                map: map
            });

            var polyline = new window.naver.maps.Polyline({
                map: map,
                path: [
                    new window.naver.maps.LatLng(lat, lng),
                    //new window.naver.maps.LatLng(37.013994, 127.271345),
                    new window.naver.maps.LatLng(37.5760222, 126.9169000)
                    
                ]
            });

            console.log(polyline.getClickable())
        }


        if(window.naver){
            console.log()
            console.log(window.naver)
            console.log('네이버지도 이용가능')
            
            navigator.geolocation.getCurrentPosition(async(position) => {
                console.log(position.coords.longitude, position.coords.latitude)
                setLat(position.coords.latitude)
                setLng(position.coords.longitude)
                initMap(position.coords.longitude, position.coords.latitude)
            })
            
        }else{
            console.log('네이버지도 이용 불가능')
            return
        }

    },[])


    return(
        <div>
            <div id="map" style={{ width: '100%', height: '400px' }} />
        </div>
    )
}

export default NaverTestMap