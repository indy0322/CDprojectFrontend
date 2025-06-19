import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import 'bulma/css/bulma.css';
import { useNavigate } from "react-router-dom";
import {Translator, Translate} from 'react-auto-translate';
import Services from "../services/services";



function Start() {

    const isDesktop = useMediaQuery({ query: '(min-width:769px)' })
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })

    const [googleLang, setGoogleLang] = useState('en')
    const [userLang1, setUserLang1] = useState('English')
    const [userLang2, setUserLang2] = useState('영어')
    const [userLangCode, setUserLangCode] = useState('en')
    const [message, setMessage] = useState('')
    const [loginMessage, setLoginMessage] = useState('')

    var num

    const navigate = useNavigate()

    const modalClose = () => {
        const modal = document.getElementsByClassName("modal")[0]

        modal.classList.remove("is-active")

        const registerPage1 = document.getElementsByClassName("registerPage1")[0]
        const registerPage2 = document.getElementsByClassName("registerPage2")[0]

        const rightArrow = document.getElementsByClassName('rightArrow')[0]
        const leftArrow = document.getElementsByClassName("leftArrow")[0]
        const arrowBtn = document.getElementsByClassName('arrowBtn')[0]
        const arrowImage = document.getElementsByClassName('arrowImage')[0]

        if(registerPage1.style.display == "none"){
            registerPage2.style.display = "none"
            registerPage1.style.display = "block"
        }

        if(leftArrow){
            arrowBtn.classList.remove('leftArrow')
            arrowBtn.classList.add('rightArrow')
            arrowImage.src = '/images/rightArrow.png'
        }
    }

    const modalOpen = () => {
        const modal = document.getElementsByClassName("modal")[0]
        modal.classList.add("is-active")
        setMessage('')
    }

    const onClickBackBtn = (e) => {
        navigate(-1)
    }



    const onClickModalContentLanguage = (e) => {
        const contentsLanguage = document.getElementsByClassName("modalcontentsLanguage")[0]
        const isActive = document.getElementsByClassName("is-active")[1]
        const languageOpen = document.getElementsByClassName("modallanguageOpen")[0]
        if(languageOpen){
            contentsLanguage.classList.remove("is-active")
            contentsLanguage.classList.remove("modallanguageOpen")
        }else if(!languageOpen){
            contentsLanguage.classList.add("is-active")
            contentsLanguage.classList.add("modallanguageOpen")
        }
        
    }

    const onClickModalChangeLanguage = (e) =>{
        const contentLanguageTitle = document.getElementsByClassName("modalcontentLanguageTitle")[0]
        contentLanguageTitle.innerHTML = e.target.innerHTML
        setUserLang1(e.target.id.split(' ')[1])
        setUserLang2(e.target.id.split(' ')[2])
        setUserLangCode(e.target.id.split(' ')[0])

    }

    const onClickAuthNumber = async (e) => {
        const certLabel = document.getElementsByClassName("certLabel")[0]
        const cert = document.getElementsByClassName("cert")[0]

        certLabel.style.display = "block"
        cert.style.display = "block"

        const registerEmail = document.getElementsByClassName("registerEmail")[0]

        if(registerEmail.value){
            num = Math.floor(Math.random()*(9999 - 1000) + 1000)
            
            var registerMessage =await Services.authNumber({email: registerEmail.value,number:num})
            setMessage(registerMessage)
            console.log(registerMessage)
        }
        
    }

    const onClickRegister = async () => {
        const certNum = document.getElementsByClassName('certNum')[0]
        console.log(num)
        const registerEmail = document.getElementsByClassName("registerEmail")[0]
        const registerPassword = document.getElementsByClassName('registerPassword')[0]

        if(registerEmail.value.includes('@')){
            var registerMessage =await Services.register({email: registerEmail.value,password:registerPassword.value,code:userLangCode,language1:userLang1,language2:userLang2})
            setMessage(registerMessage)
            console.log(registerMessage)
        }else{
            setMessage('Incorrect email format')
        }

    }

    const onClickLogin = async () => {
        setLoginMessage('')
        const loginEmail = document.getElementsByClassName('loginEmail')[0]
        const loginPassword = document.getElementsByClassName('loginPassword')[0]

        if(!loginEmail.value.includes('@')){
            setLoginMessage('Incorrect email format')
        }
        else if(loginEmail.value != '' && loginPassword.value != ''){
            let token = await Services.login({email: loginEmail.value, password: loginPassword.value})
            if(token == 'wrong password' || token == 'non-existent member'){
                setLoginMessage(token)
            }else{
                sessionStorage.removeItem('language')
                sessionStorage.removeItem('searchResult')
                sessionStorage.removeItem('tourData')
                sessionStorage.removeItem('userToken')
                sessionStorage.setItem('userToken',JSON.stringify({"token": token}))
                window.location.href = '/main'
            }
            
        }else if(loginEmail.value == '' || loginPassword.value == ''){
            setLoginMessage('Check your email or password')
        }
    }

    const onClickChangePage = () => {
        const registerPage1 = document.getElementsByClassName("registerPage1")[0]
        const registerPage2 = document.getElementsByClassName("registerPage2")[0]
        const rightArrow = document.getElementsByClassName('rightArrow')[0]
        const leftArrow = document.getElementsByClassName("leftArrow")[0]
        const arrowBtn = document.getElementsByClassName('arrowBtn')[0]
        const arrowImage = document.getElementsByClassName('arrowImage')[0]

        if(registerPage1.style.display == "block"){
            registerPage1.style.display = "none"
            registerPage2.style.display = "block"
        }else{
            registerPage2.style.display = "none"
            registerPage1.style.display = "block" 
        }

        if(rightArrow){
            arrowBtn.classList.remove('rightArrow')
            arrowBtn.classList.add('leftArrow')
            arrowImage.src = '/images/leftArrow.png'
        }else if(leftArrow){
            arrowBtn.classList.remove('leftArrow')
            arrowBtn.classList.add('rightArrow')
            arrowImage.src = '/images/rightArrow.png'
        }
    }

    return(
        <div>
            {isDesktop && <div style={{height:"100vh",background:"linear-gradient(lightCyan, skyBlue, deepSkyBlue)"}}>
                <Translator
                    //cacheProvider={cacheProvider}
                    /*from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}*/
                >
                <div className="logoImageContainer" style={{alignItems:"center",justifyContent:"center",display:"flex",paddingTop:"10vh",marginBottom:"3vw"}}>
                    <figure className="image" style={{height:"30vh"}}>
                        <img style={{width:"25vw", height:"30vh"}} src="/images/logo.png"/>
                    </figure>
                </div>
                
                
                <div className="emailPasswordContainer" style={{width:"30vw",marginRight:"35vw",marginLeft:"35vw",marginTop:"1vw", marginBottom:"1vw"}}>
                    <label className="label" style={{float:"left",color:"white"}}><Translate>Email</Translate></label>
                    <input class="email input is-info loginEmail" type="text" style={{marginBottom:"1vw"}}></input>
                    <label className="label" style={{float:"left",color:"white"}}><Translate>Password</Translate></label>
                    <input className="password input is-info loginPassword" type="password" ></input>
                </div>
                {(loginMessage != '') &&
                <div className="notification is-warning" style={{padding:"0.1vw",width:"20vw",marginLeft:"auto",marginRight:"auto",marginBottom:"0.5vh"}}>
                    <Translate>{loginMessage}</Translate>
                </div>}
                <div class="buttons" style={{alignItems:"center",justifyContent:"center"}}>
                    <button className="button is-info" onClick={onClickLogin}><Translate>Login</Translate></button>
                    <button className="button is-success" onClick={modalOpen}><Translate>Join the membership</Translate></button>
                </div>

                <div className="modal">
                    <div className="modal-background modalBackground" onClick={modalClose}></div>
                    <div className="modal-content" style={{alignItems:"center",justifyContent:"center",display:"flex",overflow:"hidden"}}>
                        <div className="box" style={{width:"30vw",height:"60vh", display:"flex", flexDirection:"column"}}>
                            <div>
                                <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button>
                            </div>

                            <div>
                                <span className="tag is-warning" style={{width:"10vw", fontSize:"1.5vw", marginBottom:"2vh"}}><Translate>Sign up</Translate></span>
                            </div>

                            <div className="registerPage1" style={{display:"block"}}>
                                <label className="label" style={{textAlign:"left"}}><Translate>Select language</Translate></label>
                                <div className="modalcontentsLanguage modallanguageOpen dropdown" style={{margin:"1vw"}}>
                                    <div className="dropdown-trigger">
                                        <button className="button is-link" aria-haspopup="true" style={{width:"20vw"}} aria-controls="dropdown-menu3" onClick={onClickModalContentLanguage}>
                                            <span className="modalcontentLanguageTitle">English</span>
                                        </button>
                                    </div>

                                    <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                        <div className="dropdown-content" style={{width:"20vw",height:"15vh",overflowY:"scroll"}}>
                                            <a href="#" class="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='ko 한국어 한국어' onClick={onClickModalChangeLanguage}>
                                                한국어
                                            </a>
                                            <a className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='ja 日本語 일본어' onClick={onClickModalChangeLanguage}>
                                                日本語
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='en English 영어' onClick={onClickModalChangeLanguage}>
                                                English
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="zh-CN 中文 중국어" onClick={onClickModalChangeLanguage}>
                                                中文
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="ru Русский 러시아어" onClick={onClickModalChangeLanguage}>
                                                Русский
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="pt Português 포르투갈어" onClick={onClickModalChangeLanguage}>
                                                Português
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"8vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="es Español 스페인어" onClick={onClickModalChangeLanguage}>
                                                Español
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="registerPage2" style={{display:"none"}}>
                                <label className="label" style={{textAlign:"left"}}><Translate>Sign up email</Translate></label>
                                <input class="email input is-info registerEmail" type="text" placeholder="Email" style={{marginBottom:"2vw"}}></input>
                                <label className="label" style={{textAlign:"left"}}><Translate>Sign up password</Translate></label>
                                <input className="password input is-info registerPassword" type="password" placeholder="Password" style={{marginBottom:"1vw"}}></input>

                                {/*<div className="certLabel" style={{width:"100vw"}}>
                                    <label className="label" style={{textAlign:"left"}}>auth number</label>
                                </div>
                                <div className="cert" style={{float:"left"}}> 
                                    <input className="input is-danger certNum" type="text" placeholder="Certifiacation" style={{marginBottom:"2vw",width:"19vw",float:"left"}}></input>
                                </div>*/}
                                {(message != '') &&
                                <div className="notification is-warning" style={{marginBottom:"1vh",padding:"0.3vw",height:"2vw"}}>
                                    <Translate>{message}</Translate>
                                </div>}
                                <div>
                                    <button className="registerBtn button is-success" style={{marginTop:"0.1vw"}} onClick={onClickRegister}><Translate>Join the membership</Translate></button>
                                </div>
                            </div>

                            <div style={{marginTop:"4vh",position:"absolute",bottom:"1vw",left:"40%",right:"40%"}}>
                                <button className="button is-success arrowBtn rightArrow" aria-haspopup="true" aria-controls="dropdown-menu3"><img src="/images/rightArrow.png" className="arrowImage" style={{height:"4vh"}} onClick={onClickChangePage}></img></button>
                            </div>
                        </div>
                    </div>
                </div>
                </Translator>  
            </div>}








            {isMobile && <div style={{height:"100vh",background:"linear-gradient(lightCyan, skyBlue, deepSkyBlue)"}}>
                <Translator
                    //cacheProvider={cacheProvider}
                    /*from='en'
                    to={googleLang}
                    googleApiKey={process.env.REACT_APP_GOOGLE}*/
                >
                <div className="logoImageContainer" style={{alignItems:"center",justifyContent:"center",display:"flex",paddingTop:"15vh",marginBottom:"10vw"}}>
                    <img className="backBtn" type="button" style={{top:"2vw", left:"2vw",position:"fixed", width:"10vw"}} onClick={onClickBackBtn} src="/images/back.png"></img>
                    <figure className="image" style={{height:"20vh"}}>
                        <img style={{width:"60vw", height:"20vh"}} src="/images/logo.png"/>
                    </figure>
                </div>
                
                <div className="emailPasswordContainer" style={{width:"90vw",margin:"5vw",display:"flex", flexDirection:"column"}}>
                    <label className="label" style={{textAlign:"left",color:"white"}}><Translate>Email</Translate></label>
                    <input class="email input is-info loginEmail" type="text" style={{marginBottom:"2vw",width:"100vw"}}></input>
                    <label className="label" style={{textAlign:"left",color:"white"}}><Translate>Password</Translate></label>
                    <input className="password input is-info loginPassword" type="password" style={{width:"100vw"}}></input>
                </div>
                {(loginMessage != '') &&
                <div className="notification is-warning" style={{marginBottom:"1vh",padding:"1vw"}}>
                    <Translate>{loginMessage}</Translate>
                </div>}
                <div class="buttons" style={{alignItems:"center",justifyContent:"center"}}>
                    <button className="button is-link" onClick={onClickLogin}><Translate>Login</Translate></button>
                    <button className="button is-success" onClick={modalOpen}><Translate>Join the membership</Translate></button>
                </div>
                


                <div className="modal">
                    <div className="modal-background modalBackground" onClick={modalClose}></div>
                    <div className="modal-content">
                        <div className="box" style={{width:"90vw",height:"60vh",margin:"5vw", display:"flex", flexDirection:"column"}}>
                            <div>
                                <button class="delete deleteBtn" aria-label="close" style={{float:"right"}} onClick={modalClose}></button>
                            </div>

                            <div>
                                <span className="tag is-warning" style={{width:"30vw", fontSize:"4vw", marginBottom:"2vh"}}><Translate>Sign up</Translate></span>
                            </div>

                            <div className="registerPage1" style={{display:"block"}}>
                                <label className="label" style={{textAlign:"left"}}><Translate>Select language</Translate></label>
                                <div className="modalcontentsLanguage modallanguageOpen dropdown" style={{margin:"2vw"}}>
                                    <div className="dropdown-trigger">
                                        <button className="button is-link" aria-haspopup="true" aria-controls="dropdown-menu3" onClick={onClickModalContentLanguage} style={{width:"50vw"}}>
                                            <span className="modalcontentLanguageTitle">English</span>
                                        </button>
                                    </div>


                                    <div className="dropdown-menu" id="dropdown-menu3" role="menu" style={{width:"100%"}}>
                                        <div className="dropdown-content" style={{width:"50vw",height:"20vh",overflowY:"scroll"}}>
                                            <a href="#" class="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='ko 한국어 한국어' onClick={onClickModalChangeLanguage}>
                                                한국어
                                            </a>
                                            <a className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='ja 日本語 일본어' onClick={onClickModalChangeLanguage}>
                                                日本語
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id='en English 영어' onClick={onClickModalChangeLanguage}>
                                                English
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="zh-CN 中文 중국어" onClick={onClickModalChangeLanguage}>
                                                中文
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="ru Русский 러시아어" onClick={onClickModalChangeLanguage}>
                                                Русский
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="pt Português 포르투갈어" onClick={onClickModalChangeLanguage}>
                                                Português
                                            </a>
                                            <a href="#" className="dropdown-item" style={{width:"15vw",padding:"1vw",marginLeft:"auto",marginRight:"auto"}} id="es Español 스페인어" onClick={onClickModalChangeLanguage}>
                                                Español
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="registerPage2" style={{display:"none"}}>
                                <label className="label" style={{textAlign:"left"}}><Translate>Sign up email</Translate></label>
                                <input class="email input is-info registerEmail" type="text" style={{marginBottom:"2vw"}}></input>
                                <label className="label" style={{textAlign:"left"}}><Translate>Sign up password</Translate></label>
                                <input className="password input is-info registerPassword" type="password" style={{marginBottom:"2vw"}}></input>

                                {(message != '') &&
                                <div className="notification is-warning" style={{marginBottom:"1vh",padding:"1vw"}}>
                                    <Translate>{message}</Translate>
                                </div>}
                                <div>
                                    <button className="registerBtn button is-success" style={{marginTop:"2vw"}} onClick={onClickRegister}><Translate>join the membership</Translate></button>
                                </div>
                            </div>

                            <div style={{marginTop:"4vh",position:"absolute",bottom:"10vw",left:"40%",right:"40%"}}>
                                <button className="button is-success arrowBtn rightArrow" aria-haspopup="true" aria-controls="dropdown-menu3"><img src="/images/rightArrow.png" className="arrowImage" style={{height:"4vh"}} onClick={onClickChangePage}></img></button>
                            </div>
                        </div>
                    </div>
                </div>
                </Translator>
            </div>}
        </div>
    )
}

export default Start