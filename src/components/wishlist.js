import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import 'bulma/css/bulma.css'
import './css/wishlist.css';
import { useNavigate, useParams } from "react-router-dom";
import Services from "../services/services";
import {Translator, Translate} from 'react-auto-translate';
import axios from 'axios';




function Introduce() {

    useEffect(async () => {
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
                console.log(userData.data.email.split('@')[0])
                setNickName(userData.data.email.split('@')[0])
                let lang = JSON.parse(sessionStorage.getItem('language')) 
                if(lang){
                    setGoogleLang(lang.lang1)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = lang.lang2
                    setChatgptLang(lang.lang2)
                }else{
                    console.log(userData.data.code,userData.data.language1,userData.data.language2)
                    setGoogleLang(userData.data.code)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = userData.data.language1
                    setChatgptLang(userData.data.language1)
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



        /*let tourData = JSON.parse(sessionStorage.getItem('tourData'))
        if(tourData){
            const tourImage = document.getElementsByClassName('tourImage')[0]
            tourImage.src = tourData.firstimage
            const reviews = await Services.reviewInfo({tourId:tourData.contentid})
            
            setReviews(reviews)
            
            setTourimage(tourData.firstimage)
            setTourAddress(tourData.addr)
            setTourTitle(tourData.title)
            setTourId(tourData.contentid)
        }*/
        
    },[])

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })
    
    const navigate = useNavigate();
    const param = useParams()

    const [googleLang, setGoogleLang] = useState('en')
    const [tourLang, setTourLang] = useState()
    const [tourimage, setTourimage] = useState()
    const [tourId, setTourId] = useState('')
    const [tourAddress, setTourAddress] = useState('')
    const [tourTitle, setTourTitle] = useState('')
    const [tourX, setTourX] = useState('')
    const [tourY, setTourY] = useState('')
    const [reviewContent, setReviewContent] = useState()
    const [reviewBtn, setReviewBtn] = useState('Review')
    const [chatgptLang, setChatgptLang] = useState('')
    const [wishlist, setWishlist] = useState([])
    const [wishHeart, setWishHeart] = useState(false)

    const [nickName, setNickName] = useState('')

    
    useEffect(() => {
        if(nickName != ''){
            const getWishData = async () => {
                const searchData = {
                    nickName: nickName
                }
                setWishlist(await Services.wishInfo(searchData))
            }
            getWishData()
        }
    },[nickName])
    

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

    const modalOpen = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.add("is-active")
    }

    const modalClose = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.remove("is-active")
    }

    const onClickWishRemove = (e) => {
        console.log(e.target.id)
        setWishlist(wishlist.filter(w => String(w.date) !== e.target.id))
        Services.wishRemove2({date: e.target.id})
    }


    

    return(
        <div>
            {isDesktop && <div className="isDesktop">
            <nav class="navbar" role="navigation" aria-label="main navigation" style={{height:"8vh"}}>
                <div class="navbar-brand">
                    <a class="navbar-item" href="https://bulma.io">
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
                        <a class="navbar-item">
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
            <div className="containerWish" style={{overflowY:"scroll"}}>
                {wishlist.map((wish) => {
                    return(
                        <div className="notification is-primary" key={wish.date} style={{textAlign:"center",margin:"1vw"}}>
                            
                            {wish.tourImage == "" ? <img className="tourImage" style={{height:"20vh",width:"20vw"}} src="/images/nothing.png"/> : <img className="tourImage" style={{height:"20vh",width:"20vw"}} src={wish.tourImage}/>}
                            <button style={{float:"right"}}>
                                <img src="/images/trashcan.png" style={{width:"1.5vw"}} id={wish.date} onClick={onClickWishRemove}></img>
                            </button><br/>
                            <strong style={{color:"black"}}>{wish.tourTitle}</strong><br/>
                            <text style={{color:"black"}}>{wish.tourAddress}</text>
                        </div>
                    )
                })}
                
            </div>

            </div>}






            {isMobile && <div className="isMobile">
               
            
            <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
            <div style={{alignItems:"center",justifyContent:"center",display:"flex", marginTop:"5vh",marginBottom:"2vh"}}>
                <img src="/images/logo.png" alt="korea easy trip Logo" className="app-logo a-logo" style={{width:"60vw"}} />
            </div>
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
            <div style={{overflowY:"scroll", height:"60vh"}}>
                {wishlist.map((wish) => {
                    return(
                        <div className="notification is-primary" key={wish.date} style={{textAlign:"center",margin:"1vw"}}>
                            
                            {wish.tourImage == "" ? <img className="tourImage" style={{height:"20vh",width:"40vw"}} src="/images/nothing.png"/> : <img className="tourImage" style={{height:"20vh",width:"50vw"}} src={wish.tourImage}/>}
                            <button style={{float:"right"}}>
                                <img src="/images/trashcan.png" style={{width:"4vw"}} id={wish.date} onClick={onClickWishRemove}></img>
                            </button><br/>
                            <strong style={{color:"black"}}>{wish.tourTitle}</strong><br/>
                            <text style={{color:"black"}}>{wish.tourAddress}</text>
                        </div>
                    )
                })}
                
            </div>

            
            <div className="bottomNav" style={{height:"10vh",width:"100vw",backgroundColor:"white",bottom:"0",position:"fixed",alignItems:"center",justifyContent:"center",display:"flex"}}>
                <img type="button" src="/images/main.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                <img type="button" src="/images/blackheart.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                <img type="button" src="/images/translate.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                <img type="button" src="/images/map.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}}></img>
                <img type="button" src="/images/user.png" style={{width:"12vw",marginLeft:"3vw",marginRight:"3vw"}} onClick={modalOpen}></img>
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
            </Translator>
            </div>}
        </div>
    )
}

export default Introduce