import React, { useRef, useState, useEffect } from 'react';
import 'bulma/css/bulma.css'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from "react-router-dom";
import { Translate,Translator } from 'react-auto-translate';
//import Services from "../services/services";

function GoogleTestMap() {

   const [currentLat, setCurrentLat] = useState()
   const [currentLng, setCurrentLng] = useState()
   const [destinationValue, setDestination] = useState()
   const [mapData, setMapData] = useState()

   

   const initMap = async(lat, lng) => {
        //const directionsService = new window.google.maps.DirectionsService(); //만약 window.google.maps.DirectionsService() is not constructor 또는 window.google.maps.Map() is not constructor 등의 오류가 발생한다면 index.html 에 있는 구글 맵 api script의 src 뒤에 &libraries=places를 추가해라 또는 다른 방식으로 src를 변경해보아라. 구글 맵을 html에 script를 추가해서 사용하는 방식은 꽤 불안정하다.
        //const directionsRenderer = new window.google.maps.DirectionsRenderer();
        const map = new window.google.maps.Map(document.getElementById("map"), {
            center: { lat: lat, lng: lng },
            zoom: 8,
        });

        const marker = new window.google.maps.Marker({
            position: { lat: lat, lng: lng },
            map,
            title: "my position",
        });

        //setMapData(map)

        /*directionsRenderer.setMap(map)

        var request = {
            origin: `${lat}, ${lng}`,
            destination: `광화문`,
            travelMode:'TRANSIT'
        }
        directionsService.route(request, function(result, status){
            if(status == 'OK'){
                directionsRenderer.setDirections(result)
            }
        })*/
   }

   const calculation = async(dest) => {
        //const { Map } = await window.google.maps.importLibrary("maps");
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        const map = new window.google.maps.Map(document.getElementById("map"), {
            center: { lat: currentLat, lng: currentLng },
            zoom: 8,
        });
        directionsRenderer.setMap(map)
        

        var request = {
            origin: `${currentLat}, ${currentLng}`,
            destination: dest,
            travelMode:'TRANSIT'
        }
        directionsService.route(request, function(result, status){
            if(status == 'OK'){
                directionsRenderer.setDirections(result)
            }
        })
   }

   const changeDestination = () => {
    const destinationV = document.getElementById('destinationValue')
    calculation(destinationV.value)
   }

   const currentPosition = () => {
        navigator.geolocation.getCurrentPosition(async(position) => {
            console.log(position.coords.longitude, position.coords.latitude)
            setCurrentLat(position.coords.latitude)
            setCurrentLng(position.coords.longitude)
            initMap(position.coords.latitude,position.coords.longitude)
            
        })
   }

   useEffect(()=> {
        

        navigator.geolocation.getCurrentPosition(async(position) => {
            console.log(position.coords.longitude, position.coords.latitude)
            setCurrentLat(position.coords.latitude)
            setCurrentLng(position.coords.longitude)
            initMap(position.coords.latitude,position.coords.longitude)
            
        })
   },[])

   


    return(
        <div>
            <div id="map" style={{ width: '100%', height: '400px' }} />
            <input id='destinationValue'></input>
            <button onClick={changeDestination}>검색</button>
            <button onClick={currentPosition}>현재위치</button>
        </div>
    )
}

export default GoogleTestMap