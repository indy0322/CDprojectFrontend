import React, { useRef, useState, useEffect } from 'react';
import 'bulma/css/bulma.css'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from "react-router-dom";
import { Translate,Translator } from 'react-auto-translate';
import Services from "../services/services";


function User(){

    //css 시작
    const containerStyle = {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '2px solid skyblue',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const titleStyle = {
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: '700',
        color: '#333',
    };

    const infoStyle = {
        marginBottom: '30px',
    };

    const emailStyle = {
        fontSize: '18px',
        color: '#666',
    };

    const sectionsStyle = {
        display: 'grid',
        gap: '20px',
    };

    const sectionStyle = {
        backgroundColor: '#fafafa',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        position: 'relative',
        transition: 'background-color 0.3s ease',
    };

    const sectionHoverStyle = {
        backgroundColor: '#f0f0f0',
    };

    const titleSectionStyle = {
        margin: '0',
        fontSize: '18px',
        fontWeight: '700',
    };

    const descriptionStyle = {
        marginTop: '10px',
        fontSize: '14px',
        color: '#888',
    };

    const dropdownStyle = {
        marginTop: '10px',
        padding: '0',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        borderRadius: '4px',
        position: 'absolute',
        width: '100%',
        listStyle: 'none',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '100',
    };

    const dropdownItemStyle = {
        padding: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const dropdownItemHoverStyle = {
        backgroundColor: '#f0f0f0',
    };
    //css 끝
    
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
                setNickName(userData.data.email.split('@')[0])
                setUserEmail(userData.data.email)
                setAccountLang(userData.data.language1)
                let lang = JSON.parse(sessionStorage.getItem('language')) 
                if(lang){
                    setGoogleLang(lang.lang1)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    contentLanguageTitle.innerHTML = lang.lang2
                }else{
                    console.log(userData.data.code,userData.data.language1)
                    setGoogleLang(userData.data.code)
                    const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
                    const contentLanguageTitle2 = document.getElementsByClassName("contentLanguageTitle2")[0]
                    contentLanguageTitle.innerHTML = userData.data.language1
                    contentLanguageTitle2.innerHTML = userData.data.language1
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

        
        
    },[])

    const navigate = useNavigate()

    const [googleLang, setGoogleLang] = useState('en')
    const [nickName, setNickName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [currentPassword, setcurrentPassword] = useState('')
    const [changePassword, setChangPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userLang1, setUserLang1] = useState('English')
    const [userLang2, setUserLang2] = useState('영어')
    const [userLangCode, setUserLangCode] = useState('en')
    const [message, setMessage] = useState('')
    const [accountLang, setAccountLang] = useState('English')

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })

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
    
    const onClickChangeLanguage = (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML

        sessionStorage.removeItem('language')
        sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
        setGoogleLang(e.target.id.split(' ')[0])
    }

    const onClickContentLanguage2 = () => {
        const contentsLanguage = document.getElementsByClassName("contentLanguage2")[0]
        const isActive = document.getElementsByClassName("is-active")[0]
        const languageOpen = document.getElementsByClassName("languageOpen2")[0]
        if(languageOpen){
            contentsLanguage.classList.remove("is-active")
            contentsLanguage.classList.remove("languageOpen2")
        }else if(!languageOpen){
            contentsLanguage.classList.add("is-active")
            contentsLanguage.classList.add("languageOpen2")
        }
    
    }

    const onClickChangeLanguage2 = (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("contentLanguageTitle2")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML
        console.log(e.target.id.split(' ')[0], e.target.id.split(' ')[1], e.target.id.split(' ')[2])
        setUserLang1(e.target.id.split(' ')[1])
        setUserLang2(e.target.id.split(' ')[2])
        setUserLangCode(e.target.id.split(' ')[0])

        /*sessionStorage.removeItem('language')
        sessionStorage.setItem('language',JSON.stringify({"lang1": e.target.id.split(' ')[0],"lang2": e.target.id.split(' ')[1], "lang3": e.target.id.split(' ')[2]}))
        setGoogleLang(e.target.id.split(' ')[0])*/
    }

    const modalClose = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.remove("is-active")
    }

    const modalOpen = () => {
        const modal = document.getElementsByClassName("modal")[0]
        
        modal.classList.add("is-active")
    }

    const modalClose2 = () => {
        const modal = document.getElementsByClassName("modal2")[0]

        modal.classList.remove("is-active")
    }

    const modalOpen2 = () => {
        const modal = document.getElementsByClassName("modal2")[0]
        
        modal.classList.add("is-active")
    }

    const onClickChangePassword = async () => {
        if(currentPassword){
            if((changePassword == confirmPassword) && (changePassword && confirmPassword)){
                let result = await Services.changePassword({
                    email: userEmail,
                    currentPassword: currentPassword,
                    changePassword: changePassword,
                    confirmPassword: confirmPassword,
                })
                if(result == 'Member password has been changed'){
                    const contentContainer = document.getElementsByClassName('contentContainer')[0]
                    const mainContainer = document.getElementsByClassName('mainContainer')[0]
                    contentContainer.style.display = "none"
                    mainContainer.style.display = "block"

                    setMessage(result)
                    modalOpen2()
                }else{
                    setMessage(result)
                    modalOpen2()
                }
            }else{
                setMessage('Please enter the correct password to change')
                modalOpen2()
            }
        }else{
            setMessage('Please enter your password correctly')
            modalOpen2()
        }
        
    }

    const onClickChangeLang = async () => {
        if(currentPassword){
            let result = await Services.changeLang({
                email: userEmail,
                currentPassword: currentPassword,
                code:userLangCode,
                language1:userLang1,
                language2:userLang2
            })
            if(result == 'Member language has been changed'){
                const contentContainer = document.getElementsByClassName('contentContainer')[0]
                const mainContainer = document.getElementsByClassName('mainContainer')[0]
                contentContainer.style.display = "none"
                mainContainer.style.display = "block"

                let token = await Services.login({email: userEmail, password: currentPassword})
                if(token == 'wrong password' || token == 'non-existent member'){
                    setMessage("Failed to change language")
                    modalOpen2()
                }else{
                    sessionStorage.removeItem('language')
                    sessionStorage.removeItem('userToken')
                    sessionStorage.setItem('userToken',JSON.stringify({"token": token}))

                    setMessage(result)
                    modalOpen2()
                }
                
            }else{
                setMessage(result)
                modalOpen2()
            }
        }else{
            setMessage('Please enter your password correctly')
            modalOpen2()
        }
        
    }
    
    
    return(
        <div>
            {isDesktop && <div>
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
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
                {/*<div className="logoImageContainer" style={{alignItems:"center",justifyContent:"center",display:"flex",paddingTop:"10vh",marginBottom:"3vw"}}>
                    <figure className="image" style={{height:"20vh"}}>
                        <img style={{width:"15vw", height:"15vh"}} src="/images/logo.png"/>
                    </figure>
                </div>*/}

                <div className='mainContainer'>
                    <div style={containerStyle}>
                        <h1 style={titleStyle}><Translate>Account Email</Translate></h1>
                        <div style={infoStyle}>
                            <span style={emailStyle}>{userEmail}</span>
                        </div>
                        <div style={sectionsStyle}>
                            <div style={{marginBottom:"2vh"}}>
                                <h3 style={titleSectionStyle}><Translate>Account Language</Translate></h3>
                                <p style={descriptionStyle}><Translate>Current Language</Translate>: {accountLang}</p>
                            </div>
                            <div>
                                <a class="button is-link" onClick={() => {
                                    const contentContainer = document.getElementsByClassName('contentContainer')[0]
                                    const mainContainer = document.getElementsByClassName('mainContainer')[0]
                                    contentContainer.style.display = "block"
                                    mainContainer.style.display = "none"
                                }}>
                                    <Translate>Password and Language Change</Translate>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='contentContainer' style={{display:"none", width:"30vw",marginRight:"35vw",marginLeft:"35vw",marginTop:"1vw", marginBottom:"1vw"}}>
                    <div className='passwordContainer' style={{border: "2px solid skyblue", marginBottom:"1vh", padding:"1vw"}}>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input current password</Translate></label>
                        <input className="password input is-info currentPassword" type="password" style={{marginBottom:"1vw"}} onChange={(e) => setcurrentPassword(e.target.value)}></input>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input change password</Translate></label>
                        <input className="password input is-info changePassword" type="password" onChange={(e) => setChangPassword(e.target.value)}></input>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input change password again</Translate></label>
                        <input className="password input is-info confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)}></input>

                        <div style={{marginTop:"1vh", marginBottom:"1vh"}}>
                            <a className="button is-link" onClick={onClickChangePassword}>
                                <Translate>Change member password</Translate>
                            </a>
                        </div>
                    </div>
                    <div className='langContainer' style={{border: "2px solid skyblue", padding:"1vw"}}>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input current password</Translate></label>
                        <input className="password input is-info currentPassword" type="password" style={{marginBottom:"1vw"}} onChange={(e) => setcurrentPassword(e.target.value)}></input>
                        <div style={{marginBottom:"1vw"}}>
                            <label className="label" style={{float:"left",color:"black"}}><Translate>Please select the language you want to change</Translate></label>
                        </div><br/>
                        <div className="contentLanguage2 languageOpen2 dropdown">
                            <div className="dropdown-trigger">
                                <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" style={{width:"10vw"}} onClick={onClickContentLanguage2}>
                                    <span className="contentLanguageTitle2">English</span>
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                <div className="dropdown-content" style={{width:"10vw",height:"13vh",overflowY:"scroll"}}>
                                    <a href="#" class="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="ko 한국어 한국어" onClick={onClickChangeLanguage2}>
                                        한국어
                                    </a>
                                    <a className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="ja 日本語 일본어" onClick={onClickChangeLanguage2}>
                                        日本語
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="en English 영어" onClick={onClickChangeLanguage2}>
                                        English
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage2}>
                                        中文
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage2}>
                                        Русский
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage2}>
                                        Português
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"10vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage2}>
                                        Español
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop:"2vh"}}>
                            <a className="button is-link" onClick={onClickChangeLang}>
                                <Translate>Change member language</Translate>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="modal modal2">
                    <div className="modal-background modalBackground" onClick={modalClose2}></div>
                    <div className="modal-content" style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                        <div className="box" style={{width:"20vw"}}>
                            <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose2}></button><br/>
                            <span class="tag is-warning"><Translate>{message}</Translate></span>
                        </div>
                    </div>
                </div>
                </Translator>
            </div>}




            {isMobile && <div>
                <Translator
                    //cacheProvider={cacheProvider}
                    from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}
                >
                {/*<div className="logoImageContainer" style={{alignItems:"center",justifyContent:"center",display:"flex",paddingTop:"10vh",marginBottom:"10vw"}}>
                    <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
                    <figure className="image" style={{height:"20vh"}}>
                        <img style={{width:"60vw", height:"20vh"}} src="/images/logo.png"/>
                    </figure>
                </div>*/}

                <div className='mainContainer' style={{margin:"1vw"}}>
                    <div style={containerStyle}>
                        <h1 style={titleStyle}><Translate>Account Email</Translate></h1>
                        <div style={infoStyle}>
                            <span style={emailStyle}>{userEmail}</span>
                        </div>
                        <div style={sectionsStyle}>
                            <div style={{marginBottom:"2vh"}}>
                                <h3 style={titleSectionStyle}><Translate>Account Language</Translate></h3>
                                <p style={descriptionStyle}><Translate>Current Language</Translate>: {accountLang}</p>
                            </div>
                            <div>
                                <a class="button is-link" onClick={() => {
                                    const contentContainer = document.getElementsByClassName('contentContainer')[0]
                                    const mainContainer = document.getElementsByClassName('mainContainer')[0]
                                    contentContainer.style.display = "block"
                                    mainContainer.style.display = "none"
                                }}>
                                    <Translate>Password and Language Change</Translate>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='contentContainer' style={{display:"none",margin:"4vw"}}>
                    <div className='passwordContainer' style={{border:"2px solid skyblue", padding:"1vw", marginBottom:"2vw"}}>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input current password</Translate></label>
                        <input className="password input is-info currentPassword" type="password" style={{marginBottom:"1vw"}} onChange={(e) => setcurrentPassword(e.target.value)}></input>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input change password</Translate></label>
                        <input className="password input is-info changePassword" type="password" onChange={(e) => setChangPassword(e.target.value)}></input>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input change password again</Translate></label>
                        <input className="password input is-info confirmPassword" type="password" onChange={(e) => setConfirmPassword(e.target.value)}></input>

                        <div style={{marginTop:"1vh"}}>
                            <a className="button is-link" onClick={onClickChangePassword}>
                                <Translate>Change member password</Translate>
                            </a>
                        </div> 
                    </div>
                    <div className='langContainer' style={{border:"2px solid skyblue", padding:"1vw"}}>
                        <label className="label" style={{float:"left",color:"black"}}><Translate>Please input current password</Translate></label>
                        <input className="password input is-info currentPassword" type="password" style={{marginBottom:"1vw"}} onChange={(e) => setcurrentPassword(e.target.value)}></input>
                        <div style={{marginBottom:"5vh"}}>
                            <label className="label" style={{float:"left",color:"black"}}><Translate>Please select the language you want to change</Translate></label>
                        </div><br/>
                        <div className="contentLanguage2 languageOpen2 dropdown" style={{margin:"1vw"}}>
                            <div className="dropdown-trigger">
                                <button className="button is-info" aria-haspopup="true" aria-controls="dropdown-menu3" style={{width:"20vw"}} onClick={onClickContentLanguage2}>
                                    <span className="contentLanguageTitle2">English</span>
                                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                <div className="dropdown-content" style={{width:"20vw",height:"10vh",overflowY:"scroll"}}>
                                    <a href="#" class="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="ko 한국어 한국어" onClick={onClickChangeLanguage2}>
                                        한국어
                                    </a>
                                    <a className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="ja 日本語 일본어" onClick={onClickChangeLanguage2}>
                                        日本語
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="en English 영어" onClick={onClickChangeLanguage2}>
                                        English
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="zh-CN 中文 중국어" onClick={onClickChangeLanguage2}>
                                        中文
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="ru Русский 러시아어" onClick={onClickChangeLanguage2}>
                                        Русский
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="pt Português 포르투갈어" onClick={onClickChangeLanguage2}>
                                        Português
                                    </a>
                                    <a href="#" className="dropdown-item" style={{width:"20vw",padding:"1vw"}} id="es Español 스페인어" onClick={onClickChangeLanguage2}>
                                        Español
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop:"1vh"}}>
                            <a className="button is-link" onClick={onClickChangeLang}>
                                <Translate>Change member language</Translate>
                            </a>
                        </div>
                    </div>   
                </div>
                
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

                <div className="modal modal2">
                    <div className="modal-background modalBackground" onClick={modalClose2}></div>
                    <div className="modal-content" style={{alignItems:"center",justifyContent:"center",display:"flex"}}>
                        <div className="box" style={{width:"80vw",margin:"10vw"}}>
                            <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose2}></button><br/>
                            <span class="tag is-warning"><Translate>{message}</Translate></span>
                        </div>
                    </div>
                </div>
                </Translator>

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
    )
}

export default User