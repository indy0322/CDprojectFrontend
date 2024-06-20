import React, { useEffect, useRef, useState } from 'react';
import 'bulma/css/bulma.css'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from "react-router-dom";
import { Translate,Translator } from 'react-auto-translate';
import axios from "axios";
import Services from "../services/services";
function Map(){

    useEffect(async() => {
        const destination = document.getElementsByClassName('destination')[0]
        const startingPoint = document.getElementsByClassName('startingpoint')[0]
        let tmplang

        let userToken = JSON.parse(sessionStorage.getItem('userToken'))
        
        if(userToken){
            let option = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userToken.token
                },
                //method: "GET",
            }

            var userData = await Services.auth(option)
            if(userData.message == "정상 토큰"){
                
                let lang = JSON.parse(sessionStorage.getItem('language')) 
                if(lang){
                    setGoogleLang(lang.lang1)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = lang.lang2
                    tmplang = lang.lang1
                }else{
                    console.log(userData.data.code,userData.data.language1,userData.data.language2)
                    setGoogleLang(userData.data.code)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = userData.data.language1
                    tmplang = userData.data.code
                }
            }else{
                sessionStorage.removeItem('userToken')
                sessionStorage.removeItem('language')
                sessionStorage.removeItem('searchResult')
                sessionStorage.removeItem('tourData')
                window.location.href = '/'
            }
            
            
        }else{
            sessionStorage.removeItem('language')
            sessionStorage.removeItem('searchResult')
            sessionStorage.removeItem('tourData')
            window.location.href = '/'
        }

        navigator.geolocation.getCurrentPosition(async(position) => {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
            console.log(position.coords.latitude, position.coords.longitude)

            await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/latlng`,{lng: position.coords.longitude, lat: position.coords.latitude})
                .then(async(res) =>{
                    console.log('tmplang: ', tmplang)
                    console.log(res.data[0].text)
                    setCurrentPoint(res.data[0].text)
                    setStartPoint(res.data[0].text)
                    
                    if(tmplang != 'ko'){
                        await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${res.data[0].text}&target=${tmplang}&source=ko`)
                            .then((res) => {
                                console.log(res.data.data.translations[0].translatedText)
                                startingPoint.value = res.data.data.translations[0].translatedText
                            })
                    }else{
                        startingPoint.value = res.data[0].text
                    }
                })
        
        },(err) => {
            console.log(err)
        })

        /*let lang = JSON.parse(sessionStorage.getItem('language')) 
        if(lang){
            setGoogleLang(lang.lang1)
            const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
            contentLanguageTitle.innerHTML = lang.lang2
        }*/

        let tourData = JSON.parse(sessionStorage.getItem('tourData'))
        if(tourData){
            setTourimage(tourData.firstimage)
            setTourAddress(tourData.addr)
            setTourTitle(tourData.title)
            setTourId(tourData.contentid)
            setTourX(tourData.mapx)
            setTourY(tourData.mapy)
            setEndPoint(tourData.addr)
            
            if(tmplang != 'ko'){
                await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${tourData.addr}&target=${tmplang}&source=ko`)
                    .then((res) => {
                        console.log('tmplang: ', tmplang)
                        console.log(res.data.data.translations[0].translatedText)
                        destination.value = res.data.data.translations[0].translatedText
                    })
            }else{
                destination.value = tourData.addr
            }
            
        }

    },[])

    const navigate = useNavigate()

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })

    const [lat, setLat] = useState()
    const [lng, setLng] = useState()
    const [currentPoint, setCurrentPoint] = useState('')
    const [googleLang, setGoogleLang] = useState('en')
    const [tourLang, setTourLang] = useState()
    const [tourimage, setTourimage] = useState()
    const [tourId, setTourId] = useState('')
    const [tourAddress, setTourAddress] = useState('')
    const [tourTitle, setTourTitle] = useState('')
    const [tourX, setTourX] = useState()
    const [tourY, setTourY] = useState()
    const [currentMapState, setCurrentMapState] = useState(false)
    const [startPoint, setStartPoint] = useState('')
    const [endPoint, setEndPoint] = useState('')

    const onClickBackBtn = (e) => {
        navigate(-1)
    }

    const onClicklanguageBtn = () => {
        const languageContainer = document.getElementsByClassName("languageContainer")[0]
        const languageContainerBtn = document.getElementsByClassName("languageContainerBtn")[0]
        const langBtnOpen = document.getElementsByClassName("langBtnOpen")[0]
        const langBtnClose = document.getElementsByClassName("langBtnClose")[0]
        
        if(langBtnOpen){
            languageContainer.style.width = "0"
            languageContainerBtn.style.width = "4vw"
            languageContainerBtn.classList.remove("langBtnOpen")
            languageContainerBtn.classList.add("langBtnClose")
            
        }
        else if(langBtnClose){
            languageContainer.style.width = "30vw"
            languageContainerBtn.style.width = "35vw"
            languageContainerBtn.classList.add("langBtnOpen")
            languageContainerBtn.classList.remove("langBtnClose")
            
        }
        
    }

    const onClickContentLanguage = () => {
        const contentsLanguage = document.getElementsByClassName("contentsLanguage")[0]
        const isActive = document.getElementsByClassName("is-active")[0]
        const languageOpen = document.getElementsByClassName("languageOpen")[0]
        if(languageOpen){
            contentsLanguage.classList.remove("is-active")
            contentsLanguage.classList.remove("languageOpen")
        }else if(!languageOpen){
            contentsLanguage.classList.add("is-active")
            contentsLanguage.classList.add("languageOpen")
        }

    }
    
    const onClickChangeLanguage = async (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML

        sessionStorage.removeItem('language')
        sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
        setGoogleLang(e.target.id.split(' ')[0])

        const destination = document.getElementsByClassName('destination')[0]
        const startingPoint = document.getElementsByClassName('startingpoint')[0]


        console.log("starting.value: ", startingPoint.value, "destination.value: ", destination.value, "goolgeLang: ",googleLang, "e.target.id: ", e.target.id.split(' ')[0])

        /*let title;

        await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${tourTitle}&target=${e.target.id.split(' ')[0]}&source=ko`)
            .then((res) => {
                console.log(res.data.data.translations[0].translatedText)
                title = res.data.data.translations[0].translatedText
            })*/
        await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${startingPoint.value}&target=${e.target.id.split(' ')[0]}&source=${googleLang}`)
            .then((res) => {
                console.log(res.data.data.translations[0].translatedText)
                startingPoint.value = res.data.data.translations[0].translatedText 
            })

        await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${destination.value}&target=${e.target.id.split(' ')[0]}&source=${googleLang}`)
            .then((res) => {
                console.log(res.data.data.translations[0].translatedText)
                destination.value = res.data.data.translations[0].translatedText 
            })
    }

    const onClickCurrentMap = async () => {
        const tourMap = document.getElementsByClassName('tourMap')[0]
        setCurrentMapState(!currentMapState)

        navigator.geolocation.getCurrentPosition(async(position) => {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
            console.log(position.coords.latitude, position.coords.longitude)

            await axios.post(`https://port-0-testpro-17xco2nlt6nmnfk.sel5.cloudtype.app/api/latlng`,{lng: position.coords.longitude, lat: position.coords.latitude})
                .then(async(res) =>{
                    console.log(res.data[0].text)
                    setCurrentPoint(res.data[0].text)
                    
                    /*if(tmplang != 'ko'){
                        await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${res.data[0].text}&target=${tmplang}&source=ko`)
                            .then((res) => {
                                console.log(res.data.data.translations[0].translatedText)
                                startingPoint.value = res.data.data.translations[0].translatedText
                            })
                    }else{
                        startingPoint.value = res.data[0].text
                    }*/
                })
        
        },(err) => {
            console.log(err)
        })
    }

    const onClickRouteSearch = async () => {
        const destination = document.getElementsByClassName('destination')[0]
        const startingPoint = document.getElementsByClassName('startingpoint')[0] 
        console.log(startingPoint.value, destination.value, googleLang)

        if(googleLang != 'ko'){
            await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${startingPoint.value}&target=ko&source=${googleLang}`)
                .then((res) => {
                    console.log(res.data.data.translations[0].translatedText)
                    setStartPoint(res.data.data.translations[0].translatedText) 
                })

            await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${destination.value}&target=ko&source=${googleLang}`)
                .then((res) => {
                    console.log(res.data.data.translations[0].translatedText)
                    setEndPoint(res.data.data.translations[0].translatedText) 
                    setTourTitle(res.data.data.translations[0].translatedText)
                })
        }else{
            setStartPoint(startingPoint.value)
            setEndPoint(destination.value)
            setTourTitle(destination.value)
        }
    }

    const modalClose = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.remove("is-active")
    }

    const modalOpen = () => {
        const modal = document.getElementsByClassName("modal")[0]
        
        modal.classList.add("is-active")
    }


    return(
        <div>
            {isDesktop && <div>
                <nav class="navbar" role="navigation" aria-label="main navigation" style={{height:"8vh"}}>
                    <div class="navbar-brand">
                        <a class="navbar-item" href="#">
                        <img src="/images/logo.png" width="50" height="28"/>
                        </a>

                        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu">
                        <div class="navbar-start">
                            <a class="navbar-item">
                                Home
                            </a>
                            <a class="navbar-item">
                                Map
                            </a>
                            <a class="navbar-item">
                                Translation
                            </a>
                            <a class="navbar-item">
                                Wishlist
                            </a>
                        </div>

                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-link" onClick={() => {
                                        sessionStorage.removeItem('userToken')
                                        window.location.href="/"
                                    }}>
                                        Log out
                                    </a>
                                    <div className="contentsLanguage languageOpen dropdown">
                                        <div className="dropdown-trigger">
                                            <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={onClickContentLanguage}>
                                                <span className="contentLanguageTitle">English</span>
                                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                        <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                            <div className="dropdown-content" style={{width:"6vw",height:"30vh",overflowY:"scroll"}}>
                                                <a href="#" class="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ko 한국어 한국어" onClick={onClickChangeLanguage}>
                                                    한국어
                                                </a>
                                                <a className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ja 日本語 일본어" onClick={onClickChangeLanguage}>
                                                    日本語
                                                </a>
                                                <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="en English 영어" onClick={onClickChangeLanguage}>
                                                    English
                                                </a>
                                                <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage}>
                                                    中文
                                                </a>
                                                <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage}>
                                                    Русский
                                                </a>
                                                <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage}>
                                                    Português
                                                </a>
                                                <a href="#" className="dropdown-item" style={{width:"6vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage}>
                                                    Español
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <div className="contentsContainer" style={{position:"fixed", width:"100vw", height:"90vh",alignItems:"center",display:"flex", flexDirection:"column"}}>
                    <div>
                        {/*<img src='/images/mapkorea.png' style={{width:"40vw",height:"40vh"}}></img>*/}
                        {currentMapState ? <iframe
                            className='tourMap'
                            width={800}
                            height={380}
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE}&q=${currentPoint}&language=${googleLang}`}>
                            
                        </iframe> : <iframe
                            className='tourMap'
                            width={800}
                            height={380}
                            src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE}&origin=${startPoint}&destination=${endPoint}&language=${googleLang}&mode=transit`}>
                            
                        </iframe>}
                        
                    </div>
                    
                    <div>
                        <div style={{textAlign:"right",margin:"0.2vw"}}>
                            <Translator
                                //cacheProvider={cacheProvider}
                                from='en'
                                to={googleLang}
                                googleApiKey={process.env.REACT_APP_GOOGLE}
                            >
                            <span type="button" className="tag is-success" style={{width:"12vw",fontSize:"1vw"}} onClick={onClickCurrentMap}><Translate>{currentMapState ? "Route to tour" :"Current location"}</Translate></span>
                            </Translator> 
                        </div>
                        
                        <div style={{width:"50vw"}}>
                            <div style={{textAlign:"left"}}>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='en'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                <span className="tag is-black" style={{margin:"1vh"}}><Translate>Starting point</Translate></span>
                                </Translator>
                            </div>
                            
                            <input className="input is-primary startingpoint" type="text" style={{width:"90vw"}}></input>

                            <div style={{textAlign:"left"}}>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='en'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                <span className="tag is-warning" style={{margin:"1vh"}}><Translate>Destination</Translate></span>
                                </Translator>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='ko'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                {tourTitle && <span className="tag is-warning" style={{marginBottom:"1vh"}}><Translate>{tourTitle}</Translate></span>}
                                </Translator>
                            </div>
                            
                            <input className="input is-link destination" type="text" style={{width:"90vw"}}></input>
                            <Translator
                                //cacheProvider={cacheProvider}
                                from='en'
                                to={googleLang}
                                googleApiKey={process.env.REACT_APP_GOOGLE}
                            >
                            <button className="button is-danger" style={{marginTop:"2vh", width:"20vw"}} onClick={onClickRouteSearch}><Translate>Route search</Translate></button>
                            </Translator>
                        </div>
                        
                    </div>
                </div>
                
            </div>}







            {isMobile && <div>
                <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw",zIndex:"1"}} onClick={onClickBackBtn} src="/images/back.png"></img>
                <div className="contentsContainer" style={{position:"fixed", width:"100vw", height:"90vh",alignItems:"center",display:"flex", flexDirection:"column"}}>
                    <div>
                        {/*<img src='/images/mapkorea.png' style={{width:"100vw",height:"50vh"}}></img>*/}
                        {currentMapState ? <iframe
                            className='tourMap'
                            width="350vw"
                            height="250vh"
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE}&q=${currentPoint}&language=${googleLang}`}>
                            
                        </iframe> : <iframe
                            className='tourMap'
                            width="350vw"
                            height="250vh"
                            src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE}&origin=${startPoint}&destination=${endPoint}&language=${googleLang}&mode=transit`}>
                        </iframe>}
                    </div>
                    
                    <div>
                        <div style={{textAlign:"right",margin:"2vw"}}>
                            <Translator
                                //cacheProvider={cacheProvider}
                                from='en'
                                to={googleLang}
                                googleApiKey={process.env.REACT_APP_GOOGLE}
                            >
                            <span type="button" className="tag is-success" onClick={onClickCurrentMap}><Translate>{currentMapState ? "Route to tour" :"Current location"}</Translate></span>
                            </Translator> 
                        </div>
                        
                        <div>
                            <div style={{textAlign:"left"}}>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='en'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                <span className="tag is-black" style={{margin:"1vh"}}><Translate>Starting point</Translate></span>
                                </Translator>
                            </div>
                            <input className="input is-primary startingpoint" type="text" style={{width:"90vw"}}></input>
                            <div style={{textAlign:"left"}}>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='en'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                <span className="tag is-warning" style={{margin:"1vh"}}><Translate>Destination</Translate></span>
                                </Translator>
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='ko'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                {tourTitle && <span className="tag is-warning" style={{marginBottom:"1vh"}}><Translate>{tourTitle}</Translate></span>}
                                </Translator>
                            </div>
                            <input className="input is-link destination" type="text" style={{width:"90vw"}}></input>
                            <Translator
                                //cacheProvider={cacheProvider}
                                from='en'
                                to={googleLang}
                                googleApiKey={process.env.REACT_APP_GOOGLE}
                            >
                            <button className="button is-danger" style={{marginTop:"2vh", width:"90vw"}} onClick={onClickRouteSearch}><Translate>Route search</Translate></button>
                            </Translator>
                        </div>
                        
                    </div>
                </div>

                <div className="languageContainerBtn langBtnClose" style={{zIndex:"1", backgroundColor: "rgba(0,0,0,0)",top:"40vh",right:"0", position:"fixed", width:"4vw",height:"8vh",transition: "width 0.5s"}}>
                    <button className="languageBtn open button is-success" style={{color:"red", height:"8vh",width:"1vw",padding:"2vw",float:"left",writingMode:"vertical-rl",fontSize:"3vw"}} onClick={onClicklanguageBtn}>Language</button>
                </div>
                <div className="languageContainer" style={{zIndex:"2", backgroundColor:"white",top:"40vh",right:"0", position:"fixed", width:"0vw",height:"8vh",transition: "width 0.5s"}}>

                    <div className="contentsLanguage languageOpen dropdown" style={{margin:"2vw"}}>
                        <div className="dropdown-trigger">
                            <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={onClickContentLanguage}>
                                <span className="contentLanguageTitle">English</span>
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                            <div className="dropdown-content" style={{width:"25vw",height:"30vh",overflowY:"scroll"}}>
                                <a href="#" class="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='ko 한국어 한국어' onClick={onClickChangeLanguage}>
                                    한국어
                                </a>
                                <a className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='ja 日本語 일본어' onClick={onClickChangeLanguage}>
                                    日本語
                                </a>
                                <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id='en English 영어' onClick={onClickChangeLanguage}>
                                    English
                                </a>
                                <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage}>
                                    中文
                                </a>
                                <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage}>
                                    Русский
                                </a>
                                <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage}>
                                    Português
                                </a>
                                <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage}>
                                    Español
                                </a>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="modal">
                    <div className="modal-background modalBackground" onClick={modalClose}></div>
                    <div className="modal-content">
                        <div className="box" style={{width:"80vw",margin:"10vw"}}>
                            <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button>
                    
                            <div>
                                <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                                    sessionStorage.removeItem('userToken')
                                    window.location.href="/"
                                }}>Log out</button>
                            </div>
                            
                        </div>
                    </div>
                </div>


                <div className="bottomNav" style={{height:"10vh",width:"100vw",backgroundColor:"white",bottom:"0",position:"fixed",alignItems:"center",justifyContent:"center",display:"flex"}}>
                    <img type="button" src="/images/main.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/blackheart.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/translate.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/map.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/user.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}} onClick={modalOpen}></img>
                </div>
            </div>}
        </div>
    )
}

export default Map;