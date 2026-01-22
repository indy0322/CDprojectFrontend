import React, { useRef, useState, useEffect } from 'react';
import 'bulma/css/bulma.css'
import './css/MainPage.css'; // 스타일 파일 불러오기
//import SearchResultPage from './SearchResultPage';
import axios from 'axios';
//import './save.js';
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from "react-router-dom";
import {Translator, Translate} from 'react-auto-translate';
import Services from "../services/services";

function Search() {

    useEffect(async() => {
        

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
                setNickName(userData.data.email.split('@')[0])
                let lang = JSON.parse(sessionStorage.getItem('language')) 
                if(lang){
                    setGoogleLang(lang.lang1)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = lang.lang2
                }else{
                    console.log(userData.data.code,userData.data.language1)
                    setGoogleLang(userData.data.code)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = userData.data.language1
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

        let result = sessionStorage.getItem('searchResult')
        if(result){
            setSearchResults(JSON.parse(result))
        }
    },[])

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })

    const [searchResults, setSearchResults] = useState();
    const [googleLang, setGoogleLang] = useState('en')
    const [nickName, setNickName] = useState('')
    const searchRefMobie = useRef()
    const searchRefDesktop = useRef()

    const navigate = useNavigate()

    const onClickRecommendTag = (e) => {
        const searchInput = document.getElementsByClassName('searchInput')[0]
        searchInput.value = e.target.innerHTML
       // modalClose()
    }

    const fetchTourAPI = async (place) => {
        try {
                const res = await Services.fetchTourAPI(place);

                console.log(res.data.response.body.items.item)
                setSearchResults(res.data.response.body.items.item)
                sessionStorage.removeItem('searchResult')
                var result = res.data.response.body.items.item
                sessionStorage.setItem('searchResult',JSON.stringify(result))
            }     // Tour API 응답에서 결과를 추출하여 설정
        catch (error) {
            console.error('Error fetching tour data:', error);
        }
    };



    const handleSearchMobile = async () => {
        console.log(searchRefMobie.current.value)
        setSearchResults([])
        // 검색 버튼을 클릭할 때마다 Tour API를 호출합니다.

        if(googleLang !== 'ko'){
            try{
                await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${searchRefMobie.current.value}&target=ko&source=${googleLang}`)
                    .then((res) => {
                        console.log(res.data.data.translations[0].translatedText)
                        fetchTourAPI(res.data.data.translations[0].translatedText)
                    })
            }catch(err){
                console.error(err)
            }
        }else{
            console.log('한국어로 작동')
            fetchTourAPI(searchRefMobie.current.value);
        }
        //fetchTourAPI(searchRefMobie.current.value);
        
    };

    const handleSearchDesktop = async () => {
        console.log(searchRefDesktop.current.value)
        setSearchResults([])
        // 검색 버튼을 클릭할 때마다 Tour API를 호출합니다.

        if(googleLang != 'ko'){
            try{
                await axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE}&q=${searchRefDesktop.current.value}&target=ko&source=${googleLang}`)
                    .then((res) => {
                        console.log(res.data.data.translations[0].translatedText)
                        fetchTourAPI(res.data.data.translations[0].translatedText)
                    })
            }catch(err){
                console.error(err)
            }
        }else{
            fetchTourAPI(searchRefDesktop.current.value);
        }

        
    };

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
    
    const onClickChangeLanguage = (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML

        sessionStorage.removeItem('language')
        sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
        setGoogleLang(e.target.id.split(' ')[0])
    }

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

    const onClickRecommendContent = () => {
        const recommendContent = document.getElementsByClassName("recommendContent")[0]
        const recommendOpen = document.getElementsByClassName("recommendOpen")[0]

        if(recommendOpen){
            recommendContent.classList.remove("is-active")
            recommendContent.classList.remove("recommendOpen")
        }else if(!recommendOpen){
            recommendContent.classList.add("is-active")
            recommendContent.classList.add("recommendOpen")
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



    return (
         <div>
            {isDesktop && <div>
                <nav class="navbar" role="navigation" aria-label="main navigation" style={{height:"8vh"}}>
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/main">
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
                            <a class="navbar-item" onClick={() => {
                                window.location.href="/search"
                            }}>
                                TourList
                            </a>
                            <a class="navbar-item" onClick={() => {
                                window.location.href="/map2"
                            }}>
                                Map
                            </a>
                            <a class="navbar-item" onClick={() => {
                                window.location.href="/translate"
                            }}>
                                Translation
                            </a>
                            <a class="navbar-item" onClick={() => {
                                window.location.href="/wishlist"
                            }}>
                                Wishlist
                            </a>
                        </div>

                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div className="nickname" style={{marginRight:"1vw"}} onClick={() => {
                                    window.location.href="/user"
                                }}>
                                    <a class="button is-success" style={{fontSize:"1.1vw"}}>{nickName}</a>
                                </div>
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
                <div style={{display:"flex",justifyContent:"center", marginTop:"5vh"}}>
                    {searchResults == null && <img src="/images/logo.png" alt="korea easy trip Logo" className="app-logo a-logo" style={{width:"20vw"}} />}
                </div>
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div class="columns" style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                    <input className="input is-info searchInput" type="text" ref={searchRefDesktop} style={{width:"40vw"}}></input>
                    <button className="button is-outlined is-success" onClick={handleSearchDesktop}><Translate>search</Translate></button>
                </div>


                <div className="dropdown recommendContent recommendOpen">
                    <div className="dropdown-trigger">
                        <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" style={{width:"50vw", fontSize:"1vw"}} onClick={onClickRecommendContent}>
                            <span><Translate>Recommended area</Translate></span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                        <div className="dropdown-content" style={{width:"50vw", height:"30vh",overflowY:"scroll"}}>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Seoul</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Incheon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Suwon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Daejeon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Daegu</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Busan</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Gwangju</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Ulsan</Translate></a>
                        
                        </div>
                    </div>
                </div>
                </Translator>
                
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div class="column" style={{alignItems:"center",justifyContent:"center",display:"flex",marginTop:"1vh"}}> 
                    {searchResults == null && <div className="travel-tips a-tip"style= {{textAlign:"Left", width:"50vw" }}>
                        
                        <ul>
                            <article class="message is-dark">
                                <div class="message-header">
                                    <p><Translate>When traveling to Korea!</Translate></p>
                                    
                                </div>
                                <div class="message-body" style={{border:"solid black"}}>
                                    <Translate>The subway is convenient. Try using the T-money card.</Translate>
                                </div>
                            </article>

                            <article class="message is-dark">
                                <div class="message-header">
                                    <p><Translate>When traveling to Korea!</Translate></p>
                                    
                                </div>
                                <div class="message-body" style={{border:"solid black"}}>
                                    <Translate>Visit a Korean restaurant for one night to try traditional Korean food.</Translate>
                                </div>
                            </article>
                            
                            
                        </ul>
                    </div>}
                </div>
                </Translator>

                {searchResults != null && <div className="card" style={{height:"60vh",overflowY:"scroll"}}>
                    
                    {searchResults.map((spot) => (
                            <div style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                                <div key={spot.contentid} style={{marginBottom:"3vh",border:"solid black",padding:"0.2vw"}} onClick={() => {
                                    sessionStorage.removeItem('tourData')
                                    sessionStorage.setItem('tourData',JSON.stringify({"contentid":spot.contentid,"addr":spot.addr1,"firstimage":spot.firstimage,"cat1":spot.cat1,"cat2":spot.cat2,"cat3":spot.cat3,"mapx":spot.mapx,"mapy":spot.mapy,"title":spot.title}))
                                    window.location.href = `/introduce/${spot.contentid}`
                                }} className='has-background-warning'>
                                    {/*<div className="card-image" style={{margin:"2vh"}}>
                                    
                                        {spot.firstimage ? 
                                        <figure className="image" >
                                            <img src={spot.firstimage} alt="IMG" style={{width:"40vw"}}></img> 
                                        </figure> : 
                                        <figure className="image is-4by3">
                                            <img src="/images/nothing.png" alt="IMG"></img> 
                                        </figure>}
                                        

                                        </div>*/}

                                    <div className="search-result">
                                    <Translator
                                        //cacheProvider={cacheProvider}
                                        from='ko'
                                        to={googleLang}
                                        googleApiKey={process.env.REACT_APP_GOOGLE}
                                    >
                                        <p className="title is-4"><Translate>{spot.title}</Translate></p>
                                        {/*<p className="subtitle is-6">@{spot.addr1}</p>*/}
                                    </Translator>
                                    </div>

                                    

                                </div>
                            </div>
            
                    ))}
                </div>}

                

                
            </div>}










            {isMobile && <div className="main-page">
                
                <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
                <div style={{alignItems:"center",justifyContent:"center",display:"flex", marginTop:"5vh"}}>
                    {searchResults == null && <img src="/images/logo.png" alt="korea easy trip Logo" className="app-logo a-logo" style={{width:"60vw"}} />}
                </div>
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div className="search-container" style={{marginBottom:"3vh"}}>
                    <div class="columns" style={{margin:"0"}}>
                        <input className="input is-info searchInput" type="text" ref={searchRefMobie} style={{width:"70vw"}}></input>
                        <button className="button is-outlined is-success" onClick={handleSearchMobile}><Translate>search</Translate></button>
                    </div>
                </div>
                                    
                {/*<span class="tag is-success" style={{width:"70vw", fontSize:"4vw"}} onClick={modalOpen}><Translate>Recommended area</Translate></span>*/}







                <div className="dropdown recommendContent recommendOpen">
                    <div className="dropdown-trigger">
                        <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" style={{width:"70vw", fontSize:"4vw"}} onClick={onClickRecommendContent}>
                            <span><Translate>Recommended area</Translate></span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                        <div className="dropdown-content" style={{width:"70vw", height:"30vh",overflowY:"scroll"}}>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Seoul</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Incheon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Suwon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Daejeon</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Daegu</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Busan</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Gwangju</Translate></a>
                        <a href="#" className="dropdown-item" onClick={onClickRecommendTag} style={{padding:"1vw",marginLeft:"auto",marginRight:"auto"}}><Translate>Ulsan</Translate></a>
                        
                        </div>
                    </div>
                </div>



                </Translator> 
                {searchResults != null && <div class="card" style={{top:"28vh",bottom:"12vh",position:"fixed",overflowY:"scroll"}}>
                
                {searchResults.map((spot) => (
                        <div key={spot.contentid} style={{border:"solid black", marginBottom:"1vh", padding:"1vw"}} className='has-background-warning' onClick={() => {
                            sessionStorage.removeItem('tourData')
                            sessionStorage.setItem('tourData',JSON.stringify({"contentid":spot.contentid,"addr":spot.addr1,"firstimage":spot.firstimage,"cat1":spot.cat1,"cat2":spot.cat2,"cat3":spot.cat3,"mapx":spot.mapx,"mapy":spot.mapy,"title":spot.title}))
                            window.location.href = `/introduce/${spot.contentid}`
                        }}>
                            <div>

                                <div className="search-result">
                                <Translator
                                    //cacheProvider={cacheProvider}
                                    from='ko'
                                    to={googleLang}
                                    googleApiKey={process.env.REACT_APP_GOOGLE}
                                >
                                    <p className="title is-5"><Translate>{spot.title}</Translate></p>
                                    {/*<p className="subtitle is-6">@<Translate>{spot.addr1}</Translate></p>*/}
                                </Translator>
                                </div>

                            </div>
                            
                            
                            
                        </div>
        
                ))}
                
                </div>}
                
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div class="column" style={{alignItems:"center",justifyContent:"center",display:"flex",padding:"0",marginTop:"5vh"}}>
                    {searchResults == null && <div className="travel-tips a-tip"style= {{textAlign:"Left", width:"80vw" }}>
                        
                        <ul>
                            <article class="message is-dark">
                                <div class="message-header">
                                    <p><Translate>When traveling to Korea!</Translate></p>
                                    
                                </div>
                                <div class="message-body" style={{border:"solid black"}}>
                                    <Translate>The subway is convenient. Try using the T-money card.</Translate>
                                </div>
                            </article>

                        </ul>
                    </div>}
                </div>
                </Translator>

                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                <div className="languageContainerBtn langBtnClose" style={{zIndex:"1", backgroundColor: "rgba(0,0,0,0)",top:"40vh",right:"0", position:"fixed", width:"4vw",height:"8vh",transition: "width 0.5s"}}>
                    <button className="languageBtn open button is-success" style={{color:"red", height:"8vh",width:"1vw",padding:"2vw",float:"left",writingMode:"vertical-rl",fontSize:"3vw"}} onClick={onClicklanguageBtn}><Translate>Language</Translate></button>
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
                </Translator>





                <div className="modal">
                    <div className="modal-background modalBackground" onClick={modalClose}></div>
                    <div className="modal-content">
                        <div className="box" style={{width:"80vw",margin:"10vw"}}>
                            <span class="tag is-warning">{nickName}</span>
                            <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button><br/>
                            
                            <div style={{marginTop:"1vh"}}>
                                <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                                    window.location.href="/user"
                                }}>Profile</button>
                            </div>

                            <div style={{marginTop:"1vh"}}>
                                <button className="button is-success" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={() => {
                                    sessionStorage.removeItem('userToken')
                                    window.location.href="/"
                                }}>Log out</button>
                            </div>
                            
                        </div>
                    </div>
                </div>



                








                <div className="bottomNav" style={{height:"10vh",width:"100vw",backgroundColor:"white",bottom:"0",position:"fixed",alignItems:"center",justifyContent:"center",display:"flex"}}>    
                    <img type="button" src="/images/main.png" onClick={() => {
                        window.location.href="/main"
                    }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/blackheart.png" onClick={() => {
                        window.location.href="/wishlist"
                    }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/translate.png" onClick={() => {
                        window.location.href="/translate"
                    }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/map.png" onClick={() => {
                        window.location.href="/map2"
                    }} style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                    <img type="button" src="/images/user.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}} onClick={modalOpen}></img>
                </div>       
            </div>}
        </div>
    );
}

export default Search;